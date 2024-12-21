import { CacheManager } from '../cache/CacheManager';
import { CircuitBreaker } from '../reliability/CircuitBreaker';
import { ConfigurationManager } from '../config/ConfigurationManager';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { injectable, inject } from 'inversify';

export interface IThirdPartyServiceConfig {
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: payment  ai  notification  storage  other;
  enabled: boolean;
  endpoint: string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
  circuitBreaker: {
    enabled: boolean;
    failureThreshold: number;
    resetTimeout: number;
  };
  auth: {
    type: 'none' | 'basic' | 'bearer' | 'key';
    credentials: Record<string, string>;
  };
  rateLimit: {
    enabled: boolean;
    maxRequests: number;
    interval: number;
  };
  monitoring: boolean;
}

export interface IServiceResponse<T = any> {
  /** success 的描述 */
    success: false | true;
  /** data 的描述 */
    data?: undefined | T;
  /** error 的描述 */
    error?: undefined | { code: string; message: string; details?: any; };
  /** metadata 的描述 */
    metadata: {
    requestId: string;
    timestamp: number;
    duration: number;
  };
}

@injectable()
export class ThirdPartyIntegrationManager {
  private services: Map<string, IThirdPartyServiceConfig> = new Map();
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private rateLimiters: Map<
    string,
    {
      requests: number;
      lastReset: number;
    }
  > = new Map();

  constructor(
    @inject() private logger: Logger,
    @inject() private configManager: ConfigurationManager,
    @inject() private cacheManager: CacheManager,
    @inject() private eventBus: EventBus,
    @inject() private metricsCollector: MetricsCollector,
  ) {
    this.initialize();
  }

  /**
   * 初始化服务
   */
  private async initialize(): Promise<void> {
    try {
      // 加载服务配置
      const configs = await this.configManager.getConfig<Record<string, IThirdPartyServiceConfig>>(
        'third_party_services',
      );

      // 初始化服务
      for (const [name, config] of Object.entries(configs)) {
        await this.registerService(name, config);
      }

      this.logger.info('第三方服务集成管理器初始化成功');
    } catch (error) {
      this.logger.error('第三方服务集成管理器初始化失败', error);
      throw error;
    }
  }

  /**
   * 注册服务
   */
  public async registerService(name: string, config: IThirdPartyServiceConfig): Promise<void> {
    try {
      // 验证配置
      this.validateServiceConfig(config);

      // 保存配置
      this.services.set(name, config);

      // 设置断路器
      if (config.circuitBreaker.enabled) {
        this.circuitBreakers.set(
          name,
          new CircuitBreaker({
            failureThreshold: config.circuitBreaker.failureThreshold,
            resetTimeout: config.circuitBreaker.resetTimeout,
          }),
        );
      }

      // 初始化限流器
      if (config.rateLimit.enabled) {
        this.rateLimiters.set(name, {
          requests: 0,
          lastReset: Date.now(),
        });
      }

      this.logger.info(`服务注册成功: ${name}`);
    } catch (error) {
      this.logger.error(`服务注册失败: ${name}`, error);
      throw error;
    }
  }

  /**
   * 调用服务
   */
  public async callService<T>(
    name: string,
    method: string,
    params?: any,
    options: {
      timeout?: number;
      retryCount?: number;
      useCache?: boolean;
      cacheTTL?: number;
    } = {},
  ): Promise<IServiceResponse<T>> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      // 获取服务配置
      const config = this.services.get(name);
      if (!config) {
        throw new Error(`服务未注册: ${name}`);
      }

      if (!config.enabled) {
        throw new Error(`服务已禁用: ${name}`);
      }

      // 检查断路器
      const circuitBreaker = this.circuitBreakers.get(name);
      if (circuitBreaker && !circuitBreaker.isAllowed()) {
        throw new Error(`服务断路器已触发: ${name}`);
      }

      // 检查限流
      if (config.rateLimit.enabled) {
        await this.checkRateLimit(name, config);
      }

      // 检查缓存
      if (options.useCache) {
        const cacheKey = this.generateCacheKey(name, method, params);
        const cachedResult = await this.cacheManager.get(cacheKey);
        if (cachedResult) {
          return this.createResponse(true, cachedResult, null, requestId, startTime);
        }
      }

      // 准备请求参数
      const requestOptions = {
        timeout: options.timeout || config.timeout,
        headers: await this.prepareAuthHeaders(config),
        retryCount: options.retryCount || config.retryCount,
        retryDelay: config.retryDelay,
      };

      // 执行请求
      const response = await this.executeRequest<T>(
        config.endpoint,
        method,
        params,
        requestOptions,
      );

      // 更��缓存
      if (options.useCache && response.success) {
        const cacheKey = this.generateCacheKey(name, method, params);
        await this.cacheManager.set(cacheKey, response.data, options.cacheTTL);
      }

      // 重置断路器
      if (circuitBreaker && response.success) {
        circuitBreaker.recordSuccess();
      }

      // 收集指标
      this.collectMetrics(name, method, startTime, response.success);

