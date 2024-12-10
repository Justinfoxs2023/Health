import mongoose from 'mongoose';
import { logger } from '../logger';
import { cacheService } from '../cache';

class DatabaseMonitoringService {
  private readonly metricsKey = 'db:metrics';
  private readonly metricsInterval = 60000; // 1分钟
  private metricsTimer: NodeJS.Timer | null = null;

  /**
   * 启动监控
   */
  startMonitoring(): void {
    if (this.metricsTimer) {
      return;
    }

    this.metricsTimer = setInterval(async () => {
      try {
        const metrics = await this.collectMetrics();
        await this.saveMetrics(metrics);
      } catch (error) {
        logger.error('数据库指标收集失败:', error);
      }
    }, this.metricsInterval);
  }

  /**
   * 停止监控
   */
  stopMonitoring(): void {
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
      this.metricsTimer = null;
    }
  }

  /**
   * 收集数据库指标
   */
  private async collectMetrics() {
    const { connection } = mongoose;
    const { db } = connection;

    const metrics = {
      timestamp: new Date(),
      connections: {
        active: connection.states.connected,
        available: connection.states.disconnected,
        pending: connection.states.connecting
      },
      operations: await this.getOperationMetrics(db),
      memory: await this.getMemoryMetrics(db),
      collections: await this.getCollectionMetrics(db),
      indexes: await this.getIndexMetrics(db)
    };

    return metrics;
  }

  /**
   * 获取操作指标
   */
  private async getOperationMetrics(db: any) {
    const serverStatus = await db.command({ serverStatus: 1 });
    
    return {
      totalOperations: serverStatus.opcounters,
      activeConnections: serverStatus.connections,
      networkTraffic: serverStatus.network,
      queryExecutor: serverStatus.metrics.queryExecutor
    };
  }

  /**
   * 获取内存指标
   */
  private async getMemoryMetrics(db: any) {
    const serverStatus = await db.command({ serverStatus: 1 });
    
    return {
      virtualMemory: serverStatus.mem.virtual,
      residentMemory: serverStatus.mem.resident,
      pageFaults: serverStatus.extra_info.page_faults
    };
  }

  /**
   * 获取集合指标
   */
  private async getCollectionMetrics(db: any) {
    const collections = await db.listCollections().toArray();
    const metrics = [];

    for (const collection of collections) {
      const stats = await db.command({ collStats: collection.name });
      metrics.push({
        name: collection.name,
        size: stats.size,
        count: stats.count,
        avgObjSize: stats.avgObjSize,
        storageSize: stats.storageSize,
        indexes: stats.nindexes
      });
    }

    return metrics;
  }

  /**
   * 获取索引指标
   */
  private async getIndexMetrics(db: any) {
    const collections = await db.listCollections().toArray();
    const metrics = [];

    for (const collection of collections) {
      const indexes = await db.collection(collection.name).indexes();
      metrics.push({
        collection: collection.name,
        indexes: indexes.map((index: any) => ({
          name: index.name,
          keys: index.key,
          size: index.size,
          accesses: index.accesses
        }))
      });
    }

    return metrics;
  }

  /**
   * 保存指标
   */
  private async saveMetrics(metrics: any) {
    try {
      await cacheService.set(
        `${this.metricsKey}:${metrics.timestamp.getTime()}`,
        metrics,
        3600 // 1小时过期
      );
    } catch (error) {
      logger.error('保存数据库指标失败:', error);
    }
  }

  /**
   * 获取最近的指标
   */
  async getRecentMetrics(duration: number = 3600000) { // 默认1小时
    try {
      const now = Date.now();
      const start = now - duration;
      const keys = await cacheService.redis.keys(`${this.metricsKey}:*`);
      
      const metrics = [];
      for (const key of keys) {
        const timestamp = parseInt(key.split(':')[2]);
        if (timestamp >= start) {
          const metric = await cacheService.get(key);
          if (metric) {
            metrics.push(metric);
          }
        }
      }

      return metrics.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      logger.error('获取数据库指标失败:', error);
      return [];
    }
  }

  /**
   * 获取性能分析
   */
  async getPerformanceAnalysis() {
    try {
      const metrics = await this.getRecentMetrics();
      if (metrics.length === 0) {
        return null;
      }

      const latest = metrics[0];
      const analysis = {
        timestamp: new Date(),
        connectionHealth: this.analyzeConnections(latest.connections),
        operationalHealth: this.analyzeOperations(latest.operations),
        memoryHealth: this.analyzeMemory(latest.memory),
        collectionHealth: this.analyzeCollections(latest.collections),
        recommendations: []
      };

      // 添加建议
      if (analysis.connectionHealth.status === 'warning') {
        analysis.recommendations.push('考虑增加连接池大小');
      }
      if (analysis.memoryHealth.status === 'warning') {
        analysis.recommendations.push('检查内存使用情况，考虑优化查询');
      }
      if (analysis.operationalHealth.status === 'warning') {
        analysis.recommendations.push('检查慢查询，优化索引使用');
      }

      return analysis;
    } catch (error) {
      logger.error('性能分析失败:', error);
      return null;
    }
  }

  /**
   * 分析连接健康状况
   */
  private analyzeConnections(connections: any) {
    const totalConnections = connections.active + connections.available;
    const utilizationRate = connections.active / totalConnections;

    return {
      status: utilizationRate > 0.8 ? 'warning' : 'healthy',
      utilizationRate,
      details: connections
    };
  }

  /**
   * 分析操作健康状况
   */
  private analyzeOperations(operations: any) {
    const { totalOperations } = operations;
    const writeRatio = (totalOperations.insert + totalOperations.update + totalOperations.delete) /
      (totalOperations.query + totalOperations.insert + totalOperations.update + totalOperations.delete);

    return {
      status: writeRatio > 0.7 ? 'warning' : 'healthy',
      writeRatio,
      details: operations
    };
  }

  /**
   * 分析内存健康状况
   */
  private analyzeMemory(memory: any) {
    const memoryUtilization = memory.residentMemory / memory.virtualMemory;

    return {
      status: memoryUtilization > 0.8 ? 'warning' : 'healthy',
      memoryUtilization,
      details: memory
    };
  }

  /**
   * 分析集合健康状况
   */
  private analyzeCollections(collections: any[]) {
    const analysis = collections.map(collection => ({
      name: collection.name,
      status: collection.size > 1000000000 ? 'warning' : 'healthy', // 1GB警告
      details: collection
    }));

    return {
      status: analysis.some(a => a.status === 'warning') ? 'warning' : 'healthy',
      collections: analysis
    };
  }
}

export const databaseMonitoringService = new DatabaseMonitoringService(); 