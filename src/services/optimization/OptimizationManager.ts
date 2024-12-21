import { CacheOptimizer } from './CacheOptimizer';
import { ConcurrencyOptimizer } from './ConcurrencyOptimizer';
import { ConfigService } from '../config/ConfigurationManager';
import { DatabaseOptimizer } from './DatabaseOptimizer';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { ResourceOptimizer } from './ResourceOptimizer';

export interface IOptimizationConfig {
  /** autoOptimize 的描述 */
  autoOptimize: false | true;
  /** optimizationInterval 的描述 */
  optimizationInterval: number;
  /** targetServices 的描述 */
  targetServices: string;
  /** thresholds 的描述 */
  thresholds: {
    cpu: number;
    memory: number;
    responseTime: number;
    errorRate: number;
  };
}

export interface IOptimizationResult {
  /** service 的描述 */
  service: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** improvements 的描述 */
  improvements: {
    type: string;
    metric: string;
    before: number;
    after: number;
    improvement: number;
  }[];
  /** recommendations 的描述 */
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    type: string;
    description: string;
    impact: string;
  }[];
}

@Injectable()
export class OptimizationManager {
  private readonly config: IOptimizationConfig;
  private optimizationInterval?: NodeJS.Timeout;

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseOptimizer: DatabaseOptimizer,
    private readonly cacheOptimizer: CacheOptimizer,
    private readonly concurrencyOptimizer: ConcurrencyOptimizer,
    private readonly resourceOptimizer: ResourceOptimizer,
    private readonly metricsCollector: MetricsCollector,
  ) {
    this.config = this.configService.get('optimization');
  }

  async startOptimization(): Promise<void> {
    if (this.config.autoOptimize) {
      this.optimizationInterval = setInterval(
        () => this.runOptimizationCycle(),
        this.config.optimizationInterval,
      );
      this.logger.info('自动优化已启动');
    }
  }

  async stopOptimization(): Promise<void> {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = undefined;
      this.logger.info('自动优化已停止');
    }
  }

  async runOptimizationCycle(): Promise<void> {
    try {
      for (const service of this.config.targetServices) {
        await this.optimizeService(service);
      }
    } catch (error) {
      this.logger.error('优化周期执行失败', error);
    }
  }

  async optimizeService(serviceName: string): Promise<IOptimizationResult> {
    try {
      this.logger.info(`开始优化服务: ${serviceName}`);

      // 收集优化前的指标
      const beforeMetrics = await this.collectServiceMetrics(serviceName);

      // 执行各种优化
      await this.performOptimizations(serviceName);

      // 收集优化后的指标
      const afterMetrics = await this.collectServiceMetrics(serviceName);

      // 计算改进
      const improvements = this.calculateImprovements(beforeMetrics, afterMetrics);

      // 生成建议
      const recommendations = await this.generateRecommendations(serviceName, afterMetrics);

      const result: IOptimizationResult = {
        service: serviceName,
        timestamp: new Date(),
        improvements,
        recommendations,
      };

      this.logger.info(`服务优化完成: ${serviceName}`, result);
      return result;
    } catch (error) {
      this.logger.error(`服务优化失败: ${serviceName}`, error);
      throw error;
    }
  }

  private async performOptimizations(serviceName: string): Promise<void> {
    // 数据库优化
    await this.databaseOptimizer.optimizeForAcquisition();
    await this.databaseOptimizer.optimizeForActivation();
    await this.databaseOptimizer.optimizeForRetention();
    await this.databaseOptimizer.optimizeForRevenue();
    await this.databaseOptimizer.optimizeForReferral();

    // 缓存优化
    await this.cacheOptimizer.optimizeForAcquisition();
    await this.cacheOptimizer.optimizeForActivation();
    await this.cacheOptimizer.optimizeForRetention();
    await this.cacheOptimizer.optimizeForRevenue();
    await this.cacheOptimizer.optimizeForReferral();

    // 并发优化
    await this.concurrencyOptimizer.optimizeForAcquisition();
    await this.concurrencyOptimizer.optimizeForActivation();
    await this.concurrencyOptimizer.optimizeForRetention();
    await this.concurrencyOptimizer.optimizeForRevenue();
    await this.concurrencyOptimizer.optimizeForReferral();

    // 资源优化
    await this.resourceOptimizer.optimizeForAcquisition();
    await this.resourceOptimizer.optimizeForActivation();
    await this.resourceOptimizer.optimizeForRetention();
    await this.resourceOptimizer.optimizeForRevenue();
    await this.resourceOptimizer.optimizeForReferral();
  }

  private async collectServiceMetrics(serviceName: string): Promise<any> {
    return {
      performance: await this.metricsCollector.collectPerformanceMetrics(serviceName),
      business: await this.metricsCollector.collectBusinessMetrics(serviceName),
    };
  }

  private calculateImprovements(before: any, after: any): any[] {
    const improvements = [];

    // 计算性能改进
    if (before.performance && after.performance) {
      improvements.push({
        type: 'performance',
        metric: 'response_time',
        before: before.performance.responseTime,
        after: after.performance.responseTime,
        improvement: this.calculateImprovement(
          before.performance.responseTime,
          after.performance.responseTime,
        ),
      });

      improvements.push({
        type: 'performance',
        metric: 'error_rate',
        before: before.performance.errorRate,
        after: after.performance.errorRate,
        improvement: this.calculateImprovement(
          before.performance.errorRate,
          after.performance.errorRate,
        ),
      });
    }

    // 计算业务指标改进
    if (before.business && after.business) {
      improvements.push({
        type: 'business',
        metric: 'conversion_rate',
        before: before.business.conversionRate,
        after: after.business.conversionRate,
        improvement: this.calculateImprovement(
          before.business.conversionRate,
          after.business.conversionRate,
        ),
      });
    }

    return improvements;
  }

  private calculateImprovement(before: number, after: number): number {
    if (before === 0) return 0;
    return ((after - before) / before) * 100;
  }

  private async generateRecommendations(serviceName: string, metrics: any): Promise<any[]> {
    const recommendations = [];

    // 性能建议
    if (metrics.performance.responseTime > this.config.thresholds.responseTime) {
      recommendations.push({
        priority: 'high',
        type: 'performance',
        description: '响应时间需要优化',
        impact: '影响用户体验和转化率',
      });
    }

    // 资源建议
    if (metrics.performance.cpu > this.config.thresholds.cpu) {
      recommendations.push({
        priority: 'medium',
        type: 'resource',
        description: 'CPU使用率过高',
        impact: '可能导致服务不稳定',
      });
    }

    // 业务建议
    if (metrics.business.conversionRate < 0.1) {
      recommendations.push({
        priority: 'high',
        type: 'business',
        description: '转化率需要提升',
        impact: '直接影响业务收入',
      });
    }

    return recommendations;
  }

  // AARRR模型相关的优化管理
  async optimizeAcquisitionPhase(): Promise<void> {
    // 优化获客阶段
    await this.optimizePhase('acquisition');
  }

  async optimizeActivationPhase(): Promise<void> {
    // 优化活跃度阶段
    await this.optimizePhase('activation');
  }

  async optimizeRetentionPhase(): Promise<void> {
    // 优化留存阶段
    await this.optimizePhase('retention');
  }

  async optimizeRevenuePhase(): Promise<void> {
    // 优化收入阶段
    await this.optimizePhase('revenue');
  }

  async optimizeReferralPhase(): Promise<void> {
    // 优化传播阶段
    await this.optimizePhase('referral');
  }

  private async optimizePhase(phase: string): Promise<void> {
    const services = this.config.targetServices.filter(service => service.startsWith(phase));

    for (const service of services) {
      await this.optimizeService(service);
    }
  }
}
