import {
  ServiceInfo,
  ServiceDependency,
  ServiceStatus,
  ServiceEvent,
  ServiceConfig,
} from '../types/service.types';
import { CacheService } from '../cache/CacheService';
import { CircuitBreaker } from '../reliability/CircuitBreaker';
import { ConfigurationManager } from '../config/ConfigurationManager';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { injectable, inject } from 'inversify';

@injec
table()
export class ServiceIntegrationHub {
  private services: Map<string, ServiceInfo>;
  private dependencies: Map<string, ServiceDependency[]>;
  private circuitBreakers: Map<string, CircuitBreaker>;

  constructor(
    @inject() private readonly logger: Logger,
    @inject() private readonly metrics: MetricsCollector,
    @inject() private readonly cache: CacheService,
    @inject() private readonly eventBus: EventBus,
    @inject() private readonly config: ConfigurationManager,
  ) {
    this.services = new Map();
    this.dependencies = new Map();
    this.circuitBreakers = new Map();
    this.initializeEventHandlers();
  }

  /**
   * 初始化事件处理器
   */
  private initializeEventHandlers(): void {
    this.eventBus.on('service.registered', this.handleServiceRegistration.bind(this));
    this.eventBus.on('service.unregistered', this.handleServiceUnregistration.bind(this));
    this.eventBus.on('service.status.changed', this.handleServiceStatusChange.bind(this));
    this.eventBus.on('service.config.updated', this.handleServiceConfigUpdate.bind(this));
  }

