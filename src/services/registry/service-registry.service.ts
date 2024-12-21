import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { HealthCheck } from '../monitoring/HealthCheck';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';

@Injectable()
export class ServiceRegistryService {
  private readonly healthCheckInterval: number = 30000; // 30秒
  private readonly healthChecks: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
    private readonly healthCheck: HealthCheck,
  ) {}

  async registerService(data: {
    name: string;
    version: string;
    host: string;
    port: number;
    endpoints: string[];
    metadata?: Record<string, any>;
  }): Promise<any> {
    try {
      // 验证服务信息
      await this.validateServiceInfo(data);

      // 创建服务实例
      const instance = await this.databaseService.create('service_instances', {
        ...data,
        status: 'starting',
        health: {
          status: 'unknown',
          lastCheck: new Date(),
          failureCount: 0,
        },
        registeredAt: new Date(),
        updatedAt: new Date(),
      });

      // 启动健康检查
      this.startHealthCheck(instance);

      // 更新服务缓存
      await this.updateServiceCache(instance);

      // 发送服务注册事件
      await this.eventBus.emit('service.registered', { instance });

      return instance;
    } catch (error) {
      this.logger.error('注册服务失败', error);
      throw error;
    }
  }

  private async validateServiceInfo(data: any): Promise<void> {
    if (!data.name || !data.version || !data.host || !data.port) {
      throw new Error('服务信息不完整');
    }

    // 检查服务实例是否已存在
    const existing = await this.databaseService.findOne('service_instances', {
      name: data.name,
      host: data.host,
      port: data.port,
    });

    if (existing) {
      throw new Error('服务实例已存在');
    }
  }

  private startHealthCheck(instance: any): void {
    const instanceId = instance._id.toString();

    // 清除已存在的健康检查
    if (this.healthChecks.has(instanceId)) {
      clearInterval(this.healthChecks.get(instanceId));
    }

    // 启动新的健康检查
    const interval = setInterval(async () => {
      try {
        await this.checkInstanceHealth(instance);
      } catch (error) {
        this.logger.error(`健康检查失败: ${instance.name}`, error);
      }
    }, this.healthCheckInterval);

    this.healthChecks.set(instanceId, interval);
  }

  private async checkInstanceHealth(instance: any): Promise<void> {
    try {
      // 执行健康检查
      const health = await this.healthCheck.check({
        host: instance.host,
        port: instance.port,
        timeout: 5000,
      });

      // 更新健康状态
      await this.updateInstanceHealth(instance._id, {
        status: health.status,
        lastCheck: new Date(),
        failureCount: health.status === 'healthy' ? 0 : instance.health.failureCount + 1,
      });

      // 处理故障转移
      if (health.status !== 'healthy' && instance.health.failureCount >= 3) {
        await this.handleFailover(instance);
      }
    } catch (error) {
      // 更新健康状态为不健康
      await this.updateInstanceHealth(instance._id, {
        status: 'unhealthy',
        lastCheck: new Date(),
        failureCount: instance.health.failureCount + 1,
      });

      // 处理故障转移
      if (instance.health.failureCount >= 3) {
        await this.handleFailover(instance);
      }
    }
  }

  private async updateInstanceHealth(instanceId: string, health: any): Promise<void> {
    await this.databaseService.update(
      'service_instances',
      { _id: instanceId },
      {
        health,
        status: health.status === 'healthy' ? 'running' : 'unhealthy',
        updatedAt: new Date(),
      },
    );

    // 更新服务缓存
    const instance = await this.databaseService.findOne('service_instances', { _id: instanceId });
    await this.updateServiceCache(instance);
  }

  private async handleFailover(instance: any): Promise<void> {
    try {
      // 将实例标记为不可用
      await this.databaseService.update(
        'service_instances',
        { _id: instance._id },
        {
          status: 'unavailable',
          updatedAt: new Date(),
        },
      );

      // 查找可用的备份实例
      const backupInstance = await this.findBackupInstance(instance);

      if (backupInstance) {
        // 激活备份实例
        await this.activateBackupInstance(backupInstance);
      } else {
        // 尝试启动新实例
        await this.startNewInstance(instance);
      }

      // 发送故障转移事件
      await this.eventBus.emit('service.failover', {
        failedInstance: instance,
        backupInstance,
      });
    } catch (error) {
      this.logger.error('故障转移失败', error);
      throw error;
    }
  }

  private async findBackupInstance(instance: any): Promise<any> {
    return await this.databaseService.findOne('service_instances', {
      name: instance.name,
      version: instance.version,
      status: 'standby',
      'health.status': 'healthy',
    });
  }

  private async activateBackupInstance(instance: any): Promise<void> {
    await this.databaseService.update(
      'service_instances',
      { _id: instance._id },
      {
        status: 'running',
        updatedAt: new Date(),
      },
    );

    // 更新服务缓存
    await this.updateServiceCache(instance);
  }

  private async startNewInstance(template: any): Promise<void> {
    // 实现自动启动新实例的逻辑
    throw new Error('Not implemented');
  }

  private async updateServiceCache(instance: any): Promise<void> {
    const cacheKey = `service:${instance.name}`;

    // 获取当前服务的所有健康实例
    const instances = await this.databaseService.find('service_instances', {
      name: instance.name,
      status: 'running',
      'health.status': 'healthy',
    });

    // 更新缓存
    await this.cacheService.set(cacheKey, instances, 60); // 1分钟缓存
  }

  async deregisterService(instanceId: string): Promise<void> {
    try {
      // 停止健康检查
      if (this.healthChecks.has(instanceId)) {
        clearInterval(this.healthChecks.get(instanceId));
        this.healthChecks.delete(instanceId);
      }

      // 获取实例信息
      const instance = await this.databaseService.findOne('service_instances', { _id: instanceId });
      if (!instance) {
        throw new Error('服务实例不存在');
      }

      // 删除实例
      await this.databaseService.delete('service_instances', { _id: instanceId });

      // 更新服务缓存
      await this.updateServiceCache(instance);

      // 发送服务注销事件
      await this.eventBus.emit('service.deregistered', { instance });
    } catch (error) {
      this.logger.error('注销服务失败', error);
      throw error;
    }
  }

  async getService(name: string): Promise<any[]> {
    try {
      // 先从缓存获取
      const cached = await this.cacheService.get(`service:${name}`);
      if (cached) {
        return cached;
      }

      // 从数据库获取
      const instances = await this.databaseService.find('service_instances', {
        name,
        status: 'running',
        'health.status': 'healthy',
      });

      // 更新缓存
      if (instances.length > 0) {
        await this.cacheService.set(`service:${name}`, instances, 60);
      }

      return instances;
    } catch (error) {
      this.logger.error('获取服务实例失败', error);
      throw error;
    }
  }

  async getServiceHealth(name: string): Promise<any> {
    try {
      const instances = await this.databaseService.find('service_instances', { name });

      const healthStatus = {
        total: instances.length,
        healthy: instances.filter(i => i.health.status === 'healthy').length,
        unhealthy: instances.filter(i => i.health.status === 'unhealthy').length,
        unknown: instances.filter(i => i.health.status === 'unknown').length,
        instances: instances.map(i => ({
          id: i._id,
          host: i.host,
          port: i.port,
          status: i.status,
          health: i.health,
        })),
      };

      return healthStatus;
    } catch (error) {
      this.logger.error('获取服务健康状态失败', error);
      throw error;
    }
  }

  async updateServiceMetadata(instanceId: string, metadata: Record<string, any>): Promise<void> {
    try {
      const instance = await this.databaseService.update(
        'service_instances',
        { _id: instanceId },
        {
          metadata,
          updatedAt: new Date(),
        },
      );

      // 更新服务缓存
      await this.updateServiceCache(instance);

      // 发送元数据更新事件
      await this.eventBus.emit('service.metadata_updated', {
        instanceId,
        metadata,
      });
    } catch (error) {
      this.logger.error('更新服务元数据失败', error);
      throw error;
    }
  }
}
