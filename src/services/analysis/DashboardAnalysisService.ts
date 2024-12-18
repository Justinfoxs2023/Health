import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MetricsService } from '../monitoring/metrics.service';

interface IAnalysisConfig {
  /** type 的描述 */
    type: trend  correlation  anomaly  forecast;
  metrics: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  parameters?: any;
}

interface IAnalysisResult {
  /** type 的描述 */
    type: string;
  /** data 的描述 */
    data: any;
  /** metadata 的描述 */
    metadata: {
    startTime: Date;
    endTime: Date;
    metrics: string;
    parameters: any;
  };
}

@Injectable()
export class DashboardAnalysisService {
  constructor(
    private readonly config: ConfigService,
    private readonly metrics: MetricsService,
    private readonly logger: Logger,
  ) {}

  // 执行数据分析
  async analyzeData(config: IAnalysisConfig): Promise<IAnalysisResult> {
    try {
      let result: any;

      switch (config.type) {
        case 'trend':
          result = await this.analyzeTrend(config);
          break;
        case 'correlation':
          result = await this.analyzeCorrelation(config);
          break;
        case 'anomaly':
          result = await this.detectAnomalies(config);
          break;
        case 'forecast':
          result = await this.generateForecast(config);
          break;
        default:
          throw new Error(`不支持的分析类型: ${config.type}`);
      }

      return {
        type: config.type,
        data: result,
        metadata: {
          startTime: config.timeRange.start,
          endTime: config.timeRange.end,
          metrics: config.metrics,
          parameters: config.parameters,
        },
      };
    } catch (error) {
      this.logger.error('数据分析失败', error);
      throw error;
    }
  }

  // 趋势分析
  private async analyzeTrend(config: IAnalysisConfig): Promise<any> {
    try {
      const data = await this.getMetricsData(config);

      // 计算趋势
      const trends = {};
      for (const metric of config.metrics) {
        const values = data[metric];
        trends[metric] = {
          direction: this.calculateTrendDirection(values),
          slope: this.calculateTrendSlope(values),
          confidence: this.calculateConfidence(values),
        };
      }

      return {
        trends,
        summary: this.generateTrendSummary(trends),
      };
    } catch (error) {
      this.logger.error('趋势分析失败', error);
      throw error;
    }
  }

  // 相关性分析
  private async analyzeCorrelation(config: IAnalysisConfig): Promise<any> {
    try {
      const data = await this.getMetricsData(config);

      // 计算相关性矩阵
      const correlations = {};
      for (let i = 0; i < config.metrics.length; i++) {
        const metric1 = config.metrics[i];
        correlations[metric1] = {};

        for (let j = i + 1; j < config.metrics.length; j++) {
          const metric2 = config.metrics[j];
          correlations[metric1][metric2] = this.calculateCorrelation(data[metric1], data[metric2]);
        }
      }

      return {
        correlations,
        summary: this.generateCorrelationSummary(correlations),
      };
    } catch (error) {
      this.logger.error('相关性分析失败', error);
      throw error;
    }
  }

  // 异常检测
  private async detectAnomalies(config: IAnalysisConfig): Promise<any> {
    try {
      const data = await this.getMetricsData(config);

      // 检测异常
      const anomalies = {};
      for (const metric of config.metrics) {
        const values = data[metric];
        anomalies[metric] = {
          points: this.findAnomalies(values),
          statistics: this.calculateAnomalyStatistics(values),
        };
      }

      return {
        anomalies,
        summary: this.generateAnomalySummary(anomalies),
      };
    } catch (error) {
      this.logger.error('异常检测失败', error);
      throw error;
    }
  }

  // 预测分析
  private async generateForecast(config: IAnalysisConfig): Promise<any> {
    try {
      const data = await this.getMetricsData(config);

      // 生成预测
      const forecasts = {};
      for (const metric of config.metrics) {
        const values = data[metric];
        forecasts[metric] = {
          predictions: this.predictValues(values, config.parameters?.horizon || 24),
          confidence: this.calculateForecastConfidence(values),
        };
      }

      return {
        forecasts,
        summary: this.generateForecastSummary(forecasts),
      };
    } catch (error) {
      this.logger.error('预测分析失败', error);
      throw error;
    }
  }

  // 获取指标数据
  private async getMetricsData(config: IAnalysisConfig): Promise<any> {
    const data = {};
    for (const metric of config.metrics) {
      data[metric] = await this.metrics.getMetricHistory(
        metric,
        config.timeRange.start,
        config.timeRange.end,
      );
    }
    return data;
  }

  // 计算趋势方向
  private calculateTrendDirection(values: number[]): string {
    if (values.length < 2) return 'stable';

    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;

    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
  }

