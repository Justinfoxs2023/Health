import { HEALTH_THRESHOLDS } from '../../constants';
import { IHealthData, HealthDataType } from '../../types';
import { logger } from '../logger';

/** 健康风险等级 */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/** 健康风险评估结果 */
export interface IRiskAssessment {
  /** level 的描述 */
  level: RiskLevel;
  /** score 的描述 */
  score: number;
  /** factors 的描述 */
  factors: string[];
  /** suggestions 的描述 */
  suggestions: string[];
  /** details 的描述 */
  details: {
    type: HealthDataType;
    score: number;
    status: string;
    factors: string[];
  }[];
}

/** 健康趋势类型 */
export enum TrendType {
  IMPROVING = 'improving',
  STABLE = 'stable',
  WORSENING = 'worsening',
}

/** 健康趋势分析结果 */
export interface ITrendAnalysis {
  /** type 的描述 */
  type: TrendType;
  /** changeRate 的描述 */
  changeRate: number;
  /** prediction 的描述 */
  prediction: number[];
  /** confidence 的描述 */
  confidence: number;
  /** seasonality 的描述 */
  seasonality?: {
    pattern: 'daily' | 'weekly' | 'monthly';
    strength: number;
  };
  /** outliers 的描述 */
  outliers?: {
    timestamp: Date;
    value: number;
    deviation: number;
  }[];
}

/** 健康建议类型 */
export interface IHealthAdvice {
  /** type 的描述 */
  type: HealthDataType;
  /** advice 的描述 */
  advice: string;
  /** priority 的描述 */
  priority: number;
  /** relatedData 的描述 */
  relatedData?: IHealthData[];
  /** category 的描述 */
  category: 'immediate' | 'short_term' | 'long_term';
  /** confidence 的描述 */
  confidence: number;
  /** impact 的描述 */
  impact: 'high' | 'medium' | 'low';
}

/** 维度分析结果 */
interface IDimensionAnalysis {
  /** type 的描述 */
  type: HealthDataType;
  /** score 的描述 */
  score: number;
  /** status 的描述 */
  status: 'normal' | 'warning' | 'danger';
  /** details 的描述 */
  details: string[];
  /** trends 的描述 */
  trends: {
    shortTerm: TrendType;
    longTerm: TrendType;
  };
  /** patterns 的描述 */
  patterns: {
    cyclical: boolean;
    seasonal: boolean;
    frequency?: number;
  };
}

/** 相关性分析结果 */
interface ICorrelationAnalysis {
  /** type1 的描述 */
  type1: HealthDataType;
  /** type2 的描述 */
  type2: HealthDataType;
  /** correlation 的描述 */
  correlation: number;
  /** significance 的描述 */
  significance: number;
  /** description 的描述 */
  description: string;
  /** timeOffset 的描述 */
  timeOffset?: number; // 时间滞后效应
  /** causalityScore 的描述 */
  causalityScore?: number; // 因果关系强度
}

/** 预测模型类型 */
enum PredictionModelType {
  LINEAR = 'linear',
  EXPONENTIAL = 'exponential',
  MOVING_AVERAGE = 'moving_average',
  ARIMA = 'arima',
}

/** 健康分析服务 */
export class HealthAnalysisService {
  private static instance: HealthAnalysisService;

  private constructor() {}

  /** 获取单例 */
  public static getInstance(): HealthAnalysisService {
    if (!HealthAnalysisService.instance) {
      HealthAnalysisService.instance = new HealthAnalysisService();
    }
    return HealthAnalysisService.instance;
  }

