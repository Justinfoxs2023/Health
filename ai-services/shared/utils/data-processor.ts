import { Injectable } from '@nestjs/common';
import { Logger } from './logger';
import { HealthData } from '../types/health.types';
import {
  ProcessedData,
  ValidationResult,
  ValidationError,
  DataProcessorConfig
} from '../types/data-processor.types';

@Injectable()
export class DataProcessor {
  private readonly logger = new Logger(DataProcessor.name);
  private readonly config: DataProcessorConfig;

  constructor(config?: DataProcessorConfig) {
    this.config = config || this.getDefaultConfig();
  }

  /**
   * 处理健康数据
   */
  async processHealthData(data: HealthData): Promise<ProcessedData> {
    try {
      // 数据验证
      const validationResult = this.validateData(data);
      if (!validationResult.isValid) {
        throw new Error(`数据验证失败: ${JSON.stringify(validationResult.errors)}`);
      }

      // 特征工程
      const features = this.extractFeatures(data);

      // 数据标准化
      const normalizedFeatures = this.normalizeFeatures(features);

      return {
        features: normalizedFeatures,
        metadata: {
          featureNames: this.getFeatureNames(),
          normalizedRanges: this.getNormalizedRanges(features)
        }
      };
    } catch (error) {
      this.logger.error('数据处理失败', error);
      throw error;
    }
  }

