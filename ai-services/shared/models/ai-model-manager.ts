import { Injectable } from '@nestjs/common';
import { Logger } from '@utils/logger';
import { CacheManager } from '@utils/cache-manager';
import * as tf from '@tensorflow/tfjs-node';
import axios from 'axios';

@Injectable()
export class AIModelManager {
  private readonly logger = new Logger(AIModelManager.name);
  private readonly models = new Map<string, tf.LayersModel>();
  private readonly modelConfigs: {[key: string]: IModelConfig} = {
    'vital-signs': {
      path: process.env.VITAL_SIGNS_MODEL_PATH || './models/vital-signs',
      type: 'tensorflow',
      version: '1.0.0',
      inputShape: [5], // 心率、收缩压、舒张压、体温、呼吸率、血氧
      outputShape: [3], // 评分、风险等级、建议类型
    },
    'lifestyle': {
      path: process.env.LIFESTYLE_MODEL_PATH || './models/lifestyle',
      type: 'tensorflow',
      version: '1.0.0',
      inputShape: [20], // 运动、饮食、睡眠、压力等特征
      outputShape: [5], // 评分、模式类型、风险等级、建议优先级、建议类型
    },
    'lifestyle-pattern': {
      path: process.env.LIFESTYLE_PATTERN_MODEL_PATH || './models/lifestyle-pattern',
      type: 'tensorflow',
      version: '1.0.0',
      inputShape: [30, 20], // 时间序列数据，每个时间点20个特征
      outputShape: [10], // 模式类型、置信度等
    },
    'lifestyle-recommendations': {
      type: 'api',
      endpoint: process.env.RECOMMENDATION_API_ENDPOINT || 'https://api.example.com/recommendations',
      apiKey: process.env.RECOMMENDATION_API_KEY,
      version: '1.0.0',
    },
    'medical-history': {
      type: 'api',
      endpoint: process.env.MEDICAL_HISTORY_API_ENDPOINT || 'https://api.example.com/medical-analysis',
      apiKey: process.env.MEDICAL_HISTORY_API_KEY,
      version: '1.0.0',
    },
    'risk-factors': {
      type: 'api',
      endpoint: process.env.RISK_FACTORS_API_ENDPOINT || 'https://api.example.com/risk-analysis',
      apiKey: process.env.RISK_FACTORS_API_KEY,
      version: '1.0.0',
    },
    'health-trends': {
      type: 'api',
      endpoint: process.env.HEALTH_TRENDS_API_ENDPOINT || 'https://api.example.com/trend-analysis',
      apiKey: process.env.HEALTH_TRENDS_API_KEY,
      version: '1.0.0',
    },
  };

  constructor(private readonly cacheManager: CacheManager) {
    this.initializeModels();
  }

  /**
   * 初始化所有模型
   */
  private async initializeModels(): Promise<void> {
    try {
      for (const [modelName, config] of Object.entries(this.modelConfigs)) {
        if (config.type === 'tensorflow') {
          await this.loadTensorFlowModel(modelName, config);
        }
      }
      this.logger.info('所有模型初始化完成');
    } catch (error) {
      this.logger.error('模型初始化失败', error);
      throw error;
    }
  }

  /**
   * 加载TensorFlow模型
   */
  private async loadTensorFlowModel(modelName: string, config: IModelConfig): Promise<void> {
    try {
      const model = await tf.loadLayersModel(`file://${config.path}/model.json`);
      this.models.set(modelName, model);
      this.logger.info(`模型 ${modelName} 加载成功`);
    } catch (error) {
      this.logger.error(`模型 ${modelName} 加载失败`, error);
      throw error;
    }
  }

