import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Logger } from './logger.service';
import { PerformanceService } from './performance.service';

@Injectable()
export class DatabaseMonitorService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly logger: Logger,
    private readonly performanceService: PerformanceService,
  ) {
    this.startMonitoring();
  }

  /**
   * 启动监控
   */
  private async startMonitoring(): Promise<void> {
    try {
      // 监控数据库连接状态
      this.monitorConnectionStatus();

      // 监控查询性能
      this.monitorQueryPerformance();

      // 监控系统资源使用
      this.monitorResourceUsage();

      this.logger.info('Database monitoring started successfully');
    } catch (error) {
      this.logger.error(`Failed to start database monitoring: ${error.message}`);
      throw error;
    }
  }

  /**
   * 监控数据库连接状态
   */
  private monitorConnectionStatus(): void {
    this.connection.on('connected', () => {
      this.logger.info('Database connected');
    });

    this.connection.on('disconnected', () => {
      this.logger.error('Database disconnected');
    });

    this.connection.on('error', error => {
      this.logger.error(`Database connection error: ${error.message}`);
    });
  }

  /**
   * 监控查询性能
   */
  private monitorQueryPerformance(): void {
    this.connection.on('query', query => {
      const startTime = Date.now();

      query.on('end', () => {
        const duration = Date.now() - startTime;
        this.performanceService.recordQueryPerformance({
          query: query.query,
          duration,
          collection: query.collection,
          timestamp: new Date(),
        });
      });
    });
  }

  /**
   * 监控系统资源使用
   */
  private async monitorResourceUsage(): Promise<void> {
    setInterval(async () => {
      try {
        const stats = await this.connection.db.stats();
        this.performanceService.recordResourceUsage({
          dataSize: stats.dataSize,
          storageSize: stats.storageSize,
          indexes: stats.indexes,
          collections: stats.collections,
          timestamp: new Date(),
        });
      } catch (error) {
        this.logger.error(`Failed to monitor resource usage: ${error.message}`);
      }
    }, 60000); // 每分钟监控一次
  }

  /**
   * 获取索引统计信息
   */
  async getIndexStats(collectionName: string): Promise<any[]> {
    try {
      const stats = await this.connection.db
        .collection(collectionName)
        .aggregate([{ $indexStats: {} }])
        .toArray();

      return stats;
    } catch (error) {
      this.logger.error(`Failed to get index stats: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取慢查询日志
   */
  async getSlowQueries(collectionName: string): Promise<any[]> {
    try {
      const slowQueries = await this.performanceService.getSlowQueries(collectionName);
      return slowQueries;
    } catch (error) {
      this.logger.error(`Failed to get slow queries: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取查询历史
   */
  async getQueryHistory(collectionName: string): Promise<any[]> {
    try {
      const queryHistory = await this.performanceService.getQueryHistory(collectionName);
      return queryHistory;
    } catch (error) {
      this.logger.error(`Failed to get query history: ${error.message}`);
      throw error;
    }
  }

  /**
   * 创建索引
   */
  async createIndex(collectionName: string, indexSpec: any): Promise<void> {
    try {
      await this.connection.db.collection(collectionName).createIndex(indexSpec);
    } catch (error) {
      this.logger.error(`Failed to create index: ${error.message}`);
      throw error;
    }
  }

  /**
   * 删除索引
   */
  async dropIndex(collectionName: string, indexName: string): Promise<void> {
    try {
      await this.connection.db.collection(collectionName).dropIndex(indexName);
    } catch (error) {
      this.logger.error(`Failed to drop index: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取集合统计信息
   */
  async getCollectionStats(collectionName: string): Promise<any> {
    try {
      const stats = await this.connection.db.collection(collectionName).stats();

      return stats;
    } catch (error) {
      this.logger.error(`Failed to get collection stats: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取数据库状态
   */
  async getDatabaseStatus(): Promise<any> {
    try {
      const status = await this.connection.db.command({ serverStatus: 1 });
      return status;
    } catch (error) {
      this.logger.error(`Failed to get database status: ${error.message}`);
      throw error;
    }
  }

  /**
   * 分析查询计划
   */
  async analyzeQueryPlan(collectionName: string, query: any): Promise<any> {
    try {
      const plan = await this.connection.db
        .collection(collectionName)
        .explain('executionStats')
        .find(query);

      return plan;
    } catch (error) {
      this.logger.error(`Failed to analyze query plan: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取连接池状态
   */
  async getConnectionPoolStats(): Promise<any> {
    try {
      const stats = await this.connection.db.command({ connPoolStats: 1 });
      return stats;
    } catch (error) {
      this.logger.error(`Failed to get connection pool stats: ${error.message}`);
      throw error;
    }
  }
}
