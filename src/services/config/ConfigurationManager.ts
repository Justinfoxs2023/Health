import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { ConfigService } from '@nestjs/config';
import { EventEmitter } from '../events/event-emitter.service';
import { Injectable } from '@nestjs/common';
import { IsString, IsDate, IsBoolean, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { Logger } from '../logger/logger.service';
import { MetricsService } from '../monitoring/metrics.service';
import { Type } from 'class-transformer';
import { validate } from 'class-validator';

class SecurityConfig {
  @IsString()
  algorithm: string;

  @IsNumber()
  keySize: number;
}

class AuditConfig {
  @IsBoolean()
  enabled: boolean;

  @IsNumber()
  retention: number;
}

class MetricsConfig {
  @IsBoolean()
  enabled: boolean;

  @IsNumber()
  interval: number;
}

class AlertsConfig {
  @IsBoolean()
  enabled: boolean;

  @ValidateNested()
  @Type() => Object)
  thresholds: Record<string, number>;
}

class CacheConfig {
  @IsBoolean()
  enabled: boolean;

  @IsNumber()
  ttl: number;
}

class BatchConfig {
  @IsNumber()
  size: number;

  @IsNumber()
  timeout: number;
}

class ServiceConfig {
  @IsBoolean()
  enabled: boolean;

  @ValidateNested()
  @Type() => Object)
  settings: Record<string, any>;

  @IsOptional()
  @IsString()
  dependencies?: string[];
}

class ConfigSchema {
  @IsString()
  version: string;

  @IsDate()
  @Type() => Date)
  lastModified: Date;

  @IsString()
  environment: string;

  @ValidateNested()
  @Type() => ServiceConfig)
  services: Record<string, ServiceConfig>;

  @ValidateNested()
  security: {
    @ValidateNested()
    @Type() => SecurityConfig)
    encryption: SecurityConfig;

    @ValidateNested()
    @Type() => AuditConfig)
    audit: AuditConfig;
  };

  @ValidateNested()
  monitoring: {
    @ValidateNested()
    @Type() => MetricsConfig)
    metrics: MetricsConfig;

    @ValidateNested()
    @Type() => AlertsConfig)
    alerts: AlertsConfig;
  };

  @ValidateNested()
  performance: {
    @ValidateNested()
    @Type() => CacheConfig)
    cache: CacheConfig;

    @ValidateNested()
    @Type() => BatchConfig)
    batch: BatchConfig;
  };
}

@Injectable()
export class ConfigurationManager {
  services: {
    [key: string]: {
      enabled: boolean;
      settings: any;
      dependencies?: string[];
    };
  };
  security: {
    encryption: {
      algorithm: string;
      keySize: number;
    };
    audit: {
      enabled: boolean;
      retention: number;
    };
  };
  monitoring: {
    metrics: {
      enabled: boolean;
      interval: number;
    };
    alerts: {
      enabled: boolean;
      thresholds: any;
    };
  };
  performance: {
    cache: {
      enabled: boolean;
      ttl: number;
    };
    batch: {
      size: number;
      timeout: number;
    };
  };
}

@Injectable()
export class ConfigurationManager {
  private configs = new Map<string, any>();
  private schemas = new Map<string, any>();
  private watchers = new Map<string, fs.FSWatcher>();
  private readonly configPath: string;

  constructor(
    private readonly config: ConfigService,
    private readonly metrics: MetricsService,
    private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter
  ) {
    this.configPath = this.config.get('CONFIG_PATH') || 'config';
    this.initialize();
  }

  private async initialize() {
    try {
      await this.loadSchemas();
      await this.loadConfigurations();
      await this.setupConfigWatchers();
      this.logger.info('配置管理服务初始化完成');
    } catch (error) {
      this.logger.error('配置管理服务初始化失败', error);
      throw error;
    }
  }