  /**
   * 使用模型进行预测
   */
  public async predict(modelName: string, data: any): Promise<any> {
    try {
      const config = this.modelConfigs[modelName];
      if (!config) {
        throw new Error(`未找到模型 ${modelName} 的配置`);
      }

      // 尝试从缓存获取结果
      const cacheKey = this.generateCacheKey(modelName, data);
      const cachedResult = await this.cacheManager.get(cacheKey);
      if (cachedResult) {
        this.logger.info(`使用缓存的预测结果: ${modelName}`);
        return cachedResult;
      }

      let result;
      if (config.type === 'tensorflow') {
        result = await this.predictWithTensorFlow(modelName, data);
      } else if (config.type === 'api') {
        result = await this.predictWithAPI(config, data);
      } else {
        throw new Error(`不支持的模型类型: ${config.type}`);
      }

      // 缓存预测结果
      await this.cacheManager.set(
        cacheKey,
        result,
        Number(process.env.AI_RESULT_EXPIRY) || 86400
      );

      return result;
    } catch (error) {
      this.logger.error(`模型 ${modelName} 预测失败`, error);
      throw error;
    }
  }

  /**
   * 使用TensorFlow模型预测
   */
  private async predictWithTensorFlow(modelName: string, data: any): Promise<any> {
    try {
      const model = this.models.get(modelName);
      if (!model) {
        throw new Error(`模型 ${modelName} 未加载`);
      }

      // 数据预处理
      const tensor = this.preprocessData(data, this.modelConfigs[modelName].inputShape);

      // 进行预测
      const prediction = await model.predict(tensor) as tf.Tensor;
      
      // 后处理预测结果
      const result = await this.postprocessPrediction(prediction, modelName);

      // 清理张量
      tensor.dispose();
      prediction.dispose();

      return result;
    } catch (error) {
      this.logger.error(`TensorFlow预测失败: ${modelName}`, error);
      throw error;
    }
  }

