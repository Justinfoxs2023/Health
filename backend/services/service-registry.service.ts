import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';

interface IServiceInfo {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** version 的描述 */
  version: string;
  /** endpoint 的描述 */
  endpoint: string;
  /** status 的描述 */
  status: 'up' | 'down' | 'warning';
  /** metadata 的描述 */
  metadata: Record<string, any>;
  /** lastHeartbeat 的描述 */
  lastHeartbeat: Date;
}

interface IRegistryConfig {
  /** heartbeatInterval 的描述 */
  heartbeatInterval: number; // 心跳检测间隔(ms)
  /** timeoutThreshold 的描述 */
  timeoutThreshold: number; // 服务超时阈值(ms)
  /** cleanupInterval 的描述 */
  cleanupInterval: number; // 清理间隔(ms)
}

export class ServiceRegistry extends EventEmitter {
  private services: Map<string, IServiceInfo>;
  private config: IRegistryConfig;
  private logger: Logger;
  private heartbeatTimer: NodeJS.Timer;
  private cleanupTimer: NodeJS.Timer;

  constructor(config?: Partial<IRegistryConfig>) {
    super();
    this.services = new Map();
    this.logger = new Logger('ServiceRegistry');
    this.config = {
      heartbeatInterval: 30000,
      timeoutThreshold: 90000,
      cleanupInterval: 300000,
      ...config,
    };

    this.startHeartbeatCheck();
    this.startCleanupTask();
  }

  // 注册服务
  register(service: Omit<IServiceInfo, 'lastHeartbeat'>): void {
    const serviceInfo: IServiceInfo = {
      ...service,
      lastHeartbeat: new Date(),
    };

    this.services.set(service.id, serviceInfo);
    this.emit('service:registered', serviceInfo);
    this.logger.info(`服务注册: ${service.name} (${service.id})`);
  }

  // 注销服务
  deregister(serviceId: string): void {
    const service = this.services.get(serviceId);
    if (service) {
      this.services.delete(serviceId);
      this.emit('service:deregistered', service);
      this.logger.info(`服务注销: ${service.name} (${serviceId})`);
    }
  }

  // 更新服务心跳
  heartbeat(serviceId: string): void {
    const service = this.services.get(serviceId);
    if (service) {
      service.lastHeartbeat = new Date();
      service.status = 'up';
      this.services.set(serviceId, service);
    }
  }

  // 获取服务信息
  getService(serviceId: string): IServiceInfo | undefined {
    return this.services.get(serviceId);
  }

  // 获取所有服务
  getAllServices(): IServiceInfo[] {
    return Array.from(this.services.values());
  }

  // 根据条件查找服务
  findServices(criteria: Partial<IServiceInfo>): IServiceInfo[] {
    return Array.from(this.services.values()).filter(service => {
      return Object.entries(criteria).every(
        ([key, value]) => service[key as keyof IServiceInfo] === value,
      );
    });
  }

  // 开始心跳检测
  private startHeartbeatCheck(): void {
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      this.services.forEach((service, id) => {
        const timeSinceLastHeartbeat = now - service.lastHeartbeat.getTime();

        if (timeSinceLastHeartbeat > this.config.timeoutThreshold) {
          service.status = 'down';
          this.emit('service:down', service);
          this.logger.warn(`服务超时: ${service.name} (${id})`);
        }
      });
    }, this.config.heartbeatInterval);
  }

  // 开始清理任务
  private startCleanupTask(): void {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      this.services.forEach((service, id) => {
        const timeSinceLastHeartbeat = now - service.lastHeartbeat.getTime();
        if (timeSinceLastHeartbeat > this.config.timeoutThreshold * 3) {
          this.deregister(id);
        }
      });
    }, this.config.cleanupInterval);
  }

  // 停止服务
  stop(): void {
    clearInterval(this.heartbeatTimer);
    clearInterval(this.cleanupTimer);
  }
}
