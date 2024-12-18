import mongoose from 'mongoose';
import { cacheService } from '../cache';
import { databaseMonitoringService } from '../monitoring/database';
import { logger } from '../logger';

class DatabaseOptimizationService {
  private readonly SLOW_QUERY_THRESHOLD = 100; // 100ms
  private readonly INDEX_USAGE_THRESHOLD = 0.1; // 10%使用率
  private readonly DATA_RETENTION_DAYS = 90; // 90天数据保留期

  /**
   * 分析并优化查询性能
   */
  async analyzeAndOptimizeQueries() {
    try {
      const db = mongoose.connection.db;
      const slowQueries = await this.identifySlowQueries(db);
      const optimizationSuggestions = await this.generateQueryOptimizations(slowQueries);

      logger.info('查询优化建议:', optimizationSuggestions);
      return optimizationSuggestions;
    } catch (error) {
      logger.error('查询性能分析失败:', error);
      throw error;
    }
  }

  /**
   * 识别慢查询
   */
  private async identifySlowQueries(db: any) {
    const slowQueries = await db.command({
      profile: -1,
      millis: this.SLOW_QUERY_THRESHOLD,
    });

    return slowQueries.filter((query: any) => query.millis > this.SLOW_QUERY_THRESHOLD);
  }

  /**
   * 生成查询优化建议
   */
  private async generateQueryOptimizations(slowQueries: any[]) {
    const suggestions = [];

    for (const query of slowQueries) {
      const suggestion = {
        collection: query.ns,
        query: query.query,
        executionTime: query.millis,
        suggestions: [] as string[],
      };

      // 分析是否需要索引
      if (!query.planSummary.includes('IXSCAN')) {
        suggestion.suggestions.push('考虑为该查询添加索引');
      }

      // 分析是否可以使用投影
      if (!query.planSummary.includes('PROJECTION')) {
        suggestion.suggestions.push('使用投影减少返回字段');
      }

      // 分析是否可以使用限制
      if (!query.planSummary.includes('LIMIT')) {
        suggestion.suggestions.push('考虑添加结果限制');
      }

      suggestions.push(suggestion);
    }

    return suggestions;
  }

  /**
   * 优化索引使用
   */
  async optimizeIndexes() {
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      const optimizationResults = [];

      for (const collection of collections) {
        const stats = await db.collection(collection.name).stats();
        const indexes = await db.collection(collection.name).indexes();

        const unusedIndexes = indexes.filter(
          (index: any) =>
            index.accesses?.ops === 0 ||
            index.accesses?.ops / stats.totalQueryExecutions < this.INDEX_USAGE_THRESHOLD,
        );

        if (unusedIndexes.length > 0) {
          optimizationResults.push({
            collection: collection.name,
            unusedIndexes: unusedIndexes.map((index: any) => index.name),
            recommendation: '考虑删除未使用的索引',
          });
        }
      }

      return optimizationResults;
    } catch (error) {
      logger.error('索引优化分析失败:', error);
      throw error;
    }
  }

  /**
   * 清理过期数据
   */
  async cleanExpiredData() {
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      const cleanupResults = [];

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() - this.DATA_RETENTION_DAYS);

      for (const collection of collections) {
        if (collection.options.expireAfterSeconds) {
          const result = await db.collection(collection.name).deleteMany({
            createdAt: { $lt: expirationDate },
          });

          cleanupResults.push({
            collection: collection.name,
            deletedCount: result.deletedCount,
          });
        }
      }

      return cleanupResults;
    } catch (error) {
      logger.error('数据清理失败:', error);
      throw error;
    }
  }

  /**
   * 执行定期维护
   */
  async performMaintenance() {
    try {
      // 分析查询性能
      const queryOptimizations = await this.analyzeAndOptimizeQueries();

      // 优化索引
      const indexOptimizations = await this.optimizeIndexes();

      // 清理过期数据
      const cleanupResults = await this.cleanExpiredData();

      // 压缩数据库
      await mongoose.connection.db.command({ compact: 1 });

      return {
        queryOptimizations,
        indexOptimizations,
        cleanupResults,
        status: 'success',
      };
    } catch (error) {
      logger.error('数据库维护失败:', error);
      throw error;
    }
  }

  /**
   * 获取性能报告
   */
  async getPerformanceReport() {
    try {
      const metrics = await databaseMonitoringService.getRecentMetrics();
      const analysis = await databaseMonitoringService.getPerformanceAnalysis();
      const queryOptimizations = await this.analyzeAndOptimizeQueries();
      const indexOptimizations = await this.optimizeIndexes();

      return {
        metrics,
        analysis,
        queryOptimizations,
        indexOptimizations,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('性能报告生成失败:', error);
      throw error;
    }
  }
}

export const databaseOptimizationService = new DatabaseOptimizationService();
