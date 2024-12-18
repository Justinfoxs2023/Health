import { CacheManager } from '../cache/CacheManager';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { injectable, inject } from 'inversify';

export interface IAnalysisConfig {
  /** timeRange 的描述 */
    timeRange: {
    start: Date;
    end: Date;
  };
  /** granularity 的描述 */
    granularity: "minute" | "hour" | "day" | "week" | "month";
  /** metrics 的描述 */
    metrics: string[];
}

export interface ITrendAnalysisResult {
  /** trend 的描述 */
    trend: increasing  decreasing  stable;
  changeRate: number;
  confidence: number;
  dataPoints: Array{
    timestamp: Date;
    value: number;
  }>;
}

export interface ICorrelationAnalysisResult {
  /** coefficient 的描述 */
    coefficient: number;
  /** significance 的描述 */
    significance: number;
  /** relationship 的描述 */
    relationship: strong  moderate  weak  none;
  scatterPlot: Array{
    x: number;
    y: number;
  }>;
}

export interface IAnomalyDetectionResult {
  /** anomalies 的描述 */
    anomalies: Array{
    timestamp: Date;
    value: number;
    score: number;
    type: spike  dip  level_shift  trend_change;
  }>;
  threshold: number;
  modelConfidence: number;
}

export interface IPredictionResult {
  /** predictions 的描述 */
    predictions: Array{
    timestamp: Date;
    value: number;
    confidence: {
      lower: number;
      upper: number;
    };
  }>;
  accuracy: number;
  modelType: string;
}

/**
 * 分析服务
 */
@injectable()
export class AnalysisService {
  constructor(
    @inject() private logger: Logger,
    @inject() private eventBus: EventBus,
    @inject() private metricsCollector: MetricsCollector,
    @inject() private cacheManager: CacheManager,
  ) {}

