import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { EventEmitter } from 'events';
import { Logger } from '../logger/Logger';
import { injectable } from 'inversify';

/**
 * 服务配置管理器接口
 */
export interface IServiceConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** name 的描述 */
    name: string;
  /** startup_priority 的描述 */
    startup_priority: number;
  /** startup_timeout 的描述 */
    startup_timeout: number;
  /** shutdown_timeout 的描述 */
    shutdown_timeout: number;
  /** dependencies 的描述 */
    dependencies: Array{
    service: string;
    required: boolean;
  }>;
  health_check?: {
    enabled: boolean;
    interval: number;
    timeout: number;
    method?: string;
    params?: any[];
  };
  [key: string]: any;
}

/**
 * 服务配置管理器类
 */
@injectable()
export class ServiceConfigManager extends EventEmitter {
  private configPath = 'config/services/integration.yaml';
  private config: any;
  private serviceConfigs: Map<string, IServiceConfig> = new Map();

  constructor(private logger: Logger) {
    super();
    this.loadConfig();
    this.watchConfig();
  }

  /**
   * 加载配置文件
   */
  private loadConfig(): void {
    try {
      const fileContents = fs.readFileSync(this.configPath, 'utf8');
      this.config = yaml.load(fileContents);
      this.parseServiceConfigs();
      this.logger.info('服务配置加载成功');
    } catch (error) {
      this.logger.error('加载服务配置失败', error);
      throw error;
    }
  }

  /**
   * 监听配置文件变化
   */
  private watchConfig(): void {
    fs.watch(this.configPath, eventType => {
      if (eventType === 'change') {
        this.logger.info('检测到配置文件变更，重新加载配置');
        this.loadConfig();
        this.emit('configChanged');
      }
    });
  }

  /**
   * 解析服务配置
   */
  private parseServiceConfigs(): void {
    this.serviceConfigs.clear();

    const serviceCategories = ['core_services', 'base_services', 'data_services', 'app_services'];

    for (const category of serviceCategories) {
      const services = this.config[category];
      if (services) {
        for (const [serviceName, serviceConfig] of Object.entries(services)) {
          this.serviceConfigs.set(serviceName, serviceConfig as IServiceConfig);
        }
      }
    }
  }

  /**
   * 获取服务配置
   */
  public getServiceConfig(serviceName: string): IServiceConfig | undefined {
    return this.serviceConfigs.get(serviceName);
  }

  /**
   * 获取所有服务配置
   */
  public getAllServiceConfigs(): Map<string, IServiceConfig> {
    return this.serviceConfigs;
  }

  /**
   * 获取服务启动顺序
   */
  public getServiceStartupOrder(): string[] {
    return Array.from(this.serviceConfigs.entries())
      .sort(([, a], [, b]) => a.startup_priority - b.startup_priority)
      .map(([serviceName]) => serviceName);
  }

  /**
   * 验证服务依赖
   */
  public validateServiceDependencies(serviceName: string): boolean {
    const serviceConfig = this.serviceConfigs.get(serviceName);
    if (!serviceConfig || !serviceConfig.dependencies) {
      return true;
    }

    for (const dependency of serviceConfig.dependencies) {
      const dependencyConfig = this.serviceConfigs.get(dependency.service);
      if (!dependencyConfig || !dependencyConfig.enabled) {
        if (dependency.required) {
          this.logger.error(`服务 ${serviceName} 的必需依赖 ${dependency.service} 未启用或不存在`);
          return false;
        }
        this.logger.warn(`服务 ${serviceName} 的可选依赖 ${dependency.service} 未启用或不存在`);
      }
    }

    return true;
  }

  /**
   * 获取监控配置
   */
  public getMonitoringConfig(): any {
    return this.config.monitoring;
  }

  /**
   * 获取性能配置
   */
  public getPerformanceConfig(): any {
    return this.config.performance;
  }

  /**
   * 获取安全配置
   */
  public getSecurityConfig(): any {
    return this.config.security;
  }

  /**
   * 获取错误处理配置
   */
  public getErrorHandlingConfig(): any {
    return this.config.error_handling;
  }

  /**
   * 检查服务是否启用
   */
  public isServiceEnabled(serviceName: string): boolean {
    const config = this.serviceConfigs.get(serviceName);
    return config ? config.enabled : false;
  }

  /**
   * 获取服务健康检查配置
   */
  public getHealthCheckConfig(serviceName: string): any {
    const config = this.serviceConfigs.get(serviceName);
    return config ? config.health_check : undefined;
  }

  /**
   * 获取服务超时配置
   */
  public getServiceTimeouts(serviceName: string): { startup: number; shutdown: number } {
    const config = this.serviceConfigs.get(serviceName);
    return {
      startup: config ? config.startup_timeout : 5000,
      shutdown: config ? config.shutdown_timeout : 5000,
    };
  }
}