  /**
   * 注册服务
   */
  public async registerService(serviceInfo: ServiceInfo): Promise<void> {
    const timer = this.metrics.startTimer('service_registration');
    try {
      // 验证服务信息
      this.validateServiceInfo(serviceInfo);

      // 检查依赖关系
      await this.checkDependencies(serviceInfo);

      // 创建断路器
      this.createCircuitBreaker(serviceInfo);

      // 注册服务
      this.services.set(serviceInfo.id, serviceInfo);
      await this.cacheServiceInfo(serviceInfo);

      // 更新依赖关系
      await this.updateDependencies(serviceInfo);

      // 发布事件
      await this.eventBus.emit('service.registered', serviceInfo);

      this.metrics.increment('service_registered');
      this.logger.info(`服务注册成功: ${serviceInfo.id}`);
    } catch (error) {
      this.logger.error('服务注册失败', error as Error);
      this.metrics.increment('service_registration_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 验证服务信息
   */
  private validateServiceInfo(serviceInfo: ServiceInfo): void {
    if (!serviceInfo.id || !serviceInfo.name || !serviceInfo.version) {
      throw new Error('服务信息不完整');
    }

    if (this.services.has(serviceInfo.id)) {
      throw new Error('服务已注册');
    }
  }

  /**
   * 检查依赖关系
   */
  private async checkDependencies(serviceInfo: ServiceInfo): Promise<void> {
    if (!serviceInfo.dependencies) return;

    for (const dep of serviceInfo.dependencies) {
      const depService = this.services.get(dep.serviceId);
      if (!depService) {
        throw new Error(`依赖服务不存在: ${dep.serviceId}`);
      }

      if (depService.status !== ServiceStatus.RUNNING) {
        throw new Error(`依赖服务未运行: ${dep.serviceId}`);
      }

      // 版本兼容性检查
      if (!this.checkVersionCompatibility(dep.version, depService.version)) {
        throw new Error(`依赖服务版本不兼容: ${dep.serviceId}`);
      }
    }
  }

  /**
   * 检查版本兼容性
   */
  private checkVersionCompatibility(required: string, actual: string): boolean {
    // 实现语义化版本比较
    const [reqMajor, reqMinor] = required.split('.').map(Number);
    const [actMajor, actMinor] = actual.split('.').map(Number);

    return actMajor === reqMajor && actMinor >= reqMinor;
  }

  /**
   * 创建断路器
   */
  private createCircuitBreaker(serviceInfo: ServiceInfo): void {
    const breaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 60000,
      onOpen: () => this.handleCircuitBreakerOpen(serviceInfo.id),
      onClose: () => this.handleCircuitBreakerClose(serviceInfo.id),
    });

    this.circuitBreakers.set(serviceInfo.id, breaker);
  }

  /**
   * 缓存服务信息
   */
  private async cacheServiceInfo(serviceInfo: ServiceInfo): Promise<void> {
    const cacheKey = `service_${serviceInfo.id}`;
    await this.cache.set(cacheKey, serviceInfo, {
      ttl: 3600,
      level: 'memory',
    });

    // 持久化缓存
    await this.cache.set(cacheKey, serviceInfo, {
      ttl: 86400,
      level: 'redis',
    });
  }

  /**
   * 更新依赖关系
   */
  private async updateDependencies(serviceInfo: ServiceInfo): Promise<void> {
    if (!serviceInfo.dependencies) return;

    this.dependencies.set(serviceInfo.id, serviceInfo.dependencies);

    // 更新反向依赖
    for (const dep of serviceInfo.dependencies) {
      const reverseDeps = this.getReverseDependencies(dep.serviceId);
      reverseDeps.push({
        serviceId: serviceInfo.id,
        version: serviceInfo.version,
        type: dep.type,
      });
    }

    // 缓存依赖关系
    await this.cacheDependencies();
  }

  /**
   * 获取反向依赖
   */
  private getReverseDependencies(serviceId: string): ServiceDependency[] {
    const reverseDeps = Array.from(this.dependencies.entries())
      .filter(([_, deps]) => deps.some(d => d.serviceId === serviceId))
      .map(([id, _]) => ({
        serviceId: id,
        version: this.services.get(id)!.version,
        type: 'runtime',
      }));

    return reverseDeps;
  }

  /**
   * 缓存依赖关系
   */
  private async cacheDependencies(): Promise<void> {
    const dependencyMap = Object.fromEntries(this.dependencies);
    await this.cache.set('service_dependencies', dependencyMap, {
      ttl: 3600,
      level: 'memory',
    });

    // 持久化缓存
    await this.cache.set('service_dependencies', dependencyMap, {
      ttl: 86400,
      level: 'redis',
    });
  }

  /**
   * 发现服务
   */
  public async discoverService(serviceId: string): Promise<ServiceInfo> {
    const timer = this.metrics.startTimer('service_discovery');
    try {
      // 检查内存缓存
      const service = this.services.get(serviceId);
      if (service) {
        this.metrics.increment('service_discovery_cache_hit');
        return service;
      }

      // 检查分布式缓存
      const cacheKey = `service_${serviceId}`;
      const cachedService = await this.cache.get(cacheKey, { level: 'redis' });
      if (cachedService) {
        this.services.set(serviceId, cachedService);
        this.metrics.increment('service_discovery_redis_hit');
        return cachedService;
      }

      throw new Error(`服务未找到: ${serviceId}`);
    } catch (error) {
      this.logger.error('服务发现失败', error as Error);
      this.metrics.increment('service_discovery_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 获取服务状态
   */
  public async getServiceStatus(serviceId: string): Promise<ServiceStatus> {
    const service = await this.discoverService(serviceId);
    return service.status;
  }

  /**
   * 更新服务状态
   */
  public async updateServiceStatus(serviceId: string, status: ServiceStatus): Promise<void> {
    const timer = this.metrics.startTimer('service_status_update');
    try {
      const service = await this.discoverService(serviceId);
      service.status = status;

      // 更新缓存
      await this.cacheServiceInfo(service);

      // 发布事件
      await this.eventBus.emit('service.status.changed', {
        serviceId,
        status,
        timestamp: Date.now(),
      });

      this.metrics.increment('service_status_updated');
    } catch (error) {
      this.logger.error('更新服务状态失败', error as Error);
      this.metrics.increment('service_status_update_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 处理服务注册事件
   */
  private async handleServiceRegistration(serviceInfo: ServiceInfo): Promise<void> {
    try {
      // 通知依赖此服务的其他服务
      const reverseDeps = this.getReverseDependencies(serviceInfo.id);
      for (const dep of reverseDeps) {
        await this.notifyServiceDependencyChange(dep.serviceId, {
          type: 'dependency_available',
          serviceId: serviceInfo.id,
        });
      }

      this.metrics.increment('service_registration_handled');
    } catch (error) {
      this.logger.error('处理服务注册事件失败', error as Error);
      this.metrics.increment('service_registration_handle_error');
    }
  }

  /**
   * 处理服务注销事件
   */
  private async handleServiceUnregistration(serviceId: string): Promise<void> {
    try {
      // 移除服务信息
      this.services.delete(serviceId);
      this.dependencies.delete(serviceId);
      this.circuitBreakers.delete(serviceId);

      // 清除缓存
      await this.cache.delete(`service_${serviceId}`);

      // 通知依赖此服务的其他服务
      const reverseDeps = this.getReverseDependencies(serviceId);
      for (const dep of reverseDeps) {
        await this.notifyServiceDependencyChange(dep.serviceId, {
          type: 'dependency_unavailable',
          serviceId,
        });
      }

      this.metrics.increment('service_unregistration_handled');
    } catch (error) {
      this.logger.error('处理服务注销事件失败', error as Error);
      this.metrics.increment('service_unregistration_handle_error');
    }
  }

  /**
   * 处理服务状态变更事件
   */
  private async handleServiceStatusChange(event: ServiceEvent): Promise<void> {
    try {
      const { serviceId, status } = event;
      const service = await this.discoverService(serviceId);

      // 更新断路器状态
      const breaker = this.circuitBreakers.get(serviceId);
      if (breaker) {
        if (status === ServiceStatus.RUNNING) {
          breaker.close();
        } else {
          breaker.open();
        }
      }

      // 通知依赖服务
      const reverseDeps = this.getReverseDependencies(serviceId);
      for (const dep of reverseDeps) {
        await this.notifyServiceDependencyChange(dep.serviceId, {
          type: 'dependency_status_changed',
          serviceId,
          status,
        });
      }

      this.metrics.increment('service_status_change_handled');
    } catch (error) {
      this.logger.error('处理服务状态变更事件失败', error as Error);
      this.metrics.increment('service_status_change_handle_error');
    }
  }

  /**
   * 处理服务配置更新事件
   */
  private async handleServiceConfigUpdate(event: ServiceEvent): Promise<void> {
    try {
      const { serviceId, config } = event;
      const service = await this.discoverService(serviceId);

      // 更新服务配置
      service.config = config as ServiceConfig;
      await this.cacheServiceInfo(service);

      // 通知依赖服务
      const reverseDeps = this.getReverseDependencies(serviceId);
      for (const dep of reverseDeps) {
        await this.notifyServiceDependencyChange(dep.serviceId, {
          type: 'dependency_config_changed',
          serviceId,
          config,
        });
      }

      this.metrics.increment('service_config_update_handled');
    } catch (error) {
      this.logger.error('处理服务配置更新事件失败', error as Error);
      this.metrics.increment('service_config_update_handle_error');
    }
  }

  /**
   * 处理断路器打开事件
   */
  private async handleCircuitBreakerOpen(serviceId: string): Promise<void> {
    try {
      await this.updateServiceStatus(serviceId, ServiceStatus.CIRCUIT_OPEN);
      this.metrics.increment('circuit_breaker_opened');
    } catch (error) {
      this.logger.error('处理断路器打开事件失败', error as Error);
      this.metrics.increment('circuit_breaker_open_handle_error');
    }
  }

  /**
   * 处理断路器关闭事件
   */
  private async handleCircuitBreakerClose(serviceId: string): Promise<void> {
    try {
      await this.updateServiceStatus(serviceId, ServiceStatus.RUNNING);
      this.metrics.increment('circuit_breaker_closed');
    } catch (error) {
      this.logger.error('处理断路器关闭事件失败', error as Error);
      this.metrics.increment('circuit_breaker_close_handle_error');
    }
  }

  /**
   * 通知服务依赖变更
   */
  private async notifyServiceDependencyChange(
    serviceId: string,
    event: ServiceEvent,
  ): Promise<void> {
    try {
      await this.eventBus.emit('service.dependency.changed', {
        serviceId,
        event,
        timestamp: Date.now(),
      });
      this.metrics.increment('dependency_change_notification_sent');
    } catch (error) {
      this.logger.error('发送依赖变更通知失败', error as Error);
      this.metrics.increment('dependency_change_notification_error');
    }
  }
}
