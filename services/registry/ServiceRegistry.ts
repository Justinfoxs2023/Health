/**
 * @fileoverview TS 文件 ServiceRegistry.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

@Injectable()
export class EnhancedServiceRegistry extends ServiceRegistry {
  constructor(
    private readonly config: RegistryConfig,
    private readonly healthCheck: HealthCheckService,
    private readonly loadBalancer: LoadBalancerService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {
    super(config, healthCheck);
  }

  async registerWithLoadBalancing(service: ServiceInfo): Promise<void> {
    await super.register(service);

    // 配置负载均衡
    await this.loadBalancer.addService(service);

    // 配置断路器
    await this.circuitBreaker.configureService(service);

    // 启动高级健康检查
    await this.startEnhancedHealthCheck(service);
  }

  async discoverWithFailover(serviceType: string): Promise<ServiceInfo[]> {
    const services = await super.discover(serviceType);

    // 应用负载均衡策略
    const balancedServices = await this.loadBalancer.balance(services);

    // 检查断路器状态
    return this.filterHealthyServices(balancedServices);
  }

  private async filterHealthyServices(services: ServiceInfo[]): Promise<ServiceInfo[]> {
    return services.filter(service => this.circuitBreaker.isHealthy(service.id));
  }
}
