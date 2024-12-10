import { Logger } from '@/utils/Logger';
import { ModelVersionError } from '@/utils/errors';
import { RedisService } from '../cache/RedisService';

interface ModelVersion {
  version: string;
  path: string;
  createdAt: Date;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  config: any;
}

export class ModelVersionService {
  private logger: Logger;
  private redis: RedisService;
  private readonly modelPrefix = 'ai:model:';

  constructor() {
    this.logger = new Logger('ModelVersion');
    this.redis = new RedisService();
  }

  /**
   * 注册新模型版本
   */
  async registerModel(modelName: string, version: ModelVersion): Promise<void> {
    try {
      const key = `${this.modelPrefix}${modelName}:${version.version}`;
      await this.redis.set(key, JSON.stringify(version));
      
      // 更新最新版本记录
      await this.updateLatestVersion(modelName, version.version);
      
      this.logger.info('模型版本注册成功', { modelName, version: version.version });
    } catch (error) {
      this.logger.error('模型版本注册失败', error);
      throw new ModelVersionError('MODEL_REGISTRATION_FAILED', error.message);
    }
  }

  /**
   * 获取最新模型版本
   */
  async getLatestVersion(modelName: string): Promise<ModelVersion> {
    try {
      const latestVersion = await this.redis.get(`${this.modelPrefix}${modelName}:latest`);
      if (!latestVersion) {
        throw new ModelVersionError('NO_MODEL_VERSION', '未找到模型版本');
      }
      
      const key = `${this.modelPrefix}${modelName}:${latestVersion}`;
      const modelData = await this.redis.get(key);
      
      return JSON.parse(modelData);
    } catch (error) {
      this.logger.error('获取最新模型版本失败', error);
      throw error;
    }
  }

  /**
   * 获取指定版本模型
   */
  async getModelVersion(modelName: string, version: string): Promise<ModelVersion> {
    try {
      const key = `${this.modelPrefix}${modelName}:${version}`;
      const modelData = await this.redis.get(key);
      
      if (!modelData) {
        throw new ModelVersionError('MODEL_VERSION_NOT_FOUND', '未找到指定版本模型');
      }
      
      return JSON.parse(modelData);
    } catch (error) {
      this.logger.error('获取模型版本失败', error);
      throw error;
    }
  }

  /**
   * 比较模型版本
   */
  async compareVersions(
    modelName: string, 
    version1: string, 
    version2: string
  ): Promise<{
    comparison: 'better' | 'worse' | 'equal';
    metrics: any;
  }> {
    const model1 = await this.getModelVersion(modelName, version1);
    const model2 = await this.getModelVersion(modelName, version2);
    
    return this.evaluatePerformance(model1.metrics, model2.metrics);
  }

  private async updateLatestVersion(modelName: string, version: string): Promise<void> {
    await this.redis.set(`${this.modelPrefix}${modelName}:latest`, version);
  }

  private evaluatePerformance(metrics1: any, metrics2: any): any {
    // 实现性能评估逻辑
    const score1 = this.calculateScore(metrics1);
    const score2 = this.calculateScore(metrics2);
    
    return {
      comparison: score1 > score2 ? 'better' : score1 < score2 ? 'worse' : 'equal',
      metrics: {
        difference: {
          accuracy: metrics1.accuracy - metrics2.accuracy,
          precision: metrics1.precision - metrics2.precision,
          recall: metrics1.recall - metrics2.recall,
          f1Score: metrics1.f1Score - metrics2.f1Score
        }
      }
    };
  }

  private calculateScore(metrics: any): number {
    return (
      metrics.accuracy * 0.3 +
      metrics.precision * 0.2 +
      metrics.recall * 0.2 +
      metrics.f1Score * 0.3
    );
  }
} 