import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { ServiceRegistryService } from '../registry/service-registry.service';

@Injectable()
export class LoadBalancerService {
  private readonly serverWeights: Map<string, number> = new Map();
  private readonly serverStats: Map<
    string,
    {
      activeConnections: number;
      totalRequests: number;
      failureCount: number;
      lastFailure?: Date;
    }
  > = new Map();

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
    private readonly serviceRegistry: ServiceRegistryService,
  ) {}

  async getUpstreamServer(serviceName: string, strategy = 'round-robin'): Promise<string> {
    try {
      // 获取服务实例列表
      const instances = await this.serviceRegistry.getService(serviceName);
      if (!instances || instances.length === 0) {
        throw new Error('没有可用的服务实例');
      }

      // 根据策略选择服务器
      let server: any;
      switch (strategy) {
        case 'round-robin':
          server = await this.roundRobin(instances);
          break;
        case 'least-connections':
          server = await this.leastConnections(instances);
          break;
        case 'weighted-round-robin':
          server = await this.weightedRoundRobin(instances);
          break;
        case 'ip-hash':
          server = await this.ipHash(instances);
          break;
        default:
          server = await this.roundRobin(instances);
      }

      // 更新服务器统计信息
      await this.updateServerStats(server, 'increment');

      return `${server.host}:${server.port}`;
    } catch (error) {
      this.logger.error('获取上游服务器失败', error);
      throw error;
    }
  }

  private async roundRobin(instances: any[]): Promise<any> {
    const key = 'lb:round-robin-index';
    const index = (await this.cacheService.get(key)) || 0;

    // 选择下一个可用实例
    const server = instances[index % instances.length];

    // 更新索引
    await this.cacheService.set(key, (index + 1) % instances.length, 60);

    return server;
  }

  private async leastConnections(instances: any[]): Promise<any> {
    // 获取每个实例的当前连接数
    const serverConnections = instances.map(instance => ({
      instance,
      connections:
        this.serverStats.get(`${instance.host}:${instance.port}`)?.activeConnections || 0,
    }));

    // 选择连接数最少的实例
    return serverConnections.reduce((min, current) =>
      current.connections < min.connections ? current : min,
    ).instance;
  }

  private async weightedRoundRobin(instances: any[]): Promise<any> {
    // 计算总权重
    const totalWeight = instances.reduce(
      (sum, instance) => sum + (this.serverWeights.get(`${instance.host}:${instance.port}`) || 1),
      0,
    );

    // 获取当前权重计数
    const key = 'lb:weighted-round-robin-count';
    let currentWeight = (await this.cacheService.get(key)) || 0;
    currentWeight = (currentWeight + 1) % totalWeight;

    // 选择实例
    let accumulatedWeight = 0;
    for (const instance of instances) {
      accumulatedWeight += this.serverWeights.get(`${instance.host}:${instance.port}`) || 1;
      if (currentWeight < accumulatedWeight) {
        // 更新权重计数
        await this.cacheService.set(key, currentWeight, 60);
        return instance;
      }
    }

    return instances[0];
  }

  private async ipHash(instances: any[], clientIp?: string): Promise<any> {
    if (!clientIp) {
      return this.roundRobin(instances);
    }

    // 计算IP的哈希值
    const hash = this.hashCode(clientIp);
    return instances[hash % instances.length];
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  async updateServerWeight(server: string, weight: number): Promise<void> {
    this.serverWeights.set(server, weight);

    // 发送权重更新事件
    await this.eventBus.emit('loadbalancer.weight_updated', {
      server,
      weight,
    });
  }

  async markServerDown(server: string): Promise<void> {
    try {
      // 更新服务器状态
      const stats = this.serverStats.get(server) || {
        activeConnections: 0,
        totalRequests: 0,
        failureCount: 0,
      };

      stats.failureCount++;
      stats.lastFailure = new Date();
      this.serverStats.set(server, stats);

      // 如果失败次数超过阈值，暂时降低权重
      if (stats.failureCount >= 3) {
        await this.updateServerWeight(server, 0);
      }

      // 发送服务器故障事件
      await this.eventBus.emit('loadbalancer.server_down', { server });
    } catch (error) {
      this.logger.error('标记服务器故障失败', error);
      throw error;
    }
  }

  async markServerUp(server: string): Promise<void> {
    try {
      // 重置服务器状态
      const stats = this.serverStats.get(server);
      if (stats) {
        stats.failureCount = 0;
        stats.lastFailure = undefined;
        this.serverStats.set(server, stats);
      }

      // 恢复默认权重
      await this.updateServerWeight(server, 1);

      // 发送服务器恢复事件
      await this.eventBus.emit('loadbalancer.server_up', { server });
    } catch (error) {
      this.logger.error('标记服务器恢复失败', error);
      throw error;
    }
  }

  private async updateServerStats(
    server: any,
    operation: 'increment' | 'decrement',
  ): Promise<void> {
    const serverKey = `${server.host}:${server.port}`;
    const stats = this.serverStats.get(serverKey) || {
      activeConnections: 0,
      totalRequests: 0,
      failureCount: 0,
    };

    if (operation === 'increment') {
      stats.activeConnections++;
      stats.totalRequests++;
    } else {
      stats.activeConnections = Math.max(0, stats.activeConnections - 1);
    }

    this.serverStats.set(serverKey, stats);
  }

  async getServerStats(): Promise<any> {
    const stats: any = {};
    for (const [server, serverStats] of this.serverStats.entries()) {
      stats[server] = {
        ...serverStats,
        weight: this.serverWeights.get(server) || 1,
      };
    }
    return stats;
  }

  async handleRequest(serviceName: string, request: any): Promise<any> {
    const server = await this.getUpstreamServer(serviceName);
    try {
      // 转发请求到上游服务器
      const response = await this.forwardRequest(server, request);

      // 更新服务器统计信息
      await this.updateServerStats(
        { host: server.split(':')[0], port: server.split(':')[1] },
        'decrement',
      );

      return response;
    } catch (error) {
      // 标记服务器可能存在问题
      await this.markServerDown(server);
      throw error;
    }
  }

  private async forwardRequest(server: string, request: any): Promise<any> {
    // 实现请求转发逻辑
    throw new Error('Not implemented');
  }

  async getUpstreamServers(serviceName: string): Promise<string[]> {
    const instances = await this.serviceRegistry.getService(serviceName);
    return instances.map(instance => `${instance.host}:${instance.port}`);
  }
}