  /**
   * 使用API进行预测
   */
  private async predictWithAPI(config: IModelConfig, data: any): Promise<any> {
    try {
      const response = await axios.post(
        config.endpoint,
        data,
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error(`API预测失败: ${config.endpoint}`, error);
      throw error;
    }
  }

  /**
   * 数据预处理
   */
  private preprocessData(data: any, inputShape: number[]): tf.Tensor {
    try {
      // 将数据转换为数组
      const array = this.flattenData(data);

      // 确保数据维度匹配
      if (array.length !== inputShape.reduce((a, b) => a * b)) {
        throw new Error('输入数据维度不匹配');
      }

      // 创建张量
      return tf.tensor(array, inputShape);
    } catch (error) {
      this.logger.error('数据预处理失败', error);
      throw error;
    }
  }

  /**
   * 预测结果后处理
   */
  private async postprocessPrediction(prediction: tf.Tensor, modelName: string): Promise<any> {
    try {
      // 获取预测值
      const values = await prediction.array();

      // 根据不同模型进行特定处理
      switch (modelName) {
        case 'vital-signs':
          return this.processVitalSignsPrediction(values);
        case 'lifestyle':
          return this.processLifestylePrediction(values);
        case 'lifestyle-pattern':
          return this.processLifestylePatternPrediction(values);
      default:
          return values;
      }
    } catch (error) {
      this.logger.error('预测结果后处理失败', error);
      throw error;
    }
  }

  /**
   * 处理生命体征预测结果
   */
  private processVitalSignsPrediction(values: number[][]): any {
    const [score, riskLevel, recommendationType] = values[0];
    return {
      score,
      risks: this.generateRisks(riskLevel),
      recommendations: this.generateRecommendations(recommendationType, 'vital-signs')
    };
  }

  /**
   * 处理生活方式预测结果
   */
  private processLifestylePrediction(values: number[][]): any {
    const [score, patternType, riskLevel, priority, recommendationType] = values[0];
    return {
      score,
      patterns: this.generatePatterns(patternType),
      risks: this.generateRisks(riskLevel),
      priority,
      recommendations: this.generateRecommendations(recommendationType, 'lifestyle')
    };
  }

  /**
   * 处理生活方式模式预测结果
   */
  private processLifestylePatternPrediction(values: number[][]): any {
    return {
      patterns: this.generateDetailedPatterns(values[0]),
      confidence: values[0][values[0].length - 1]
    };
  }

  /**
   * 生成风险评估
   */
  private generateRisks(riskLevel: number): any[] {
    const risks = [];
    if (riskLevel > 0.7) {
      risks.push({
        level: 'high',
        description: '存在高风险因素',
        suggestions: ['立即就医', '密切监测指标']
      });
    } else if (riskLevel > 0.3) {
      risks.push({
        level: 'medium',
        description: '存在中等风险因素',
        suggestions: ['定期检查', '保持健康生活方式']
      });
    } else {
      risks.push({
        level: 'low',
        description: '风险因素较低',
        suggestions: ['维持现有状态', '继续保持良好习惯']
      });
    }
    return risks;
  }

  /**
   * 生成建议
   */
  private generateRecommendations(type: number, category: string): string[] {
    const recommendations = [];
    switch (category) {
      case 'vital-signs':
        if (type > 0.7) {
          recommendations.push('及时就医检查');
          recommendations.push('调整生活作息');
        } else if (type > 0.3) {
          recommendations.push('注意休息');
          recommendations.push('保持规律运动');
        } else {
          recommendations.push('继续保持健康的生活方式');
        }
        break;
      case 'lifestyle':
        if (type > 0.7) {
          recommendations.push('调整作息时间');
          recommendations.push('增加运动量');
          recommendations.push('改善饮食结构');
        } else if (type > 0.3) {
          recommendations.push('保持规律作息');
          recommendations.push('适度运动');
          recommendations.push('注意饮食均衡');
        } else {
          recommendations.push('维持良好的生活习惯');
        }
        break;
    }
    return recommendations;
  }

  /**
   * 生成模式分析
   */
  private generatePatterns(patternType: number): any[] {
    const patterns = [];
    if (patternType > 0.7) {
      patterns.push({
        type: 'irregular',
        description: '生活作息不规律',
        impact: '可能影响健康状况'
      });
    } else if (patternType > 0.3) {
      patterns.push({
        type: 'moderate',
        description: '生活作息基本规律',
        impact: '健康状况稳定'
      });
    } else {
      patterns.push({
        type: 'regular',
        description: '生活作息非常规律',
        impact: '有利于健康维护'
      });
    }
    return patterns;
  }

  /**
   * 生成详细的模式分析
   */
  private generateDetailedPatterns(values: number[]): any[] {
    const patterns = [];
    // 解析不同维度的模式
    const dimensions = ['运动', '饮食', '睡眠', '压力'];
    dimensions.forEach((dimension, index) => {
      const value = values[index];
      patterns.push({
        dimension,
        regularity: value > 0.7 ? 'high' : value > 0.3 ? 'medium' : 'low',
        description: this.generatePatternDescription(dimension, value)
      });
    });
    return patterns;
  }

  /**
   * 生成模式描述
   */
  private generatePatternDescription(dimension: string, value: number): string {
    switch (dimension) {
      case '运动':
        return value > 0.7 ? '运动习惯非常规律' :
               value > 0.3 ? '运动习惯一般' : '运动习惯需要改善';
      case '饮食':
        return value > 0.7 ? '饮食习惯非常健康' :
               value > 0.3 ? '饮食习惯一般' : '饮食习惯需要改善';
      case '睡眠':
        return value > 0.7 ? '睡眠质量很好' :
               value > 0.3 ? '睡眠质量一般' : '睡眠质量需要改善';
      case '压力':
        return value > 0.7 ? '压力管理良好' :
               value > 0.3 ? '压力水平适中' : '压力水平较高';
      default:
        return '未知模式';
    }
  }

  /**
   * 将数据扁平化为数组
   */
  private flattenData(data: any): number[] {
    const result: number[] = [];
    
    const flatten = (obj: any) => {
      for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'number') {
          result.push(value);
        } else if (Array.isArray(value)) {
          value.forEach(item => flatten(item));
        } else if (typeof value === 'object' && value !== null) {
          flatten(value);
        }
      }
    };

    flatten(data);
    return result;
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(modelName: string, data: any): string {
    return `ai:${modelName}:${JSON.stringify(data)}`;
  }
}

/**
 * 模型配置接口
 */
interface IModelConfig {
  path?: string;
  type: 'tensorflow' | 'api';
  version: string;
  inputShape?: number[];
  outputShape?: number[];
  endpoint?: string;
  apiKey?: string;
} 