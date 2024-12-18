import {
  HealthData,
  AnalysisResult,
  HealthTrend,
  RiskLevel,
  HealthMetric,
  Recommendation,
} from '../types/health.types';
import { AIService } from '../ai/AIService';
import { CacheService } from '../cache/CacheService';
import { DatabaseService } from '../database/DatabaseService';
import { Logger } from '../logger/Logger';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import { injectable, inject } from 'inversify';

@inject
able()
export class MonitoringAnalysisService {
  constructor(
    @inject() private readonly logger: Logger,
    @inject() private readonly metrics: MetricsCollector,
    @inject() private readonly cache: CacheService,
    @inject() private readonly db: DatabaseService,
    @inject() private readonly ai: AIService,
  ) {}

  /**
   * 分析健康数据
   */
  public async analyzeHealthData(userId: string, data: HealthData): Promise<AnalysisResult> {
    const timer = this.metrics.startTimer('health_data_analysis');
    try {
      // 获取历史数据
      const historicalData = await this.getHistoricalData(userId);

      // 数据预处理
      const processedData = await this.preprocessData(data, historicalData);

      // 趋势分析
      const trends = await this.analyzeTrends(processedData);

      // 风险评估
      const risks = await this.assessRisks(processedData, trends);

      // 生成建议
      const recommendations = await this.generateRecommendations(processedData, trends, risks);

      // 保存分析结果
      const result = {
        userId,
        timestamp: Date.now(),
        trends,
        risks,
        recommendations,
      };

      await this.saveAnalysisResult(result);

      this.metrics.increment('analysis_success');
      return result;
    } catch (error) {
      this.logger.error('健康数据分析失败', error as Error);
      this.metrics.increment('analysis_error');
      throw error;
    } finally {
      timer.end();
    }
  }

  /**
   * 获取历史数据
   */
  private async getHistoricalData(userId: string): Promise<HealthData[]> {
    const cacheKey = `historical_health_${userId}`;
    let historicalData = await this.cache.get(cacheKey);

    if (!historicalData) {
      historicalData = await this.db.query(
        'SELECT * FROM health_data WHERE user_id = ? ORDER BY timestamp DESC LIMIT 30',
        [userId],
      );
      await this.cache.set(cacheKey, historicalData, 3600); // 缓存1小时
    }

    return historicalData;
  }

  /**
   * 数据预处理
   */
  private async preprocessData(
    currentData: HealthData,
    historicalData: HealthData[],
  ): Promise<HealthData[]> {
    const allData = [currentData, ...historicalData];

    // 数据标准化
    const normalizedData = this.normalizeData(allData);

    // 去除异常值
    const cleanedData = this.removeOutliers(normalizedData);

    // 数据补全
    const completedData = await this.fillMissingData(cleanedData);

    return completedData;
  }

  /**
   * 数据标准化
   */
  private normalizeData(data: HealthData[]): HealthData[] {
    return data.map(item => {
      const normalized = { ...item };

      // 标准化各项指标
      Object.keys(item.metrics).forEach(key => {
        const metric = item.metrics[key];
        if (typeof metric === 'number') {
          normalized.metrics[key] = this.normalizeMetric(key, metric);
        }
      });

      return normalized;
    });
  }

  /**
   * 标准化单个指标
   */
  private normalizeMetric(metricType: string, value: number): number {
    const ranges = {
      heartRate: { min: 60, max: 100 },
      bloodPressureSystolic: { min: 90, max: 120 },
      bloodPressureDiastolic: { min: 60, max: 80 },
      bloodSugar: { min: 70, max: 100 },
      temperature: { min: 36.3, max: 37.2 },
    };

    const range = ranges[metricType];
    if (!range) return value;

    return (value - range.min) / (range.max - range.min);
  }

  /**
   * 移除异常值
   */
  private removeOutliers(data: HealthData[]): HealthData[] {
    return data.map(item => {
      const cleaned = { ...item };

      Object.keys(item.metrics).forEach(key => {
        const metric = item.metrics[key];
        if (typeof metric === 'number') {
          if (this.isOutlier(key, metric)) {
            cleaned.metrics[key] = this.interpolateValue(data, key, item.timestamp);
          }
        }
      });

      return cleaned;
    });
  }

  /**
   * 检测异常值
   */
  private isOutlier(metricType: string, value: number): boolean {
    const thresholds = {
      heartRate: { min: 40, max: 180 },
      bloodPressureSystolic: { min: 70, max: 200 },
      bloodPressureDiastolic: { min: 40, max: 130 },
      bloodSugar: { min: 50, max: 300 },
      temperature: { min: 35, max: 42 },
    };

    const threshold = thresholds[metricType];
    if (!threshold) return false;

    return value < threshold.min || value > threshold.max;
  }

  /**
   * 插值计算
   */
  private interpolateValue(data: HealthData[], metricType: string, timestamp: number): number {
    const validValues = data
      .filter(item => !this.isOutlier(metricType, item.metrics[metricType]))
      .map(item => ({
        value: item.metrics[metricType],
        timestamp: item.timestamp,
      }))
      .sort((a, b) => Math.abs(a.timestamp - timestamp) - Math.abs(b.timestamp - timestamp));

    if (validValues.length === 0) return 0;
    if (validValues.length === 1) return validValues[0].value;

    // 使用距离加权平均
    const [closest1, closest2] = validValues;
    const weight1 = 1 / Math.abs(closest1.timestamp - timestamp);
    const weight2 = 1 / Math.abs(closest2.timestamp - timestamp);

    return (closest1.value * weight1 + closest2.value * weight2) / (weight1 + weight2);
  }

