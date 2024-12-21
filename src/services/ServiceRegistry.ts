import { EventEmitter } from 'events';
import { Logger } from './logger/Logger';
import { ServiceConfigManager, IServiceConfig } from './config/ServiceConfigManager';
import { injectable, inject } from 'inversify';

/**
 * 服务状态枚举
 */
export enum ServiceStatus {
  STOPPED = 'STOPPED',
  STARTING = 'STARTING',
  RUNNING = 'RUNNING',
  STOPPING = 'STOPPING',
  ERROR = 'ERROR',
}

/**
 * 服务实例接口
 */
export interface IService {
  /** start 的描述 */
  start: Promisevoid;
  /** stop 的描述 */
  stop: Promisevoid;
  /** getStatus 的描述 */
  getStatus: import("D:/Health/src/services/ServiceRegistry").ServiceStatus.STOPPED | import("D:/Health/src/services/ServiceRegistry").ServiceStatus.STARTING | import("D:/Health/src/services/ServiceRegistry").ServiceStatus.RUNNING | import("D:/Health/src/services/ServiceRegistry").ServiceStatus.STOPPING | import("D:/Health/src/services/ServiceRegistry").ServiceStatus.ERROR;
  /** getName 的描述 */
  getName: string;
}

/**
 * 服务注册表类
 */
@injectable()
export class ServiceRegistry extends EventEmitter {
  private services: Map<string, IService> = new Map();
  private serviceStatus: Map<string, ServiceStatus> = new Map();
  private startupPromises: Map<string, Promise<void>> = new Map();

  constructor(
    @inject() private logger: Logger,
    @inject() private configManager: ServiceConfigManager,
  ) {
    super();
    this.setupConfigChangeListener();
  }

  /**
   * 设置配置变更监听器
   */
  private setupConfigChangeListener(): void {
    this.configManager.on('configChanged', async () => {
      this.logger.info('检测到服务配置变更，重新启动受影响的服务');
      await this.handleConfigChange();
    });
  }

  /**
   * 处理配置变更
   */
  private async handleConfigChange(): Promise<void> {
    const runningServices = Array.from(this.services.entries())
      .filter(([, service]) => service.getStatus() === ServiceStatus.RUNNING)
      .map(([name]) => name);

    // 停止不再启用的服务
    for (const serviceName of runningServices) {
      if (!this.configManager.isServiceEnabled(serviceName)) {
        await this.stopService(serviceName);
      }
    }

    // 启动新启用的服务
    const startupOrder = this.configManager.getServiceStartupOrder();
    for (const serviceName of startupOrder) {
      if (
        this.configManager.isServiceEnabled(serviceName) &&
        !runningServices.includes(serviceName)
      ) {
        await this.startService(serviceName);
      }
    }
  }

  /**
   * 注册服务
   */
  public registerService(name: string, service: IService): void {
    if (this.services.has(name)) {
      throw new Error(`服务 ${name} 已经注册`);
    }

    this.services.set(name, service);
    this.serviceStatus.set(name, ServiceStatus.STOPPED);
    this.logger.info(`服务 ${name} 注册成功`);
  }

  /**
   * 启动服务
   */
  public async startService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`服务 ${name} 未注册`);
    }

    if (this.serviceStatus.get(name) === ServiceStatus.RUNNING) {
      return;
    }

    if (!this.configManager.isServiceEnabled(name)) {
      this.logger.warn(`服务 ${name} 已禁用，跳过启动`);
      return;
    }

    if (!this.configManager.validateServiceDependencies(name)) {
      throw new Error(`服务 ${name} 的依赖验证失败`);
    }

    const { startup: startupTimeout } = this.configManager.getServiceTimeouts(name);
    this.serviceStatus.set(name, ServiceStatus.STARTING);

    try {
      const startPromise = service.start();
      this.startupPromises.set(name, startPromise);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`服务 ${name} 启动超时`)), startupTimeout);
      });

      await Promise.race([startPromise, timeoutPromise]);
      this.serviceStatus.set(name, ServiceStatus.RUNNING);
      this.emit('serviceStarted', name);
      this.logger.info(`服务 ${name} 启动成功`);
    } catch (error) {
      this.serviceStatus.set(name, ServiceStatus.ERROR);
      this.emit('serviceError', name, error);
      this.logger.error(`服务 ${name} 启动失败`, error);
      throw error;
    } finally {
      this.startupPromises.delete(name);
    }
  }

  /**
   * 停止服务
   */
  public async stopService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`服务 ${name} 未注册`);
    }

    if (this.serviceStatus.get(name) === ServiceStatus.STOPPED) {
      return;
    }

    const { shutdown: shutdownTimeout } = this.configManager.getServiceTimeouts(name);
    this.serviceStatus.set(name, ServiceStatus.STOPPING);

    try {
      const stopPromise = service.stop();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`服务 ${name} 停止超时`)), shutdownTimeout);
      });

      await Promise.race([stopPromise, timeoutPromise]);
      this.serviceStatus.set(name, ServiceStatus.STOPPED);
      this.emit('serviceStopped', name);
      this.logger.info(`服务 ${name} 停止成功`);
    } catch (error) {
      this.serviceStatus.set(name, ServiceStatus.ERROR);
      this.emit('serviceError', name, error);
      this.logger.error(`服务 ${name} 停止失败`, error);
      throw error;
    }
  }

  /**
   * 获取服务状态
   */
  public getServiceStatus(name: string): ServiceStatus {
    const status = this.serviceStatus.get(name);
    if (!status) {
      throw new Error(`服务 ${name} 未注册`);
    }
    return status;
  }

  /**
   * 获取所有服务状态
   */
  public getAllServiceStatuses(): Map<string, ServiceStatus> {
    return new Map(this.serviceStatus);
  }

  /**
   * 获取服务实例
   */
  public getService(name: string): IService | undefined {
    return this.services.get(name);
  }

  /**
   * 启动所有服务
   */
  public async startAllServices(): Promise<void> {
    const startupOrder = this.configManager.getServiceStartupOrder();

    for (const serviceName of startupOrder) {
      if (this.configManager.isServiceEnabled(serviceName)) {
        await this.startService(serviceName);
      }
    }
  }

  /**
   * 停止所有服务
   */
  public async stopAllServices(): Promise<void> {
    const reverseStartupOrder = this.configManager.getServiceStartupOrder().reverse();

    for (const serviceName of reverseStartupOrder) {
      if (this.serviceStatus.get(serviceName) === ServiceStatus.RUNNING) {
        await this.stopService(serviceName);
      }
    }
  }

  /**
   * 重启服务
   */
  public async restartService(name: string): Promise<void> {
    await this.stopService(name);
    await this.startService(name);
  }

  /**
   * 获取服务健康状态
   */
  public async getServiceHealth(): Promise<Map<string, boolean>> {
    const health = new Map<string, boolean>();

    for (const [name, service] of this.services) {
      const status = this.getServiceStatus(name);
      const isHealthy = status === ServiceStatus.RUNNING;
      health.set(name, isHealthy);
    }

    return health;
  }
}