  /**
   * 验证数据
   */
  private validateData(data: HealthData): ValidationResult {
    const errors: ValidationError[] = [];

    // 检查必填字段
    this.config.validation?.requiredFields?.forEach(field => {
      if (!this.checkFieldExists(data, field)) {
        errors.push({
          field,
          message: `字段 ${field} 是必需的`,
          code: 'REQUIRED_FIELD_MISSING'
        });
      }
    });

    // 检查数值范围
    if (this.config.validation?.ranges) {
      Object.entries(this.config.validation.ranges).forEach(([field, range]) => {
        const value = this.getFieldValue(data, field);
        if (typeof value === 'number') {
          if (value < range.min || value > range.max) {
            errors.push({
              field,
              message: `字段 ${field} 的值必须在 ${range.min} 和 ${range.max} 之间`,
              code: 'VALUE_OUT_OF_RANGE'
            });
          }
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 提取特征
   */
  private extractFeatures(data: HealthData): number[][] {
    const features: number[][] = [];
    
    // 基础特征提取
    const baseFeatures = this.extractBaseFeatures(data);
    features.push(baseFeatures);

    // 派生特征
    if (this.config.featureEngineering?.derivedFeatures) {
      const derivedFeatures = this.extractDerivedFeatures(data);
      features.push(derivedFeatures);
    }

    return features;
  }

  /**
   * 提取基础特征
   */
  private extractBaseFeatures(data: HealthData): number[] {
    return [
      data.physicalData.height,
      data.physicalData.weight,
      data.physicalData.bloodPressure.systolic,
      data.physicalData.bloodPressure.diastolic,
      data.physicalData.heartRate,
      data.physicalData.bodyTemperature,
      data.physicalData.bloodOxygen,
      data.mentalData.stressLevel,
      data.mentalData.moodScore,
      data.mentalData.sleepQuality,
      data.nutritionData.calorieIntake,
      data.nutritionData.waterIntake,
      data.lifestyleData.sleepHours,
      data.lifestyleData.activityLevel
    ];
  }

  /**
   * 提取派生特征
   */
  private extractDerivedFeatures(data: HealthData): number[] {
    const derivedFeatures: number[] = [];

    if (this.config.featureEngineering?.derivedFeatures) {
      Object.entries(this.config.featureEngineering.derivedFeatures).forEach(
        ([name, calculator]) => {
          try {
            const value = calculator(data);
            derivedFeatures.push(value);
          } catch (error) {
            this.logger.warn(`计算派生特征 ${name} 失败`, error);
          }
        }
      );
    }

    return derivedFeatures;
  }

  /**
   * 标准化特征
   */
  private normalizeFeatures(features: number[][]): number[][] {
    const method = this.config.normalization?.method || 'min-max';

    switch (method) {
      case 'min-max':
        return this.minMaxNormalization(features);
      case 'z-score':
        return this.zScoreNormalization(features);
      default:
        return features;
    }
  }

  /**
   * Min-Max 标准化
   */
  private minMaxNormalization(features: number[][]): number[][] {
    return features.map(featureArray => {
      const min = Math.min(...featureArray);
      const max = Math.max(...featureArray);
      return featureArray.map(value => 
        max === min ? 0.5 : (value - min) / (max - min)
      );
    });
  }

  /**
   * Z-Score 标准化
   */
  private zScoreNormalization(features: number[][]): number[][] {
    return features.map(featureArray => {
      const mean = this.calculateMean(featureArray);
      const std = this.calculateStd(featureArray);
      return featureArray.map(value => 
        std === 0 ? 0 : (value - mean) / std
      );
    });
  }

  /**
   * 计算平均值
   */
  private calculateMean(array: number[]): number {
    return array.reduce((sum, value) => sum + value, 0) / array.length;
  }

  /**
   * 计算标准差
   */
  private calculateStd(array: number[]): number {
    const mean = this.calculateMean(array);
    const squareDiffs = array.map(value => Math.pow(value - mean, 2));
    const variance = this.calculateMean(squareDiffs);
    return Math.sqrt(variance);
  }

  /**
   * 获取特征名称
   */
  private getFeatureNames(): string[] {
    const baseFeatures = [
      'height',
      'weight',
      'bloodPressure_systolic',
      'bloodPressure_diastolic',
      'heartRate',
      'bodyTemperature',
      'bloodOxygen',
      'stressLevel',
      'moodScore',
      'sleepQuality',
      'calorieIntake',
      'waterIntake',
      'sleepHours',
      'activityLevel'
    ];

    const derivedFeatures = this.config.featureEngineering?.derivedFeatures
      ? Object.keys(this.config.featureEngineering.derivedFeatures)
      : [];

    return [...baseFeatures, ...derivedFeatures];
  }

  /**
   * 获取标准化范围
   */
  private getNormalizedRanges(features: number[][]): { [key: string]: { min: number; max: number } } {
    const featureNames = this.getFeatureNames();
    const ranges: { [key: string]: { min: number; max: number } } = {};

    features.forEach((featureArray, index) => {
      if (featureNames[index]) {
        ranges[featureNames[index]] = {
          min: Math.min(...featureArray),
          max: Math.max(...featureArray)
        };
      }
    });

    return ranges;
  }

  /**
   * 获取默认配置
   */
  private getDefaultConfig(): DataProcessorConfig {
    return {
      normalization: {
        method: 'min-max'
      },
      validation: {
        requiredFields: [
          'physicalData',
          'mentalData',
          'nutritionData',
          'lifestyleData'
        ],
        ranges: {
          'physicalData.height': { min: 0, max: 300 },
          'physicalData.weight': { min: 0, max: 500 },
          'physicalData.bloodPressure.systolic': { min: 70, max: 200 },
          'physicalData.bloodPressure.diastolic': { min: 40, max: 130 },
          'physicalData.heartRate': { min: 40, max: 200 },
          'physicalData.bodyTemperature': { min: 35, max: 42 },
          'physicalData.bloodOxygen': { min: 80, max: 100 }
        }
      }
    };
  }

  /**
   * 检查字段是否存在
   */
  private checkFieldExists(data: any, field: string): boolean {
    const fields = field.split('.');
    let current = data;

    for (const f of fields) {
      if (current === undefined || current === null) {
        return false;
      }
      current = current[f];
    }

    return current !== undefined && current !== null;
  }

  /**
   * 获取字段值
   */
  private getFieldValue(data: any, field: string): any {
    const fields = field.split('.');
    let current = data;

    for (const f of fields) {
      if (current === undefined || current === null) {
        return undefined;
      }
      current = current[f];
    }

    return current;
  }
} 