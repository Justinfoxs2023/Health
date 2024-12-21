import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { MongoClient, Db } from 'mongodb';
import { SystemEvents, EventSource, EventPriority } from '../communication/events';
import { injectable, inject } from 'inversify';

export interface IConnectionPoolOptions {
  /** url 的描述 */
  url: string;
  /** database 的描述 */
  database: string;
  /** minSize 的描述 */
  minSize: number;
  /** maxSize 的描述 */
  maxSize: number;
  /** acquireTimeout 的描述 */
  acquireTimeout: number;
  /** idleTimeout 的描述 */
  idleTimeout: number;
}

interface IPoolConnection {
  /** client 的描述 */
  client: MongoClient;
  /** db 的描述 */
  db: Db;
  /** lastUsed 的描述 */
  lastUsed: number;
  /** inUse 的描述 */
  inUse: false | true;
}

/**
 * 数据库连接池管理器
 */
@injectable()
export class ConnectionPool {
  private options: IConnectionPoolOptions;
  private pool: IPoolConnection[] = [];
  private waitingQueue: Array<{
    resolve: (connection: IPoolConnection) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }> = [];
  private maintenanceTimer?: NodeJS.Timeout;
  private isShuttingDown = false;

  constructor(
    @inject() private logger: Logger,
    @inject() private metrics: MetricsCollector,
    @inject() private eventBus: EventBus,
  ) {}

  /**
   * 初始化连接池
   */
  public async initialize(options: IConnectionPoolOptions): Promise<void> {
    this.options = {
      minSize: 5,
      maxSize: 20,
      acquireTimeout: 30000,
      idleTimeout: 60000,
      ...options,
    };

    try {
      // 创建初始连接
      for (let i = 0; i < this.options.minSize!; i++) {
        const connection = await this.createConnection();
        this.pool.push(connection);
      }

      this.startMaintenance();
      this.logger.info(`连接池初始化成功，当前连接数: ${this.pool.length}`);
    } catch (error) {
      this.logger.error('连接池初始化失败', error);
      throw error;
    }
  }

  /**
   * 创建新连接
   */
  private async createConnection(): Promise<IPoolConnection> {
    const client = await MongoClient.connect(this.options.url);
    const db = client.db(this.options.database);

    return {
      client,
      db,
      lastUsed: Date.now(),
      inUse: false,
    };
  }

  /**
   * 获取连接
   */
  public async acquire(): Promise<Db> {
    if (this.isShuttingDown) {
      throw new Error('连接池正在关闭');
    }

    // 查找空闲连接
    const connection = this.pool.find(conn => !conn.inUse);
    if (connection) {
      connection.inUse = true;
      connection.lastUsed = Date.now();
      this.metrics.increment(`${this.constructor.name}.connection.acquired`);
      return connection.db;
    }

    // 如果可以创建新连接
    if (this.pool.length < this.options.maxSize!) {
      const connection = await this.createConnection();
      connection.inUse = true;
      this.pool.push(connection);
      this.metrics.increment(`${this.constructor.name}.connection.created`);
      return connection.db;
    }

    // 等待可用连接
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.waitingQueue.findIndex(request => request.timeout === timeout);
        if (index !== -1) {
          this.waitingQueue.splice(index, 1);
          reject(new Error('获取连接超时'));
          this.metrics.increment(`${this.constructor.name}.connection.timeout`);
        }
      }, this.options.acquireTimeout);

      this.waitingQueue.push({
        resolve: (connection: IPoolConnection) => {
          clearTimeout(timeout);
          resolve(connection.db);
        },
        reject,
        timeout,
      });

      this.metrics.increment(`${this.constructor.name}.connection.queued`);
    });
  }

  /**
   * 释放连接
   */
  public async release(db: Db): Promise<void> {
    const connection = this.pool.find(conn => conn.db === db);
    if (!connection) {
      return;
    }

    connection.inUse = false;
    connection.lastUsed = Date.now();

    // 处理等待队列
    if (this.waitingQueue.length > 0) {
      const request = this.waitingQueue.shift()!;
      connection.inUse = true;
      request.resolve(connection);
    }

    this.metrics.increment(`${this.constructor.name}.connection.released`);
  }

  /**
   * 启动维护任务
   */
  private startMaintenance(): void {
    this.maintenanceTimer = setInterval(() => {
      this.performMaintenance();
    }, 30000); // 每30秒执行一次维护
  }

  /**
   * 执行维护任务
   */
  private async performMaintenance(): Promise<void> {
    const now = Date.now();
    const idleTimeout = this.options.idleTimeout!;

    // 关闭空闲连接
    for (let i = this.pool.length - 1; i >= this.options.minSize!; i--) {
      const connection = this.pool[i];
      if (!connection.inUse && now - connection.lastUsed > idleTimeout) {
        await connection.client.close();
        this.pool.splice(i, 1);
        this.metrics.increment(`${this.constructor.name}.connection.closed`);
      }
    }

    // 检查连接健康状态
    for (const connection of this.pool) {
      if (!connection.inUse) {
        try {
          await connection.db.admin().ping();
        } catch (error) {
          this.logger.error('连接健康检查失败，尝试重新连接', error);
          try {
            await connection.client.close();
            const newConnection = await this.createConnection();
            Object.assign(connection, newConnection);
            this.metrics.increment(`${this.constructor.name}.connection.reconnected`);
          } catch (reconnectError) {
            this.logger.error('重新连接失败', reconnectError);
            this.eventBus.publish(
              SystemEvents.ERROR,
              {
                service: this.constructor.name,
                error: 'Database connection failed',
                details:
                  reconnectError instanceof Error ? reconnectError.message : String(reconnectError),
              },
              {
                source: EventSource.SERVICE,
                priority: EventPriority.HIGH,
              },
            );
          }
        }
      }
    }
  }

  /**
   * 关闭连接池
   */
  public async shutdown(): Promise<void> {
    this.isShuttingDown = true;

    if (this.maintenanceTimer) {
      clearInterval(this.maintenanceTimer);
    }

    // 拒绝所有等待的请求
    for (const request of this.waitingQueue) {
      clearTimeout(request.timeout);
      request.reject(new Error('连接池正在关闭'));
    }
    this.waitingQueue = [];

    // 等待所有连接释放
    let retries = 30; // 最多等待30秒
    while (retries > 0 && this.pool.some(conn => conn.inUse)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      retries--;
    }

    // 关闭所有连接
    await Promise.all(
      this.pool.map(async connection => {
        try {
          await connection.client.close();
        } catch (error) {
          this.logger.error('关闭连接失败', error);
        }
      }),
    );

    this.pool = [];
    this.logger.info('连接池已关闭');
  }

  /**
   * 获取活跃连接数
   */
  public getActiveConnections(): number {
    return this.pool.filter(conn => conn.inUse).length;
  }

  /**
   * 获取等待请求数
   */
  public getWaitingRequests(): number {
    return this.waitingQueue.length;
  }

  /**
   * 获取连接池大小
   */
  public getPoolSize(): number {
    return this.pool.length;
  }

  /**
   * 获取连接池状态
   */
  public getStatus(): Record<string, any> {
    return {
      totalConnections: this.pool.length,
      activeConnections: this.getActiveConnections(),
      idleConnections: this.pool.length - this.getActiveConnections(),
      waitingRequests: this.waitingQueue.length,
      isShuttingDown: this.isShuttingDown,
    };
  }
}