  // 加载配置模式
  private async loadSchemas(): Promise<void> {
    const timer = this.metrics.startTimer('load_schemas');
    try {
      const schemaPath = path.join(this.configPath, 'schemas');
      const files = await fs.promises.readdir(schemaPath);

      for (const file of files) {
        if (file.endsWith('.schema.yaml')) {
          const schema = yaml.load(
            await fs.promises.readFile(
              path.join(schemaPath, file),
              'utf8'
            )
          );
          const name = path.basename(file, '.schema.yaml');
          this.schemas.set(name, schema);
        }
      }

      this.metrics.increment('schemas_loaded');
      timer.end();
    } catch (error) {
      this.metrics.increment('load_schemas_error');
      timer.end();
      throw error;
    }
  }

  // 加载配置文件
  private async loadConfigurations(): Promise<void> {
    const timer = this.metrics.startTimer('load_configurations');
    try {
      const files = await fs.promises.readdir(this.configPath);

      for (const file of files) {
        if (file.endsWith('.yaml') && !file.endsWith('.schema.yaml')) {
          await this.loadConfigFile(file);
        }
      }

      this.metrics.increment('configurations_loaded');
      timer.end();
    } catch (error) {
      this.metrics.increment('load_configurations_error');
      timer.end();
      throw error;
    }
  }

  // 加载单个配置文件
  private async loadConfigFile(filename: string): Promise<void> {
    const timer = this.metrics.startTimer('load_config_file');
    try {
      const filePath = path.join(this.configPath, filename);
      const content = await fs.promises.readFile(filePath, 'utf8');
      const config = yaml.load(content);
      const name = path.basename(filename, '.yaml');

      // 验证配置
      await this.validateConfig(name, config);

      // 保存配置
      this.configs.set(name, config);

      // 发送事件
      this.eventEmitter.emit('config:loaded', {
        name,
        timestamp: new Date()
      });

      this.metrics.increment('config_file_loaded');
      timer.end();
    } catch (error) {
      this.metrics.increment('load_config_file_error');
      timer.end();
      throw error;
    }
  }

  // 验证配置
  private async validateConfig(name: string, config: any): Promise<void> {
    const timer = this.metrics.startTimer('validate_config');
    try {
      const schema = this.schemas.get(name);
      if (!schema) {
        throw new Error(`未找到配置模式: ${name}`);
      }

      const errors = await validate(config, schema);
      if (errors.length > 0) {
        throw new Error(`配置验证失败: ${JSON.stringify(errors)}`);
      }

      this.metrics.increment('config_validated');
      timer.end();
    } catch (error) {
      this.metrics.increment('validate_config_error');
      timer.end();
      throw error;
    }
  }

  // 设置配置文件监视器
  private async setupConfigWatchers(): Promise<void> {
    const timer = this.metrics.startTimer('setup_config_watchers');
    try {
      const files = await fs.promises.readdir(this.configPath);

      for (const file of files) {
        if (file.endsWith('.yaml') && !file.endsWith('.schema.yaml')) {
          const filePath = path.join(this.configPath, file);
          const watcher = fs.watch(filePath, async (eventType) => {
            if (eventType === 'change') {
              await this.loadConfigFile(file);
            }
          });
          this.watchers.set(file, watcher);
        }
      }

      this.metrics.increment('config_watchers_setup');
      timer.end();
    } catch (error) {
      this.metrics.increment('setup_config_watchers_error');
      timer.end();
      throw error;
    }
  }

  // 获取配置
  async getConfig<T>(name: string): Promise<T> {
    const timer = this.metrics.startTimer('get_config');
    try {
      const config = this.configs.get(name);
      if (!config) {
        throw new Error(`未找到配置: ${name}`);
      }

      this.metrics.increment('config_retrieved');
      timer.end();
      return config as T;
    } catch (error) {
      this.metrics.increment('get_config_error');
      timer.end();
      throw error;
    }
  }

