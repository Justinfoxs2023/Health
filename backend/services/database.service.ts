import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import { Pool, PoolConfig, QueryResult } from 'pg';

interface IDatabaseConfig extends PoolConfig {
  /** maxConnections 的描述 */
  maxConnections?: number;
  /** idleTimeout 的描述 */
  idleTimeout?: number;
  /** connectionTimeout 的描述 */
  connectionTimeout?: number;
}

export class DatabaseService extends EventEmitter {
  private pool: Pool;
  private logger: Logger;
  private isConnected = false;

  constructor(config: IDatabaseConfig) {
    super();
    this.logger = new Logger('DatabaseService');
    this.pool = new Pool({
      max: config.maxConnections || 20,
      idleTimeoutMillis: config.idleTimeout || 30000,
      connectionTimeoutMillis: config.connectionTimeout || 2000,
      ...config,
    });

    this.initializePool();
  }

  // 初始化连接池
  private initializePool(): void {
    this.pool.on('connect', () => {
      this.isConnected = true;
      this.emit('connected');
      this.logger.info('数据库连接成功');
    });

    this.pool.on('error', error => {
      this.logger.error('数据库错误:', error);
      this.emit('error', error);
    });
  }

  // 执行查询
  async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    try {
      const start = Date.now();
      const result = await this.pool.query(sql, params);
      const duration = Date.now() - start;

      this.logger.info(`查询执行时间: ${duration}ms`);
      return result;
    } catch (error) {
      this.logger.error('查询执行失败:', error);
      throw error;
    }
  }

  // 事务处理
  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 批量插入
  async batchInsert(table: string, columns: string[], values: any[][]): Promise<QueryResult> {
    const placeholders = values
      .map((_, i) => `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(',')})`)
      .join(',');

    const sql = `
      INSERT INTO ${table} (${columns.join(',')})
      VALUES ${placeholders}
    `;

    return this.query(sql, values.flat());
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  // 关闭连接池
  async close(): Promise<void> {
    await this.pool.end();
    this.isConnected = false;
    this.emit('disconnected');
    this.logger.info('数据库连接已关闭');
  }
}