      return response;
    } catch (error) {
      // 记录失败
      const circuitBreaker = this.circuitBreakers.get(name);
      if (circuitBreaker) {
        circuitBreaker.recordFailure();
      }

      // 收集错误指标
      this.collectMetrics(name, method, startTime, false);

      // 发布错误事件
      this.eventBus.publish('third_party.error', {
        service: name,
        method,
        error,
        timestamp: Date.now(),
      });

      return this.createResponse(false, null, error, requestId, startTime);
    }
  }

  /**
   * 验证服务配置
   */
  private validateServiceConfig(config: IThirdPartyServiceConfig): void {
    if (!config.name || !config.type || !config.endpoint) {
      throw new Error('服务配置缺少必要参数');
    }

    if (config.timeout < 0 || config.retryCount < 0 || config.retryDelay < 0) {
      throw new Error('服务配置参数无效');
    }
  }

  /**
   * 检查限流
   */
  private async checkRateLimit(name: string, config: IThirdPartyServiceConfig): Promise<void> {
    const limiter = this.rateLimiters.get(name);
    if (!limiter) {
      return;
    }

    const now = Date.now();
    if (now - limiter.lastReset >= config.rateLimit.interval) {
      limiter.requests = 0;
      limiter.lastReset = now;
    }

    if (limiter.requests >= config.rateLimit.maxRequests) {
      throw new Error(`服务请求超出限制: ${name}`);
    }

    limiter.requests++;
  }

  /**
   * 准备认证头
   */
  private async prepareAuthHeaders(
    config: IThirdPartyServiceConfig,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    switch (config.auth.type) {
      case 'basic':
        const { username, password } = config.auth.credentials;
        headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString(
          'base64',
        )}`;
        break;
      case 'bearer':
        headers['Authorization'] = `Bearer ${config.auth.credentials.token}`;
        break;
      case 'key':
        headers['X-API-Key'] = config.auth.credentials.key;
        break;
    }

    return headers;
  }

  /**
   * 执行请求
   */
  private async executeRequest<T>(
    endpoint: string,
    method: string,
    params: any,
    options: {
      timeout: number;
      headers: Record<string, string>;
      retryCount: number;
      retryDelay: number;
    },
  ): Promise<IServiceResponse<T>> {
    let lastError: Error | null = null;

    for (let i = 0; i <= options.retryCount; i++) {
      try {
        const response = await fetch(`${endpoint}/${method}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify(params),
          timeout: options.timeout,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return this.createResponse(true, data, null, '', Date.now());
      } catch (error) {
        lastError = error as Error;
        if (i < options.retryCount) {
          await new Promise(resolve => setTimeout(resolve, options.retryDelay));
        }
      }
    }

    throw lastError;
  }

  /**
   * 生成请求ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(service: string, method: string, params: any): string {
    return `third_party:${service}:${method}:${JSON.stringify(params)}`;
  }

  /**
   * 创建响应对象
   */
  private createResponse<T>(
    success: boolean,
    data: T | null,
    error: Error | null,
    requestId: string,
    startTime: number,
  ): IServiceResponse<T> {
    return {
      success,
      data,
      error: error
        ? {
            code: 'THIRD_PARTY_ERROR',
            message: error.message,
            details: error,
          }
        : undefined,
      metadata: {
        requestId,
        timestamp: Date.now(),
        duration: Date.now() - startTime,
      },
    };
  }

  /**
   * 收集指标
   */
  private collectMetrics(
    service: string,
    method: string,
    startTime: number,
    success: boolean,
  ): void {
    const duration = Date.now() - startTime;
    this.metricsCollector.recordMetric('third_party_request', {
      service,
      method,
      duration,
      success,
    });
  }

  /**
   * 获取服务状态
   */
  public getServiceStatus(name: string): {
    enabled: boolean;
    circuitBreakerStatus?: string;
    requestCount?: number;
  } {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`服务未注册: ${name}`);
    }

    const status = {
      enabled: service.enabled,
    };

    const circuitBreaker = this.circuitBreakers.get(name);
    if (circuitBreaker) {
      status['circuitBreakerStatus'] = circuitBreaker.getStatus();
    }

    const rateLimiter = this.rateLimiters.get(name);
    if (rateLimiter) {
      status['requestCount'] = rateLimiter.requests;
    }

    return status;
  }

  /**
   * 启用服务
   */
  public enableService(name: string): void {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`服务未注册: ${name}`);
    }

    service.enabled = true;
    this.logger.info(`服务已启用: ${name}`);
  }

  /**
   * 禁用服务
   */
  public disableService(name: string): void {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`服务未注册: ${name}`);
    }

    service.enabled = false;
    this.logger.info(`服务已禁用: ${name}`);
  }

  /**
   * 重置服务状态
   */
  public resetService(name: string): void {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`服务未注册: ${name}`);
    }

    const circuitBreaker = this.circuitBreakers.get(name);
    if (circuitBreaker) {
      circuitBreaker.reset();
    }

    const rateLimiter = this.rateLimiters.get(name);
    if (rateLimiter) {
      rateLimiter.requests = 0;
      rateLimiter.lastReset = Date.now();
    }

    this.logger.info(`服务状态已重置: ${name}`);
  }
}