  /** 评估健康风险 */
  public async assessRisk(data: IHealthData[]): Promise<IRiskAssessment> {
    try {
      const factors: string[] = [];
      const suggestions: string[] = [];
      let totalScore = 0;
      const details: IRiskAssessment['details'] = [];

      // 分析每种类型的健康数据
      Object.values(HealthDataType).forEach(type => {
        const typeData = data.filter(d => d.type === type);
        if (typeData.length > 0) {
          const analysis = this.analyzeDataType(type, typeData);
          totalScore += analysis.score;

          if (analysis.factor) {
            factors.push(analysis.factor);
          }
          if (analysis.suggestion) {
            suggestions.push(analysis.suggestion);
          }

          details.push({
            type,
            score: analysis.score,
            status: this.getStatusFromScore(analysis.score),
            factors: analysis.factors || [],
          });
        }
      });

      // 分析数据间的相关性
      const correlations = await this.analyzeCorrelations(data);
      correlations.forEach(corr => {
        if (corr.significance < 0.05 && Math.abs(corr.correlation) > 0.7) {
          factors.push(corr.description);
        }
      });

      // 计算风险等级
      const level = this.calculateRiskLevel(totalScore);

      return {
        level,
        score: totalScore,
        factors,
        suggestions,
        details,
      };
    } catch (error) {
      logger.error('Health risk assessment failed', { error });
      throw error;
    }
  }

  /** 分析健康趋势 */
  public async analyzeTrend(
    data: IHealthData[],
    dataType: HealthDataType,
  ): Promise<ITrendAnalysis> {
    try {
      // 按时间排序
      const sortedData = [...data]
        .filter(d => d.type === dataType)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      if (sortedData.length < 2) {
        throw new Error('Insufficient data for trend analysis');
      }

      const values = sortedData.map(d => d.value);
      const timestamps = sortedData.map(d => d.timestamp);

      // 检测异常值
      const outliers = this.detectOutliers(values, timestamps);

      // 检测季节性
      const seasonality = this.detectSeasonality(values, timestamps);

      // 选择最佳预测模型
      const bestModel = this.selectBestPredictionModel(values, timestamps);

      // 计算变化率
      const changeRate = this.calculateChangeRate(values);

      // 使用选定的模型进行预测
      const prediction = this.predictWithModel(values, timestamps, bestModel);

      // 确定趋势类型
      const type = this.determineTrendType(changeRate);

      // 计算置信度
      const confidence = this.calculateConfidence(values);

      return {
        type,
        changeRate,
        prediction,
        confidence,
        seasonality,
        outliers,
      };
    } catch (error) {
      logger.error('Health trend analysis failed', { error });
      throw error;
    }
  }

