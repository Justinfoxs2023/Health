import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { Subject } from 'rxjs';

export interface IAIModelConfig {
   
  /** modelType 的描述 */
    modelType: basic  advanced  expert;
  version: string;
  language: string;

   
  performance: {
    maxBatchSize: number;
    timeout: number;
    cacheEnabled: boolean;
    cacheSize: number;
  };

  // 训练配置
  training: {
    enabled: boolean;
    schedule: 'daily' | 'weekly' | 'monthly';
    dataRetentionDays: number;
    minSampleSize: number;
  };

  // 推理配置
  inference: {
    confidenceThreshold: number;
    maxConcurrentRequests: number;
    timeout: number;
  };

  // 资源限制
  resources: {
    maxMemory: number;
    maxCPU: number;
    gpuEnabled: boolean;
  };
}

@Injectable()
export class AIConfigService {
  private readonly configKey = 'ai_config';
  private readonly config$ = new Subject<IAIModelConfig>();

  constructor(private storage: StorageService) {
    this.initialize();
  }

  // 获取配置
  getConfig(): Subject<IAIModelConfig> {
    return this.config$;
  }

  // 更新配置
  async updateConfig(updates: Partial<IAIModelConfig>): Promise<void> {
    const currentConfig = this.config$.value;
    const newConfig = {
      ...currentConfig,
      ...updates,
    };

    await this.validateConfig(newConfig);
    await this.saveConfig(newConfig);
    this.config$.next(newConfig);
  }

  // 重置配置
  async resetConfig(): Promise<void> {
    const defaultConfig = this.getDefaultConfig();
    await this.saveConfig(defaultConfig);
    this.config$.next(defaultConfig);
  }

  // 私有方法
  private async initialize(): Promise<void> {
    const savedConfig = await this.storage.get<IAIModelConfig>(this.configKey);
    if (savedConfig) {
      this.config$.next(savedConfig);
    }
  }

  private getDefaultConfig(): IAIModelConfig {
    return {
      modelType: 'basic',
      version: '1.0.0',
      language: ['zh-CN'],

      performance: {
        maxBatchSize: 32,
        timeout: 5000,
        cacheEnabled: true,
        cacheSize: 1000,
      },

      training: {
        enabled: true,
        schedule: 'weekly',
        dataRetentionDays: 90,
        minSampleSize: 1000,
      },

      inference: {
        confidenceThreshold: 0.8,
        maxConcurrentRequests: 10,
        timeout: 3000,
      },

      resources: {
        maxMemory: 4096,
        maxCPU: 4,
        gpuEnabled: false,
      },
    };
  }

  private async validateConfig(config: IAIModelConfig): Promise<void> {
    // 实现配置验证逻辑
    const validations = [
      this.validatePerformance(config.performance),
      this.validateTraining(config.training),
      this.validateInference(config.inference),
      this.validateResources(config.resources),
    ];

    await Promise.all(validations);
  }

  private async validatePerformance(config: IAIModelConfig['performance']): Promise<void> {
    if (config.maxBatchSize < 1 || config.maxBatchSize > 128) {
      throw new Error('Invalid batch size');
    }
    if (config.timeout < 1000 || config.timeout > 30000) {
      throw new Error('Invalid timeout');
    }
    if (config.cacheEnabled && (config.cacheSize < 100 || config.cacheSize > 10000)) {
      throw new Error('Invalid cache size');
    }
  }

  private async validateTraining(config: IAIModelConfig['training']): Promise<void> {
    if (config.enabled) {
      if (config.dataRetentionDays < 1 || config.dataRetentionDays > 365) {
        throw new Error('Invalid data retention period');
      }
      if (config.minSampleSize < 100 || config.minSampleSize > 1000000) {
        throw new Error('Invalid minimum sample size');
      }
    }
  }

  private async validateInference(config: IAIModelConfig['inference']): Promise<void> {
    if (config.confidenceThreshold < 0.5 || config.confidenceThreshold > 1) {
      throw new Error('Invalid confidence threshold');
    }
    if (config.maxConcurrentRequests < 1 || config.maxConcurrentRequests > 100) {
      throw new Error('Invalid max concurrent requests');
    }
    if (config.timeout < 1000 || config.timeout > 30000) {
      throw new Error('Invalid inference timeout');
    }
  }

  private async validateResources(config: IAIModelConfig['resources']): Promise<void> {
    if (config.maxMemory < 1024 || config.maxMemory > 16384) {
      throw new Error('Invalid memory limit');
    }
    if (config.maxCPU < 1 || config.maxCPU > 16) {
      throw new Error('Invalid CPU limit');
    }
  }

  private async saveConfig(config: IAIModelConfig): Promise<void> {
    await this.storage.set(this.configKey, config);
  }
}