  /**
   * 执行趋势分析
   */
  public async analyzeTrend(metric: string, config: IAnalysisConfig): Promise<ITrendAnalysisResult> {
    try {
      const data = await this.getMetricsData(metric, config);
      const result = this.calculateTrend(data);

      this.eventBus.publish('analysis.trend.completed', {
        metric,
        result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      this.logger.error(`趋势分析失败: ${metric}`, error);
      throw error;
    }
  }

  /**
   * 执行相关性分析
   */
  public async analyzeCorrelation(
    metrics: [string, string],
    config: IAnalysisConfig,
  ): Promise<ICorrelationAnalysisResult> {
    try {
      const [data1, data2] = await Promise.all([
        this.getMetricsData(metrics[0], config),
        this.getMetricsData(metrics[1], config),
      ]);

      const result = this.calculateCorrelation(data1, data2);

      this.eventBus.publish('analysis.correlation.completed', {
        metrics,
        result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      this.logger.error(`相关性分析失败: ${metrics.join(' vs ')}`, error);
      throw error;
    }
  }

  /**
   * 执行异常检测
   */
  public async detectAnomalies(
    metric: string,
    config: IAnalysisConfig,
  ): Promise<IAnomalyDetectionResult> {
    try {
      const data = await this.getMetricsData(metric, config);
      const result = this.findAnomalies(data);

      this.eventBus.publish('analysis.anomaly.detected', {
        metric,
        result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      this.logger.error(`异常检测失败: ${metric}`, error);
      throw error;
    }
  }

  /**
   * 执行预测分析
   */
  public async predictTrend(
    metric: string,
    config: IAnalysisConfig,
    horizon: number,
  ): Promise<IPredictionResult> {
    try {
      const data = await this.getMetricsData(metric, config);
      const result = this.calculatePredictions(data, horizon);

      this.eventBus.publish('analysis.prediction.completed', {
        metric,
        result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      this.logger.error(`预测分析失败: ${metric}`, error);
      throw error;
    }
  }

  /**
   * 获取指标数据
   */
  private async getMetricsData(
    metric: string,
    config: IAnalysisConfig,
  ): Promise<Array<{ timestamp: Date; value: number }>> {
    const cacheKey = `analysis:${metric}:${config.timeRange.start.getTime()}:${config.timeRange.end.getTime()}`;
    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const data = await this.metricsCollector.getMetrics(metric, {
      start: config.timeRange.start,
      end: config.timeRange.end,
      granularity: config.granularity,
    });

    await this.cacheManager.set(cacheKey, data, 3600); // 1小时缓存
    return data;
  }

  /**
   * 计算趋势
   */
  private calculateTrend(data: Array<{ timestamp: Date; value: number }>): ITrendAnalysisResult {
    const values = data.map(point => point.value);
    const timestamps = data.map(point => point.timestamp.getTime());

    // 简单线性回归
    const n = values.length;
    const sumX = timestamps.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = timestamps.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumXX = timestamps.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const changeRate = (slope * (timestamps[n - 1] - timestamps[0])) / sumY;

    return {
      trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
      changeRate: Math.abs(changeRate),
      confidence: 0.95, // 简化的置信度计算
      dataPoints: data,
    };
  }

  /**
   * 计算相关性
   */
  private calculateCorrelation(
    data1: Array<{ timestamp: Date; value: number }>,
    data2: Array<{ timestamp: Date; value: number }>,
  ): ICorrelationAnalysisResult {
    const values1 = data1.map(point => point.value);
    const values2 = data2.map(point => point.value);

    // 计算皮尔逊相关系数
    const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
    const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;

    const variance1 = values1.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0);
    const variance2 = values2.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0);

    const covariance = values1.reduce((sum, x, i) => sum + (x - mean1) * (values2[i] - mean2), 0);

    const coefficient = covariance / Math.sqrt(variance1 * variance2);

    return {
      coefficient,
      significance: 0.95, // 简化的显著性计算
      relationship: this.getCorrelationStrength(coefficient),
      scatterPlot: values1.map((x, i) => ({ x, y: values2[i] })),
    };
  }

  /**
   * 获取相关性强度描述
   */
  private getCorrelationStrength(coefficient: number): 'strong' | 'moderate' | 'weak' | 'none' {
    const abs = Math.abs(coefficient);
    if (abs >= 0.7) return 'strong';
    if (abs >= 0.3) return 'moderate';
    if (abs >= 0.1) return 'weak';
    return 'none';
  }

  /**
   * 查找异常
   */
  private findAnomalies(data: Array<{ timestamp: Date; value: number }>): IAnomalyDetectionResult {
    const values = data.map(point => point.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / values.length,
    );

    const threshold = 2 * stdDev; // 使用2个标准差作为阈值
    const anomalies = data
      .filter(point => Math.abs(point.value - mean) > threshold)
      .map(point => ({
        timestamp: point.timestamp,
        value: point.value,
        score: Math.abs(point.value - mean) / stdDev,
        type: point.value > mean ? 'spike' : 'dip',
      }));

    return {
      anomalies,
      threshold: mean + threshold,
      modelConfidence: 0.95, // 简化的模型置信度
    };
  }

  /**
   * 计算预测
   */
  private calculatePredictions(
    data: Array<{ timestamp: Date; value: number }>,
    horizon: number,
  ): IPredictionResult {
    const values = data.map(point => point.value);
    const lastTimestamp = data[data.length - 1].timestamp.getTime();
    const interval = lastTimestamp - data[data.length - 2].timestamp.getTime();

    // 简单移动平均预测
    const windowSize = Math.min(values.length, 5);
    const lastValues = values.slice(-windowSize);
    const movingAverage = lastValues.reduce((a, b) => a + b, 0) / windowSize;

    const predictions = Array.from({ length: horizon }, (_, i) => ({
      timestamp: new Date(lastTimestamp + interval * (i + 1)),
      value: movingAverage,
      confidence: {
        lower: movingAverage * 0.9,
        upper: movingAverage * 1.1,
      },
    }));

    return {
      predictions,
      accuracy: 0.8, // 简化的准确度计算
      modelType: 'moving_average',
    };
  }
}
