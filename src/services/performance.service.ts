import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from './logger.service';

interface QueryPerformance {
  query: any;
  duration: number;
  collection: string;
  timestamp: Date;
}

interface ResourceUsage {
  dataSize: number;
  storageSize: number;
  indexes: number;
  collections: number;
  timestamp: Date;
}

@Injectable()
export class PerformanceService {
  private readonly SLOW_QUERY_THRESHOLD = 100; // 100ms
  private readonly MAX_HISTORY_SIZE = 1000;
  private queryHistory: Map<string, QueryPerformance[]> = new Map();
  private resourceHistory: ResourceUsage[] = [];

  constructor(
    private readonly logger: Logger,
  ) {}

  /**
   * 记录查询性能
   */
  recordQueryPerformance(data: QueryPerformance): void {
    try {
      // 记录查询历史
      if (!this.queryHistory.has(data.collection)) {
        this.queryHistory.set(data.collection, []);
      }
      
      const history = this.queryHistory.get(data.collection);
      history.push(data);

      // 限制历史记录大小
      if (history.length > this.MAX_HISTORY_SIZE) {
        history.shift();
      }

      // 检查慢查询
      if (data.duration > this.SLOW_QUERY_THRESHOLD) {
        this.logger.warn(`Slow query detected in collection ${data.collection}:`, {
          query: data.query,
          duration: data.duration
        });
      }
    } catch (error) {
      this.logger.error(`Failed to record query performance: ${error.message}`);
    }
  }

  /**
   * 记录资源使用情况
   */
  recordResourceUsage(data: ResourceUsage): void {
    try {
      this.resourceHistory.push(data);

      // 限制历史记录大小
      if (this.resourceHistory.length > this.MAX_HISTORY_SIZE) {
        this.resourceHistory.shift();
      }

      // 分析资源使用趋势
      this.analyzeResourceTrends();
    } catch (error) {
      this.logger.error(`Failed to record resource usage: ${error.message}`);
    }
  }

  /**
   * 获取慢查询
   */
  async getSlowQueries(collectionName: string): Promise<QueryPerformance[]> {
    try {
      const history = this.queryHistory.get(collectionName) || [];
      return history.filter(query => query.duration > this.SLOW_QUERY_THRESHOLD);
    } catch (error) {
      this.logger.error(`Failed to get slow queries: ${error.message}`);
      throw error;
    }
  }

  /**
   * 获取查询历史
   */
  async getQueryHistory(collectionName: string): Promise<QueryPerformance[]> {
    try {
      return this.queryHistory.get(collectionName) || [];
    } catch (error) {
      this.logger.error(`Failed to get query history: ${error.message}`);
      throw error;
    }
  }

  /**
   * 分析资源使用趋势
   */
  private analyzeResourceTrends(): void {
    try {
      if (this.resourceHistory.length < 2) {
        return;
      }

      const current = this.resourceHistory[this.resourceHistory.length - 1];
      const previous = this.resourceHistory[this.resourceHistory.length - 2];

      // 分析数据大小变化
      const dataSizeChange = ((current.dataSize - previous.dataSize) / previous.dataSize) * 100;
      if (Math.abs(dataSizeChange) > 10) {
        this.logger.warn(`Significant data size change detected: ${dataSizeChange.toFixed(2)}%`);
      }

      // 分析存储大小变化
      const storageSizeChange = ((current.storageSize - previous.storageSize) / previous.storageSize) * 100;
      if (Math.abs(storageSizeChange) > 10) {
        this.logger.warn(`Significant storage size change detected: ${storageSizeChange.toFixed(2)}%`);
      }

      // 分析索引数量变化
      if (current.indexes !== previous.indexes) {
        this.logger.info(`Index count changed from ${previous.indexes} to ${current.indexes}`);
      }
    } catch (error) {
      this.logger.error(`Failed to analyze resource trends: ${error.message}`);
    }
  }

  /**
   * 获取性能报告
   */
  async getPerformanceReport(collectionName: string): Promise<any> {
    try {
      const queryHistory = this.queryHistory.get(collectionName) || [];
      const slowQueries = queryHistory.filter(query => query.duration > this.SLOW_QUERY_THRESHOLD);

      // 计算平均查询时间
      const averageQueryTime = queryHistory.reduce((acc, curr) => acc + curr.duration, 0) / queryHistory.length;

      // 计算查询分布
      const queryDistribution = this.calculateQueryDistribution(queryHistory);

      // 获取最近的资源使用情况
      const recentResourceUsage = this.resourceHistory[this.resourceHistory.length - 1];

      return {
        averageQueryTime,
        slowQueryCount: slowQueries.length,
        queryDistribution,
        resourceUsage: recentResourceUsage,
        recommendations: this.generateRecommendations(queryHistory, recentResourceUsage)
      };
    } catch (error) {
      this.logger.error(`Failed to generate performance report: ${error.message}`);
      throw error;
    }
  }

  /**
   * 计算查询时间分布
   */
  private calculateQueryDistribution(queries: QueryPerformance[]): any {
    const distribution = {
      fast: 0, // <10ms
      normal: 0, // 10-100ms
      slow: 0, // >100ms
    };

    queries.forEach(query => {
      if (query.duration < 10) {
        distribution.fast++;
      } else if (query.duration < 100) {
        distribution.normal++;
      } else {
        distribution.slow++;
      }
    });

    return distribution;
  }

  /**
   * 生成性能优化建议
   */
  private generateRecommendations(
    queries: QueryPerformance[],
    resourceUsage: ResourceUsage
  ): string[] {
    const recommendations = [];

    // 分析查询性能
    const slowQueryPercentage = (queries.filter(q => q.duration > this.SLOW_QUERY_THRESHOLD).length / queries.length) * 100;
    if (slowQueryPercentage > 10) {
      recommendations.push(`High percentage of slow queries (${slowQueryPercentage.toFixed(2)}%). Consider optimizing indexes.`);
    }

    // 分析资源使用
    if (resourceUsage) {
      const storageEfficiency = resourceUsage.dataSize / resourceUsage.storageSize;
      if (storageEfficiency < 0.5) {
        recommendations.push('Low storage efficiency. Consider running compaction.');
      }

      if (resourceUsage.indexes > 5) {
        recommendations.push('High number of indexes. Review index usage statistics.');
      }
    }

    return recommendations;
  }

  /**
   * 清理历史数据
   */
  async cleanupHistoricalData(): Promise<void> {
    try {
      // 清理查询历史
      for (const [collection, history] of this.queryHistory.entries()) {
        if (history.length > this.MAX_HISTORY_SIZE) {
          this.queryHistory.set(collection, history.slice(-this.MAX_HISTORY_SIZE));
        }
      }

      // 清理资源使用历史
      if (this.resourceHistory.length > this.MAX_HISTORY_SIZE) {
        this.resourceHistory = this.resourceHistory.slice(-this.MAX_HISTORY_SIZE);
      }

      this.logger.info('Historical data cleanup completed');
    } catch (error) {
      this.logger.error(`Failed to cleanup historical data: ${error.message}`);
      throw error;
    }
  }
} 