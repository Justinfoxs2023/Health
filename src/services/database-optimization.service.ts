import { DatabaseMonitorService } from './database-monitor.service';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Logger } from './logger.service';
import { Model } from 'mongoose';
import { MongoClient } from 'mongodb';
import { PerformanceService } from './performance.service';

@Injectable()
export class DatabaseOptimizationService {
  constructor(
    private readonly logger: Logger,
    private readonly performanceService: PerformanceService,
    private readonly databaseMonitorService: DatabaseMonitorService,
  ) {}

  /**
   * 索引优化
   */
  async optimizeIndexes(collectionName: string): Promise<void> {
    try {
      // 获取集合的索引使用统计
      const indexStats = await this.databaseMonitorService.getIndexStats(collectionName);

      // 分析未使用的索引
      const unusedIndexes = indexStats.filter(stat => stat.accesses.ops === 0);

      // 删除未使用的索引
      for (const index of unusedIndexes) {
        await this.dropUnusedIndex(collectionName, index.name);
      }

      // 分析查询模式
      const queryPatterns = await this.analyzeQueryPatterns(collectionName);

      // 创建推荐的索引
      await this.createRecommendedIndexes(collectionName, queryPatterns);

      this.logger.info(`Completed index optimization for collection: ${collectionName}`);
    } catch (error) {
      this.logger.error(`Failed to optimize indexes: ${error.message}`);
      throw error;
    }
  }

  /**
   * 查询优化
   */
  async optimizeQueries(collectionName: string): Promise<void> {
    try {
      // 获取慢查询日志
      const slowQueries = await this.databaseMonitorService.getSlowQueries(collectionName);

      // 分析查询模式
      const queryPatterns = await this.analyzeQueryPatterns(collectionName);

      // 生成查询优化建议
      const optimizationSuggestions = await this.generateQueryOptimizations(
        slowQueries,
        queryPatterns,
      );

      // 应用优化建议
      await this.applyQueryOptimizations(collectionName, optimizationSuggestions);

      this.logger.info(`Completed query optimization for collection: ${collectionName}`);
    } catch (error) {
      this.logger.error(`Failed to optimize queries: ${error.message}`);
      throw error;
    }
  }

  /**
   * 分析查询模式
   */
  private async analyzeQueryPatterns(collectionName: string): Promise<any[]> {
    try {
      // 获取查询历史
      const queryHistory = await this.databaseMonitorService.getQueryHistory(collectionName);

      // 分析查询频率和模式
      const patterns = queryHistory.reduce((acc, query) => {
        const pattern = this.extractQueryPattern(query);
        acc[pattern] = (acc[pattern] || 0) + 1;
        return acc;
      }, {});

      // 返回按频率排序的查询模式
      return Object.entries(patterns)
        .sort(([, a], [, b]) => b - a)
        .map(([pattern, frequency]) => ({ pattern, frequency }));
    } catch (error) {
      this.logger.error(`Failed to analyze query patterns: ${error.message}`);
      throw error;
    }
  }

  /**
   * 提取查询模式
   */
  private extractQueryPattern(query: any): string {
    // 移除具体的值，保留查询结构
    const pattern = JSON.parse(JSON.stringify(query));
    this.normalizeQueryPattern(pattern);
    return JSON.stringify(pattern);
  }

  /**
   * 标准化查询模式
   */
  private normalizeQueryPattern(obj: any): void {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.normalizeQueryPattern(obj[key]);
      } else if (typeof obj[key] !== 'object') {
        obj[key] = '$value';
      }
    }
  }

  /**
   * 生成���询优化建议
   */
  private async generateQueryOptimizations(
    slowQueries: any[],
    queryPatterns: any[],
  ): Promise<any[]> {
    const optimizations = [];

    for (const query of slowQueries) {
      const pattern = this.extractQueryPattern(query);
      const matchingPattern = queryPatterns.find(p => p.pattern === pattern);

      if (matchingPattern) {
        optimizations.push({
          query: query,
          frequency: matchingPattern.frequency,
          suggestions: this.generateOptimizationSuggestions(query),
        });
      }
    }

    return optimizations;
  }

  /**
   * 生成优化建议
   */
  private generateOptimizationSuggestions(query: any): string[] {
    const suggestions = [];

    // 检查查询条件
    if (Object.keys(query).length > 3) {
      suggestions.push('Consider using compound index for multiple query conditions');
    }

    // 检查排序
    if (query.sort) {
      suggestions.push('Consider adding index for sort fields');
    }

    // 检查投影
    if (query.projection && Object.keys(query.projection).length > 3) {
      suggestions.push('Consider optimizing projection to return only necessary fields');
    }

    return suggestions;
  }

  /**
   * 应用查询优化
   */
  private async applyQueryOptimizations(
    collectionName: string,
    optimizations: any[],
  ): Promise<void> {
    for (const optimization of optimizations) {
      // 创建推荐的索引
      if (optimization.suggestions.includes('Consider using compound index')) {
        await this.createCompoundIndex(collectionName, optimization.query);
      }

      // 创建排序索引
      if (optimization.suggestions.includes('Consider adding index for sort fields')) {
        await this.createSortIndex(collectionName, optimization.query.sort);
      }
    }
  }

  /**
   * 创建复合索引
   */
  private async createCompoundIndex(collectionName: string, query: any): Promise<void> {
    try {
      const indexFields = Object.keys(query).filter(key => !['sort', 'projection'].includes(key));
      const indexSpec = indexFields.reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {});

      await this.databaseMonitorService.createIndex(collectionName, indexSpec);
      this.logger.info(`Created compound index for collection ${collectionName}`);
    } catch (error) {
      this.logger.error(`Failed to create compound index: ${error.message}`);
      throw error;
    }
  }

  /**
   * 创建排序索引
   */
  private async createSortIndex(collectionName: string, sortSpec: any): Promise<void> {
    try {
      await this.databaseMonitorService.createIndex(collectionName, sortSpec);
      this.logger.info(`Created sort index for collection ${collectionName}`);
    } catch (error) {
      this.logger.error(`Failed to create sort index: ${error.message}`);
      throw error;
    }
  }

  /**
   * 删除未使用的索引
   */
  private async dropUnusedIndex(collectionName: string, indexName: string): Promise<void> {
    try {
      await this.databaseMonitorService.dropIndex(collectionName, indexName);
      this.logger.info(`Dropped unused index ${indexName} from collection ${collectionName}`);
    } catch (error) {
      this.logger.error(`Failed to drop unused index: ${error.message}`);
      throw error;
    }
  }
}
