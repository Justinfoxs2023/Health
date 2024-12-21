import {
  IGatewayRequest,
  IGatewayResponse,
  IRouteConfig,
  IGatewayMetrics,
  IRouteStatus,
  IGatewayConfig,
} from './interfaces';
import { CacheManager } from '../cache/cache-manager.service';
import { CircuitBreaker } from '../reliability/circuit-breaker.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { LoadBalancer } from '../loadbalancer/load-balancer.service';
import { Logger } from '../logger/logger.service';
import { MetricsCollector } from '../monitoring/metrics-collector.service';
import { SecurityAuditor } from '../security/security-auditor.service';
import { ServiceDiscovery } from '../discovery/service-discovery.service';

@Inject
able()
export class GatewayService implements OnModuleInit {
  private routes: Map<string, IRouteConfig> = new Map();
  private rateLimit: Map<string, number> = new Map();
  private blacklist: Set<string> = new Set();
  private config: IGatewayConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly metrics: MetricsCollector,
    private readonly circuitBreaker: CircuitBreaker,
    private readonly cache: CacheManager,
    private readonly security: SecurityAuditor,
    private readonly loadBalancer: LoadBalancer,
    private readonly serviceDiscovery: ServiceDiscovery,
  ) {}

  async onModuleInit() {
    await this.loadConfiguration();
    this.startMetricsCollection();
    await this.initializeServices();
  }

  private async loadConfiguration() {
    this.config = this.configService.get<IGatewayConfig>('gateway');
    this.setupRoutes();
    this.setupRateLimits();
    this.setupBlacklist();
  }

  private setupRoutes() {
    this.config.routes.forEach(route => {
      this.routes.set(route.path, route);
    });
  }

  private setupRateLimits() {
    this.config.rateLimits.forEach(limit => {
      this.rateLimit.set(limit.path, limit.requestsPerMinute);
    });
  }

  private setupBlacklist() {
    this.config.blacklist.forEach(ip => {
      this.blacklist.add(ip);
    });
  }

  private async initializeServices() {
    await this.serviceDiscovery.initialize(this.config.serviceDiscovery);
    await this.loadBalancer.initialize(this.config.loadBalancer);
    await this.cache.initialize(this.config.cache);
    await this.circuitBreaker.initialize(this.config.circuitBreaker);
  }

  private startMetricsCollection() {
    setInterval(() => {
      const metrics = this.collectMetrics();
      this.metrics.record(metrics);
    }, this.config.monitoring.metrics.interval);
  }

  private collectMetrics(): IGatewayMetrics {
    return {
      routes: this.routes.size,
      blacklistedIPs: this.blacklist.size,
      rateLimit: this.rateLimit.size,
      cacheHitRate: this.cache.getHitRate(),
      errorRate: this.circuitBreaker.getErrorRate(),
    };
  }

  async handleRequest(req: IGatewayRequest): Promise<IGatewayResponse> {
    const startTime = Date.now();

    try {
      // 1. 基础检查
      await this.validateRequest(req);

      // 2. 路由匹配
      const route = await this.matchRoute(req);

      // 3. 缓存检查
      const cachedResponse = await this.checkCache(req);
      if (cachedResponse) {
        return this.enhanceResponse(cachedResponse, startTime);
      }

      // 4. 服务发现
      const target = await this.serviceDiscovery.resolveService(route.target);

      // 5. 负载均衡
      const instance = await this.loadBalancer.chooseInstance(target);

      // 6. 请求转发
      const response = await this.forwardRequest(req, instance);

      // 7. 缓存响应
      await this.cacheResponse(req, response);

      // 8. 记录指标
      this.recordMetrics(req, response, startTime);

      return this.enhanceResponse(response, startTime);
    } catch (error) {
      this.handleError(error, req);
      throw error;
    }
  }

  private async validateRequest(req: IGatewayRequest) {
    // 检查黑名单
    if (this.blacklist.has(req.ip)) {
      throw new Error('IP已被封禁');
    }

    // 检查速率限制
    if (!this.checkRateLimit(req)) {
      throw new Error('请求频率超限');
    }

    // 验证认证信息
    await this.security.validateRequest(req);
  }

  private async matchRoute(req: IGatewayRequest): Promise<IRouteConfig> {
    const route = this.routes.get(req.path);
    if (!route) {
      throw new Error('路由未找到');
    }

    if (!route.methods.includes(req.method)) {
      throw new Error('不支持的请求方法');
    }

    return route;
  }

  private checkRateLimit(req: IGatewayRequest): boolean {
    const limit = this.rateLimit.get(req.path);
    if (!limit) return true;

    const key = `ratelimit:${req.path}:${req.ip}`;
    const current = this.cache.increment(key);

    return current <= limit;
  }

  private async checkCache(req: IGatewayRequest): Promise<IGatewayResponse | null> {
    if (!this.config.cache.enabled) return null;

    const key = this.getCacheKey(req);
    return await this.cache.get(key);
  }

  private async forwardRequest(req: IGatewayRequest, target: string): Promise<IGatewayResponse> {
    if (!this.circuitBreaker.canRequest(target)) {
      throw new Error('服务暂时不可用');
    }

    try {
      const response = await fetch(target + req.path, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });

      const body = await response.json();
      return {
        status: response.status,
        headers: Object.fromEntries(response.headers),
        body,
      };
    } catch (error) {
      this.circuitBreaker.recordError(target);
      throw error;
    }
  }

  private async cacheResponse(req: IGatewayRequest, response: IGatewayResponse) {
    if (!this.config.cache.enabled) return;

    const key = this.getCacheKey(req);
    await this.cache.set(key, response, this.config.cache.ttl);
  }

  private getCacheKey(req: IGatewayRequest): string {
    return `cache:${req.method}:${req.path}:${JSON.stringify(req.query)}`;
  }

  private recordMetrics(req: IGatewayRequest, response: IGatewayResponse, startTime: number) {
    const duration = Date.now() - startTime;
    this.metrics.recordRequest({
      path: req.path,
      method: req.method,
      status: response.status,
      duration,
    });
  }

  private enhanceResponse(response: IGatewayResponse, startTime: number): IGatewayResponse {
    const duration = Date.now() - startTime;
    return {
      ...response,
      headers: {
        ...response.headers,
        'X-Response-Time': `${duration}ms`,
        'X-Gateway-Version': this.config.transformation.request.headers['X-Gateway-Version'],
      },
    };
  }

  private handleError(error: Error, req: IGatewayRequest) {
    this.logger.error('网关请求处理错误', {
      error: error.message,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  }

  // 路由管理
  async addRoute(path: string, config: IRouteConfig) {
    this.routes.set(path, config);
    await this.saveConfiguration();
  }

  async removeRoute(path: string) {
    this.routes.delete(path);
    await this.saveConfiguration();
  }

  async updateRateLimit(path: string, limit: number) {
    this.rateLimit.set(path, limit);
    await this.saveConfiguration();
  }

  async addToBlacklist(ip: string) {
    this.blacklist.add(ip);
    await this.saveConfiguration();
  }

  async removeFromBlacklist(ip: string) {
    this.blacklist.delete(ip);
    await this.saveConfiguration();
  }

  private async saveConfiguration() {
    const config = {
      ...this.config,
      routes: Array.from(this.routes.values()),
      rateLimits: Array.from(this.rateLimit.entries()).map(([path, limit]) => ({
        path,
        requestsPerMinute: limit,
      })),
      blacklist: Array.from(this.blacklist),
    };

    await this.configService.set('gateway', config);
  }

  // 监控和统计
  getMetrics(): IGatewayMetrics {
    return this.collectMetrics();
  }

  getRouteStatus(path: string): IRouteStatus {
    const route = this.routes.get(path);
    if (!route) {
      throw new Error('路由不存在');
    }

    return {
      config: route,
      metrics: this.metrics.getRouteMetrics(path),
      circuitBreaker: this.circuitBreaker.getStatus(path),
    };
  }

  // 配置管理
  async getConfig(): Promise<IGatewayConfig> {
    return this.config;
  }

  async updateConfig(config: Partial<IGatewayConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };
    await this.saveConfiguration();
    await this.initializeServices();
  }

  // 缓存管理
  async clearCache() {
    await this.cache.clear();
  }

  // 服务发现
  async getServices() {
    return await this.serviceDiscovery.getServices();
  }

  // 负载均衡
  async getLoadBalancerStatus() {
    return await this.loadBalancer.getStatus();
  }

  // 断路器
  async getCircuitBreakerStatus() {
    return await this.circuitBreaker.getStatus();
  }

  // API文档
  async getApiDocs() {
    return Array.from(this.routes.values()).map(route => ({
      path: route.path,
      methods: route.methods,
      auth: route.auth,
      description: route.description,
    }));
  }
}
