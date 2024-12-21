import { ConfigService } from '../config/config.service';
import { IServiceInstance } from '../../types/service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MetricsService } from '../monitoring/metrics.service';

interface IServiceHealth {
  /** responseTime 的描述 */
  responseTime: number;
  /** errorRate 的描述 */
  errorRate: number;
  /** cpuUsage 的描述 */
  cpuUsage: number;
  /** memoryUsage 的描述 */
  memoryUsage: number;
  /** lastCheck 的描述 */
  lastCheck: number;
}

interface ILoadBalancerConfig {
  /** healthCheckInterval 的描述 */
  healthCheckInterval: number;
  /** responseTimeWeight 的描述 */
  responseTimeWeight: number;
  /** errorRateWeight 的描述 */
  errorRateWeight: number;
  /** resourceWeight 的描述 */
  resourceWeight: number;
}

@Injectable()
export class SmartLoadBalancerService implements OnModuleInit {
  private readonly healthMap = new Map<string, IServiceHealth>();
  private readonly weightMap = new Map<string, number>();
  private readonly config: ILoadBalancerConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly metrics: MetricsService,
    private readonly logger: Logger,
  ) {
    this.config = {
      healthCheckInterval: parseInt(configService.get('LB_HEALTH_CHECK_INTERVAL') || '10000'),
      responseTimeWeight: parseFloat(configService.get('LB_RESPONSE_TIME_WEIGHT') || '0.4'),
      errorRateWeight: parseFloat(configService.get('LB_ERROR_RATE_WEIGHT') || '0.3'),
      resourceWeight: parseFloat(configService.get('LB_RESOURCE_WEIGHT') || '0.3'),
    };
  }

  async onModuleInit() {
    this.startHealthCheck();
  }

  private startHealthCheck() {
    setInterval(() => {
      this.checkInstancesHealth().catch(error => {
        this.logger.error('Health check failed:', error);
      });
    }, this.config.healthCheckInterval);
  }

  private async checkInstancesHealth(): Promise<void> {
    const instances = Array.from(this.healthMap.keys());
    for (const instanceId of instances) {
      try {
        const metrics = await this.metrics.getInstanceMetrics(instanceId);
        const health: IServiceHealth = {
          responseTime: metrics.responseTime,
          errorRate: metrics.errorRate,
          cpuUsage: metrics.cpuUsage,
          memoryUsage: metrics.memoryUsage,
          lastCheck: Date.now(),
        };
        this.healthMap.set(instanceId, health);
        this.updateWeight(instanceId, health);
      } catch (error) {
        this.logger.warn(`Health check failed for instance ${instanceId}:`, error);
        this.weightMap.set(instanceId, 0); // Mark as unhealthy
      }
    }
  }

  private updateWeight(instanceId: string, health: IServiceHealth): void {
    const { responseTimeWeight, errorRateWeight, resourceWeight } = this.config;

    // 计算响应时间得分 (0-1, 越低越好)
    const responseTimeScore = Math.max(0, 1 - health.responseTime / 1000);

    // 计算错误率得分 (0-1, 越低越好)
    const errorRateScore = 1 - health.errorRate;

    // 计算资源使用得分 (0-1, 越低越好)
    const resourceScore = 1 - (health.cpuUsage + health.memoryUsage) / 2;

    // 计算总权重
    const weight =
      responseTimeScore * responseTimeWeight +
      errorRateScore * errorRateWeight +
      resourceScore * resourceWeight;

    // 更新权重
    this.weightMap.set(instanceId, Math.max(0, Math.min(1, weight)));
  }

  async selectInstance(instances: IServiceInstance[]): Promise<IServiceInstance> {
    if (!instances.length) {
      throw new Error('No available instances');
    }

    // 过滤掉不健康的实例
    const healthyInstances = instances.filter(instance => this.getWeight(instance.id) > 0);

    if (!healthyInstances.length) {
      this.logger.warn('No healthy instances available, using random instance');
      return instances[Math.floor(Math.random() * instances.length)];
    }

    // 使用加权随机算法选择实例
    const totalWeight = healthyInstances.reduce(
      (sum, instance) => sum + this.getWeight(instance.id),
      0,
    );

    let random = Math.random() * totalWeight;
    for (const instance of healthyInstances) {
      const weight = this.getWeight(instance.id);
      if (random <= weight) {
        return instance;
      }
      random -= weight;
    }

    return healthyInstances[0];
  }

  private getWeight(instanceId: string): number {
    return this.weightMap.get(instanceId) || 0;
  }

  registerInstance(instance: IServiceInstance): void {
    if (!this.healthMap.has(instance.id)) {
      this.healthMap.set(instance.id, {
        responseTime: 0,
        errorRate: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        lastCheck: 0,
      });
      this.weightMap.set(instance.id, 1); // 初始权重为1
    }
  }

  deregisterInstance(instanceId: string): void {
    this.healthMap.delete(instanceId);
    this.weightMap.delete(instanceId);
  }

  getInstanceHealth(instanceId: string): IServiceHealth | undefined {
    return this.healthMap.get(instanceId);
  }

  getInstanceWeight(instanceId: string): number {
    return this.getWeight(instanceId);
  }
}
