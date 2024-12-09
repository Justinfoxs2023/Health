import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ConsulService } from './consul.service';
import { ServiceDefinition, ServiceInstance } from '../../types/service';

@Injectable()
export class ServiceRegistryService {
  constructor(
    private readonly config: ConfigService,
    private readonly consul: ConsulService
  ) {}

  async register(service: ServiceDefinition): Promise<void> {
    await this.consul.register(service);
  }

  async discover(serviceName: string): Promise<ServiceInstance[]> {
    return this.consul.discover(serviceName);
  }

  async deregister(serviceId: string): Promise<void> {
    // 实现服务注销逻辑
  }

  async getServiceHealth(serviceId: string): Promise<any> {
    return this.consul.healthCheck(serviceId);
  }
} 