  // 更新配置
  async updateConfig(name: string, config: any): Promise<void> {
    const timer = this.metrics.startTimer('update_config');
    try {
      // 验证配置
      await this.validateConfig(name, config);

      // 保存配置
      const filePath = path.join(this.configPath, `${name}.yaml`);
      await fs.promises.writeFile(
        filePath,
        yaml.dump(config),
        'utf8'
      );

      // 更新内存中的配置
      this.configs.set(name, config);

      // 发送事件
      this.eventEmitter.emit('config:updated', {
        name,
        timestamp: new Date()
      });

      this.metrics.increment('config_updated');
      timer.end();
    } catch (error) {
      this.metrics.increment('update_config_error');
      timer.end();
      throw error;
    }
  }

  // 删除配置
  async deleteConfig(name: string): Promise<void> {
    const timer = this.metrics.startTimer('delete_config');
    try {
      const filePath = path.join(this.configPath, `${name}.yaml`);

      // 停止文件监视
      const watcher = this.watchers.get(`${name}.yaml`);
      if (watcher) {
        watcher.close();
        this.watchers.delete(`${name}.yaml`);
      }

      // 删除文件
      await fs.promises.unlink(filePath);

      // 从内存中删除
      this.configs.delete(name);

      // 发送事件
      this.eventEmitter.emit('config:deleted', {
        name,
        timestamp: new Date()
      });

      this.metrics.increment('config_deleted');
      timer.end();
    } catch (error) {
      this.metrics.increment('delete_config_error');
      timer.end();
      throw error;
    }
  }

  // 获取配置列表
  async listConfigs(): Promise<string[]> {
    const timer = this.metrics.startTimer('list_configs');
    try {
      const configs = Array.from(this.configs.keys());

      this.metrics.increment('configs_listed');
      timer.end();
      return configs;
    } catch (error) {
      this.metrics.increment('list_configs_error');
      timer.end();
      throw error;
    }
  }

  // 验证配置依赖
  async validateDependencies(): Promise<void> {
    const timer = this.metrics.startTimer('validate_dependencies');
    try {
      for (const [name, config] of this.configs.entries()) {
        if (config.services) {
          for (const service of Object.values(config.services)) {
            if (service.dependencies) {
              for (const dep of service.dependencies) {
                if (!this.configs.has(dep)) {
                  throw new Error(
                    `配置 ${name} 依赖的配置 ${dep} 不存在`
                  );
                }
              }
            }
          }
        }
      }

      this.metrics.increment('dependencies_validated');
      timer.end();
    } catch (error) {
      this.metrics.increment('validate_dependencies_error');
      timer.end();
      throw error;
    }
  }

  // 导出配置
  async exportConfigs(targetPath: string): Promise<void> {
    const timer = this.metrics.startTimer('export_configs');
    try {
      // 创建目标目录
      await fs.promises.mkdir(targetPath, { recursive: true });

      // 导出所有配置
      for (const [name, config] of this.configs.entries()) {
        const filePath = path.join(targetPath, `${name}.yaml`);
        await fs.promises.writeFile(
          filePath,
          yaml.dump(config),
          'utf8'
        );
      }

      this.metrics.increment('configs_exported');
      timer.end();
    } catch (error) {
      this.metrics.increment('export_configs_error');
      timer.end();
      throw error;
    }
  }

  // 导入配置
  async importConfigs(sourcePath: string): Promise<void> {
    const timer = this.metrics.startTimer('import_configs');
    try {
      const files = await fs.promises.readdir(sourcePath);

      for (const file of files) {
        if (file.endsWith('.yaml')) {
          const filePath = path.join(sourcePath, file);
          const content = await fs.promises.readFile(filePath, 'utf8');
          const config = yaml.load(content);
          const name = path.basename(file, '.yaml');

          // 验证配置
          await this.validateConfig(name, config);

          // 保存配置
          await this.updateConfig(name, config);
        }
      }

      this.metrics.increment('configs_imported');
      timer.end();
    } catch (error) {
      this.metrics.increment('import_configs_error');
      timer.end();
      throw error;
    }
  }
}