  /**
   * 补全缺失数据
   */
  private async fillMissingData(data: HealthData[]): Promise<HealthData[]> {
    return Promise.all(
      data.map(async item => {
        const completed = { ...item };

        for (const metricType of Object.keys(HealthMetric)) {
          if (completed.metrics[metricType] === undefined) {
            completed.metrics[metricType] = this.interpolateValue(data, metricType, item.timestamp);
          }
        }

        return completed;
      }),
    );
  }

  /**
   * 分析健康趋势
   */
  private async analyzeTrends(data: HealthData[]): Promise<HealthTrend[]> {
    const trends: HealthTrend[] = [];

    // 分析各项指标趋势
    for (const metricType of Object.keys(HealthMetric)) {
      const metricTrend = await this.analyzeMetricTrend(data, metricType);
      if (metricTrend) {
        trends.push(metricTrend);
      }
    }

    return trends;
  }

  /**
   * 分析单个指标趋势
   */
  private async analyzeMetricTrend(
    data: HealthData[],
    metricType: string,
  ): Promise<HealthTrend | null> {
    const values = data
      .map(item => ({
        value: item.metrics[metricType],
        timestamp: item.timestamp,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    if (values.length < 2) return null;

    // 计算变化率
    const changes = [];
    for (let i = 1; i < values.length; i++) {
      const timeDiff = (values[i].timestamp - values[i - 1].timestamp) / (24 * 60 * 60 * 1000); // 转换为天
      const valueDiff = values[i].value - values[i - 1].value;
      changes.push(valueDiff / timeDiff);
    }

    // 使用AI分析趋势
    const trendAnalysis = await this.ai.analyzeTrend(changes);

    return {
      metricType,
      direction: trendAnalysis.direction,
      magnitude: trendAnalysis.magnitude,
      confidence: trendAnalysis.confidence,
      period: {
        start: values[0].timestamp,
        end: values[values.length - 1].timestamp,
      },
    };
  }

  /**
   * 评估健康风险
   */
  private async assessRisks(data: HealthData[], trends: HealthTrend[]): Promise<RiskLevel[]> {
    const risks: RiskLevel[] = [];

    // 评估各项指标风险
    for (const metricType of Object.keys(HealthMetric)) {
      const risk = await this.assessMetricRisk(data, trends, metricType);
      risks.push(risk);
    }

    // 评估综合风险
    const overallRisk = await this.assessOverallRisk(risks);
    risks.push(overallRisk);

    return risks;
  }

  /**
   * 评估单个指标风险
   */
  private async assessMetricRisk(
    data: HealthData[],
    trends: HealthTrend[],
    metricType: string,
  ): Promise<RiskLevel> {
    const metricData = data.map(item => item.metrics[metricType]);
    const metricTrend = trends.find(t => t.metricType === metricType);

    // 使用AI评估风险
    const riskAnalysis = await this.ai.assessRisk({
      metricType,
      currentValue: metricData[0],
      historicalValues: metricData.slice(1),
      trend: metricTrend,
    });

    return {
      type: metricType,
      level: riskAnalysis.level,
      factors: riskAnalysis.factors,
      confidence: riskAnalysis.confidence,
    };
  }

  /**
   * 评估综合风险
   */
  private async assessOverallRisk(risks: RiskLevel[]): Promise<RiskLevel> {
    // 使用AI评估综合风险
    const overallRiskAnalysis = await this.ai.assessOverallRisk(risks);

    return {
      type: 'overall',
      level: overallRiskAnalysis.level,
      factors: overallRiskAnalysis.factors,
      confidence: overallRiskAnalysis.confidence,
    };
  }

  /**
   * 生成健康建议
   */
  private async generateRecommendations(
    data: HealthData[],
    trends: HealthTrend[],
    risks: RiskLevel[],
  ): Promise<Recommendation[]> {
    // 使用AI生成建议
    const recommendations = await this.ai.generateRecommendations({
      currentData: data[0],
      historicalData: data.slice(1),
      trends,
      risks,
    });

    // 对建议进行优先级排序
    return this.prioritizeRecommendations(recommendations);
  }

  /**
   * 对建议进行优先级排序
   */
  private prioritizeRecommendations(recommendations: Recommendation[]): Recommendation[] {
    return recommendations.sort((a, b) => {
      // 首先按风险等级排序
      if (a.riskLevel !== b.riskLevel) {
        return b.riskLevel - a.riskLevel;
      }

      // 其次按紧急程度排序
      if (a.urgency !== b.urgency) {
        return b.urgency - a.urgency;
      }

      // 最后按可行性排序
      return b.feasibility - a.feasibility;
    });
  }

  /**
   * 保存分析结果
   */
  private async saveAnalysisResult(result: AnalysisResult): Promise<void> {
    try {
      // 保存到数据库
      await this.db.insert('health_analysis_results', result);

      // 更新缓存
      const cacheKey = `analysis_result_${result.userId}`;
      await this.cache.set(cacheKey, result, 3600); // 缓存1小时

      this.metrics.increment('analysis_result_saved');
    } catch (error) {
      this.logger.error('保存分析结果失败', error as Error);
      this.metrics.increment('analysis_result_save_error');
      throw error;
    }
  }
}
