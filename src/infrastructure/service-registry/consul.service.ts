import * as Consul from 'consul';
import { ConfigService } from '../config/config.service';
import { IServiceDefinition, IServiceInstance, IHealthStatus } from '../../types/service';
import { Injectable } from '@nestjs/common';
import { MetricsService } from '../monitoring';

@Injectable()
export class ConsulService {
  private readonly consul: Consul.Consul;

  constructor(private readonly config: ConfigService, private readonly metrics: MetricsService) {
    const consulConfig = {
      host: config.get('CONSUL_HOST'),
      port: parseInt(config.get('CONSUL_PORT')),
    };
    this.consul = new (Consul as any)(consulConfig);
  }

  // 注册服务
  async register(service: IServiceDefinition): Promise<void> {
    await this.consul.agent.service.register({
      name: service.name,
      id: `${service.name}-${service.version}`,
      tags: [`version-${service.version}`],
      address: service.endpoints[0].host,
      port: service.endpoints[0].port,
      check: {
        http: `http://${service.endpoints[0].host}:${service.endpoints[0].port}/health`,
        interval: '10s',
        timeout: '5s',
      },
    });
  }

  // 发现服务
  async discover(serviceName: string): Promise<IServiceInstance[]> {
    const result = await this.consul.catalog.service.nodes(serviceName);
    return result.map((node: any) => ({
      id: node.ServiceID,
      name: node.ServiceName,
      address: node.ServiceAddress,
      port: node.ServicePort,
      tags: node.ServiceTags,
    }));
  }

  // 健康检查
  async healthCheck(serviceId: string): Promise<IHealthStatus> {
    const checks = await this.consul.agent.check.list();
    const serviceCheck = checks[`service:${serviceId}`];
    return {
      status: serviceCheck.Status,
      output: serviceCheck.Output,
      timestamp: new Date(serviceCheck.LastUpdate),
    };
  }
}