  /** 检测异常值 */
  private detectOutliers(values: number[], timestamps: Date[]): ITrendAnalysis['outliers'] {
    const mean = this.calculateMean(values);
    const std = this.calculateStandardDeviation(values, mean);
    const threshold = 2; // Z-score阈值

    return values
      .map((value, index) => {
        const zScore = Math.abs((value - mean) / std);
        if (zScore > threshold) {
          return {
            timestamp: timestamps[index],
            value,
            deviation: zScore,
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }

  /** 检测季节性 */
  private detectSeasonality(values: number[], timestamps: Date[]): ITrendAnalysis['seasonality'] {
    // 计算时间间隔
    const intervals = timestamps.slice(1).map((t, i) => t.getTime() - timestamps[i].getTime());

    // 检查是否存在规律性间隔
    const dailyPattern = this.checkPattern(intervals, 24 * 60 * 60 * 1000);
    const weeklyPattern = this.checkPattern(intervals, 7 * 24 * 60 * 60 * 1000);
    const monthlyPattern = this.checkPattern(intervals, 30 * 24 * 60 * 60 * 1000);

    if (dailyPattern > 0.7) {
      return { pattern: 'daily', strength: dailyPattern };
    }
    if (weeklyPattern > 0.7) {
      return { pattern: 'weekly', strength: weeklyPattern };
    }
    if (monthlyPattern > 0.7) {
      return { pattern: 'monthly', strength: monthlyPattern };
    }

    return undefined;
  }

  /** 检查时间模式 */
  private checkPattern(intervals: number[], targetInterval: number): number {
    const deviations = intervals.map(
      interval => Math.abs(interval - targetInterval) / targetInterval,
    );
    return 1 - deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
  }

  /** 选择最佳预测模型 */
  private selectBestPredictionModel(values: number[], timestamps: Date[]): PredictionModelType {
    // 计算各模型的预测误差
    const errors = new Map<PredictionModelType, number>();

    // 使用最后20%的数据作为测试集
    const testSize = Math.floor(values.length * 0.2);
    const trainValues = values.slice(0, -testSize);
    const testValues = values.slice(-testSize);

    // 测试各个模型
    Object.values(PredictionModelType).forEach(model => {
      const predictions = this.predictWithModel(trainValues, timestamps.slice(0, -testSize), model);
      const error = this.calculatePredictionError(predictions, testValues);
      errors.set(model, error);
    });

    // 返回误差最小的模型
    return Array.from(errors.entries()).reduce(
      (best, [model, error]) => (error < errors.get(best)! ? model : best),
      PredictionModelType.LINEAR,
    );
  }

  /** 使用指定模型进行预测 */
  private predictWithModel(
    values: number[],
    timestamps: Date[],
    model: PredictionModelType,
  ): number[] {
    switch (model) {
      case PredictionModelType.LINEAR:
        return this.linearPrediction(values);
      case PredictionModelType.EXPONENTIAL:
        return this.exponentialPrediction(values);
      case PredictionModelType.MOVING_AVERAGE:
        return this.movingAveragePrediction(values);
      case PredictionModelType.ARIMA:
        return this.arimaPrediction(values);
      default:
        return this.linearPrediction(values);
    }
  }

  /** 线性预测 */
  private linearPrediction(values: number[]): number[] {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    // 计算线性回归参数
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // 预测未来3个点
    return Array.from({ length: 3 }, (_, i) => slope * (n + i) + intercept);
  }

  /** 指数预测 */
  private exponentialPrediction(values: number[]): number[] {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values.map(v => Math.log(Math.max(v, 0.0001))); // 避免负值和零

    // 计算指数回归参数
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // 预测未来3个点
    return Array.from({ length: 3 }, (_, i) => Math.exp(slope * (n + i) + intercept));
  }

  /** 移动平均预测 */
  private movingAveragePrediction(values: number[]): number[] {
    const windowSize = Math.min(5, Math.floor(values.length / 2));
    const lastWindow = values.slice(-windowSize);
    const avg = lastWindow.reduce((a, b) => a + b, 0) / windowSize;
    return Array(3).fill(avg);
  }

  /** ARIMA预测 */
  private arimaPrediction(values: number[]): number[] {
    // 简化版ARIMA实现
    const diff = values.slice(1).map((v, i) => v - values[i]);
    const ma = this.movingAveragePrediction(diff);
    const lastValue = values[values.length - 1];
    return ma.map((d, i) => lastValue + d * (i + 1));
  }

  /** 计算预测误差 */
  private calculatePredictionError(predictions: number[], actuals: number[]): number {
    const squaredErrors = predictions.map((pred, i) => Math.pow(pred - actuals[i], 2));
    return Math.sqrt(squaredErrors.reduce((a, b) => a + b, 0) / predictions.length);
  }

  /** 获取状态描述 */
  private getStatusFromScore(score: number): string {
    if (score >= 3) return 'danger';
    if (score >= 1) return 'warning';
    return 'normal';
  }

  /** 计算均值 */
  private calculateMean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /** 计算标准差 */
  private calculateStandardDeviation(values: number[], mean: number): number {
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
  }

  /** 查找相关因素 */
  private findRelatedFactors(data: IHealthData, allData: IHealthData[]): string[] {
    const factors: string[] = [];
    const timeWindow = 24 * 60 * 60 * 1000; // 24小时

    // 查找时间窗口内的其他异常数据
    allData.forEach(d => {
      if (
        d.type !== data.type &&
        Math.abs(d.timestamp.getTime() - data.timestamp.getTime()) <= timeWindow
      ) {
        const threshold = HEALTH_THRESHOLDS[d.type];
        if (threshold) {
          if (d.value > threshold.MAX || d.value < threshold.MIN) {
            factors.push(`${d.type}异常`);
          }
        }
      }
    });

    return factors;
  }

  /** 计算维度得分 */
  private calculateTypeDimensionScore(
    type: HealthDataType,
    data: IHealthData[],
  ): { score: number; status: 'normal' | 'warning' | 'danger'; details: string[] } {
    const values = data.map(d => d.value);
    const mean = this.calculateMean(values);
    const threshold = HEALTH_THRESHOLDS[type];

    if (!threshold) {
      return { score: 0, status: 'normal', details: [] };
    }

    let score = 0;
    let status: 'normal' | 'warning' | 'danger' = 'normal';
    const details: string[] = [];

    // 根据不同类型计算得分
    switch (type) {
      case HealthDataType.BLOOD_PRESSURE:
        if (mean > threshold.SYSTOLIC.MAX) {
          score = 2;
          status = 'danger';
          details.push('血压持续偏高');
        } else if (mean < threshold.SYSTOLIC.MIN) {
          score = 1;
          status = 'warning';
          details.push('血压偏低');
        }
        break;
      // ... 其他类型的评分逻辑
    }

    return { score, status, details };
  }

  /** 获取类型权重 */
  private getTypeWeight(type: HealthDataType): number {
    // 不同类型的健康数据权重
    const weights: Record<HealthDataType, number> = {
      [HealthDataType.BLOOD_PRESSURE]: 0.3,
      [HealthDataType.HEART_RATE]: 0.2,
      [HealthDataType.BLOOD_SUGAR]: 0.2,
      [HealthDataType.BODY_TEMPERATURE]: 0.15,
      [HealthDataType.WEIGHT]: 0.1,
      [HealthDataType.HEIGHT]: 0.05,
    };
    return weights[type] || 0.1;
  }

  /** 生成基于得分的建议 */
  private generateScoreBasedSuggestions(dimensions: IDimensionAnalysis[]): string[] {
    const suggestions: string[] = [];

    dimensions.forEach(dim => {
      if (dim.status === 'danger') {
        suggestions.push(`建议及时就医检查${dim.type}`);
      } else if (dim.status === 'warning') {
        suggestions.push(`建议关注${dim.type}变化趋势`);
      }
    });

    return suggestions;
  }

  /** 计算皮尔逊相关系数 */
  private calculatePearsonCorrelation(data1: IHealthData[], data2: IHealthData[]): number {
    const values1 = data1.map(d => d.value);
    const values2 = data2.map(d => d.value);
    const mean1 = this.calculateMean(values1);
    const mean2 = this.calculateMean(values2);

    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;

    for (let i = 0; i < values1.length; i++) {
      const diff1 = values1[i] - mean1;
      const diff2 = values2[i] - mean2;
      numerator += diff1 * diff2;
      denominator1 += diff1 * diff1;
      denominator2 += diff2 * diff2;
    }

    return numerator / Math.sqrt(denominator1 * denominator2);
  }

  /** 计算显著性 */
  private calculateSignificance(correlation: number, n: number): number {
    // 使用t检验计算显著性
    const t = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation));
    return 2 * (1 - this.tDistribution(Math.abs(t), n - 2));
  }

  /** t分布计算 */
  private tDistribution(t: number, df: number): number {
    // 简化的t分布计算
    const x = df / (df + t * t);
    return 1 - 0.5 * Math.pow(x, df / 2);
  }

  /** 描述相关性 */
  private describeCorrelation(
    type1: HealthDataType,
    type2: HealthDataType,
    correlation: number,
  ): string {
    const strength = Math.abs(correlation);
    const direction = correlation > 0 ? '正相关' : '负相关';
    let description = '';

    if (strength > 0.7) {
      description = `强${direction}`;
    } else if (strength > 0.3) {
      description = `中等${direction}`;
    } else {
      description = `弱${direction}`;
    }

    return `${type1}与${type2}呈${description}关系`;
  }

  /** 分析单个类型的健康数据 */
  private analyzeDataType(
    type: HealthDataType,
    data: IHealthData[],
  ): {
    score: number;
    factor?: string;
    suggestion?: string;
  } {
    const threshold = HEALTH_THRESHOLDS[type];
    if (!threshold) return { score: 0 };

    const latestValue = data[data.length - 1].value;
    let score = 0;
    let factor: string | undefined;
    let suggestion: string | undefined;

    switch (type) {
      case HealthDataType.BLOOD_PRESSURE:
        if (latestValue > threshold.SYSTOLIC.MAX) {
          score = 2;
          factor = '血压偏高';
          suggestion = '建议减少盐分摄入，保持规律运动';
        } else if (latestValue < threshold.SYSTOLIC.MIN) {
          score = 1;
          factor = '血压偏低';
          suggestion = '建议适当增加盐分摄入，避免剧烈运动';
        }
        break;
      // ... 其他类型的分析逻辑
    }

    return { score, factor, suggestion };
  }

  /** 计算风险等级 */
  private calculateRiskLevel(score: number): RiskLevel {
    if (score >= 3) return RiskLevel.HIGH;
    if (score >= 1) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  /** 计算变化率 */
  private calculateChangeRate(values: number[]): number {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    return (last - first) / first;
  }

  /** 预测趋势 */
  private predictTrend(values: number[]): number[] {
    // 简单线性回归预测
    const n = values.length;
    const prediction: number[] = [];

    if (n >= 2) {
      const lastValue = values[n - 1];
      const trend = values[n - 1] - values[n - 2];

      // 预测未来3个点
      for (let i = 1; i <= 3; i++) {
        prediction.push(lastValue + trend * i);
      }
    }

    return prediction;
  }

  /** 确定趋势类型 */
  private determineTrendType(changeRate: number): TrendType {
    if (changeRate > 0.1) return TrendType.IMPROVING;
    if (changeRate < -0.1) return TrendType.WORSENING;
    return TrendType.STABLE;
  }

  /** 计算置信度 */
  private calculateConfidence(values: number[]): number {
    // 简单方差计算作为置信度指标
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.max(0, 1 - Math.sqrt(variance) / mean);
  }

  /** 生成类型特定的建议 */
  private generateTypeAdvice(type: HealthDataType, data: IHealthData[]): IHealthAdvice {
    const latestValue = data[data.length - 1].value;
    const threshold = HEALTH_THRESHOLDS[type];

    let advice = '';
    let priority = 1;

    switch (type) {
      case HealthDataType.BLOOD_PRESSURE:
        if (latestValue > threshold.SYSTOLIC.MAX) {
          advice = '您的血压偏高，建议：\n1. 限制盐分摄入\n2. ���持规律运动\n3. 避免熬夜';
          priority = 3;
        } else if (latestValue < threshold.SYSTOLIC.MIN) {
          advice = '您的血压偏低，建议：\n1. 适当增加盐分摄入\n2. 避免剧烈运动\n3. 保证充足睡眠';
          priority = 2;
        } else {
          advice = '您的血压正常，建议继续保持健康的生活方式';
          priority = 1;
        }
        break;
      // ... 其他类型的建议生成逻辑
    }

    return {
      type,
      advice,
      priority,
      relatedData: data,
    };
  }

  /** 生成健康建议 */
  public async generateAdvice(data: IHealthData[]): Promise<IHealthAdvice[]> {
    try {
      const advice: IHealthAdvice[] = [];

      // 为每种类型的数据生成建议
      Object.values(HealthDataType).forEach(type => {
        const typeData = data.filter(d => d.type === type);
        if (typeData.length > 0) {
          const typeAdvice = this.generateTypeAdvice(type, typeData);
          if (typeAdvice) advice.push(typeAdvice);
        }
      });

      // 分析数据间的相关性
      const correlations = await this.analyzeCorrelations(data);
      correlations.forEach(corr => {
        if (corr.significance < 0.05 && Math.abs(corr.correlation) > 0.7) {
          advice.push({
            type: corr.type1,
            advice: `建议关注${corr.type1}与${corr.type2}的关联变化: ${corr.description}`,
            priority: 2,
            category: 'short_term',
            confidence: 1 - corr.significance,
            impact: Math.abs(corr.correlation) > 0.8 ? 'high' : 'medium',
          });
        }
      });

      // 检测异常模式
      const dimensions = await this.calculateHealthScore(data);
      dimensions.forEach(dim => {
        if (dim.status === 'danger') {
          advice.push({
            type: dim.type,
            advice: `建议立即关注${dim.type}指标: ${dim.details.join(', ')}`,
            priority: 3,
            category: 'immediate',
            confidence: 0.9,
            impact: 'high',
          });
        }
      });

      // 按优先级排序
      return advice.sort((a, b) => b.priority - a.priority);
    } catch (error) {
      logger.error('Health advice generation failed', { error });
      throw error;
    }
  }

  /** 计算健康评分 */
  private async calculateHealthScore(data: IHealthData[]): Promise<IDimensionAnalysis[]> {
    const dimensions: IDimensionAnalysis[] = [];

    // 为每种类型计算评分
    Object.values(HealthDataType).forEach(type => {
      const typeData = data.filter(d => d.type === type);
      if (typeData.length > 0) {
        const values = typeData.map(d => d.value);
        const mean = this.calculateMean(values);
        const std = this.calculateStandardDeviation(values, mean);

        // 计算短期和长期趋势
        const shortTermData = typeData.slice(-7); // 最近7天
        const longTermData = typeData; // 全部数据

        const shortTermTrend = this.determineTrendType(
          this.calculateChangeRate(shortTermData.map(d => d.value)),
        );
        const longTermTrend = this.determineTrendType(this.calculateChangeRate(values));

        // 检测模式
        const timestamps = typeData.map(d => d.timestamp);
        const seasonality = this.detectSeasonality(values, timestamps);

        dimensions.push({
          type,
          score: this.calculateDimensionScore(values, mean, std),
          status: this.getDimensionStatus(values, type),
          details: this.generateDimensionDetails(values, type),
          trends: {
            shortTerm: shortTermTrend,
            longTerm: longTermTrend,
          },
          patterns: {
            cyclical: Boolean(seasonality),
            seasonal: Boolean(seasonality),
            frequency: seasonality ? this.getPatternFrequency(seasonality.pattern) : undefined,
          },
        });
      }
    });

    return dimensions;
  }

  /** 计算维度得分 */
  private calculateDimensionScore(values: number[], mean: number, std: number): number {
    const normalizedValues = values.map(v => Math.abs((v - mean) / std));
    return Math.min(
      5,
      Math.max(0, 5 - normalizedValues.reduce((a, b) => a + b, 0) / values.length),
    );
  }

  /** 获取维度状态 */
  private getDimensionStatus(
    values: number[],
    type: HealthDataType,
  ): 'normal' | 'warning' | 'danger' {
    const threshold = HEALTH_THRESHOLDS[type];
    if (!threshold) return 'normal';

    const abnormalCount = values.filter(v => v > threshold.MAX || v < threshold.MIN).length;

    if (abnormalCount > values.length * 0.3) return 'danger';
    if (abnormalCount > values.length * 0.1) return 'warning';
    return 'normal';
  }

  /** 生成维度详情 */
  private generateDimensionDetails(values: number[], type: HealthDataType): string[] {
    const details: string[] = [];
    const threshold = HEALTH_THRESHOLDS[type];
    if (!threshold) return details;

    const mean = this.calculateMean(values);
    const std = this.calculateStandardDeviation(values, mean);

    if (mean > threshold.MAX) {
      details.push(`平均值(${mean.toFixed(1)})超出正常范围`);
    } else if (mean < threshold.MIN) {
      details.push(`平均值(${mean.toFixed(1)})低于正常范围`);
    }

    const cv = std / mean; // 变异系数
    if (cv > 0.2) {
      details.push(`波动较大(${(cv * 100).toFixed(1)}%)`);
    }

    return details;
  }

  /** 获取模式频率 */
  private getPatternFrequency(pattern: 'daily' | 'weekly' | 'monthly'): number {
    switch (pattern) {
      case 'daily':
        return 24 * 60 * 60 * 1000; // 24小时
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000; // 7天
      case 'monthly':
        return 30 * 24 * 60 * 60 * 1000; // 30天
      default:
        return 0;
    }
  }
}

export const healthAnalysisService = HealthAnalysisService.getInstance();