  // 计算趋势斜率
  private calculateTrendSlope(values: number[]): number {
    if (values.length < 2) return 0;

    // 使用简单线性回归
    const n = values.length;
    const xSum = ((n - 1) * n) / 2;
    const ySum = values.reduce((a, b) => a + b, 0);
    const xySum = values.reduce((sum, y, x) => sum + x * y, 0);
    const x2Sum = ((n - 1) * n * (2 * n - 1)) / 6;

    return (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
  }

  // 计算置信度
  private calculateConfidence(values: number[]): number {
    if (values.length < 2) return 0;

    // 使用R平方值作为置信度
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const totalSS = values.reduce((ss, v) => ss + Math.pow(v - mean, 2), 0);
    const slope = this.calculateTrendSlope(values);
    const intercept = mean - (slope * (values.length - 1)) / 2;
    const regressionSS = values.reduce((ss, v, i) => {
      const predicted = slope * i + intercept;
      return ss + Math.pow(predicted - mean, 2);
    }, 0);

    return regressionSS / totalSS;
  }

  // 计算相关性
  private calculateCorrelation(values1: number[], values2: number[]): number {
    if (values1.length !== values2.length || values1.length < 2) return 0;

    const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
    const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;

    const variance1 = values1.reduce((v, x) => v + Math.pow(x - mean1, 2), 0);
    const variance2 = values2.reduce((v, x) => v + Math.pow(x - mean2, 2), 0);

    const covariance = values1.reduce((c, x, i) => c + (x - mean1) * (values2[i] - mean2), 0);

    return covariance / Math.sqrt(variance1 * variance2);
  }

  // 查找异常点
  private findAnomalies(values: number[]): number[] {
    if (values.length < 2) return [];

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((v, x) => v + Math.pow(x - mean, 2), 0) / values.length);

    // 使用Z分数方法检测异常
    const threshold = 3; // 3个标准差
    return values.reduce((anomalies, value, index) => {
      const zScore = Math.abs((value - mean) / stdDev);
      if (zScore > threshold) {
        anomalies.push(index);
      }
      return anomalies;
    }, []);
  }

  // 计算异常统计
  private calculateAnomalyStatistics(values: number[]): any {
    const anomalies = this.findAnomalies(values);
    return {
      count: anomalies.length,
      percentage: (anomalies.length / values.length) * 100,
      severity: this.calculateAnomalySeverity(values, anomalies),
    };
  }

  // 计算异常严重程度
  private calculateAnomalySeverity(values: number[], anomalies: number[]): string {
    const percentage = (anomalies.length / values.length) * 100;
    if (percentage > 10) return 'high';
    if (percentage > 5) return 'medium';
    return 'low';
  }

  // 预测值
  private predictValues(values: number[], horizon: number): number[] {
    if (values.length < 2) return [];

    // 使用简单移动平均预测
    const windowSize = Math.min(24, Math.floor(values.length / 2));
    const lastValues = values.slice(-windowSize);
    const mean = lastValues.reduce((a, b) => a + b, 0) / windowSize;
    const trend = this.calculateTrendSlope(lastValues);

    return Array(horizon)
      .fill(0)
      .map((_, i) => mean + trend * (i + 1));
  }

  // 计算预测置信度
  private calculateForecastConfidence(values: number[]): number {
    if (values.length < 2) return 0;

    // 使用预测误差的标准差计算置信度
    const predictions = this.predictValues(values.slice(0, -1), 1);
    const actual = values[values.length - 1];
    const error = Math.abs((predictions[0] - actual) / actual);
    return Math.max(0, 1 - error);
  }

  // 生成趋势摘要
  private generateTrendSummary(trends: any): string {
    const directions = Object.values(trends).map(t => t.direction);
    const increasing = directions.filter(d => d === 'increasing').length;
    const decreasing = directions.filter(d => d === 'decreasing').length;
    const stable = directions.filter(d => d === 'stable').length;

    return `${increasing} 个指标上升, ${decreasing} 个指标下降, ${stable} 个指标稳定`;
  }

  // 生成相关性摘要
  private generateCorrelationSummary(correlations: any): string {
    let strongPositive = 0;
    let strongNegative = 0;
    let weak = 0;

    Object.values(correlations).forEach((metrics: any) => {
      Object.values(metrics).forEach((correlation: number) => {
        if (correlation > 0.7) strongPositive++;
        else if (correlation < -0.7) strongNegative++;
        else weak++;
      });
    });

    return `${strongPositive} 个强正相关, ${strongNegative} 个强负相关, ${weak} 个弱相关`;
  }

  // 生成异常摘要
  private generateAnomalySummary(anomalies: any): string {
    const metrics = Object.keys(anomalies).length;
    const totalAnomalies = Object.values(anomalies).reduce(
      (sum: number, a: any) => sum + a.points.length,
      0,
    );
    const severeMetrics = Object.values(anomalies).filter(
      (a: any) => a.statistics.severity === 'high',
    ).length;

    return `在 ${metrics} 个指标中发现 ${totalAnomalies} 个异常点, ${severeMetrics} 个指标异常严重`;
  }

  // 生成预测摘要
  private generateForecastSummary(forecasts: any): string {
    const metrics = Object.keys(forecasts).length;
    const highConfidence = Object.values(forecasts).filter((f: any) => f.confidence > 0.8).length;

    return `对 ${metrics} 个指标进行预测, 其中 ${highConfidence} 个预测具有高置信度`;
  }
}
