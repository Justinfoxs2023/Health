import { HealthData, HealthMetric } from '../../types';

/** 统计时间范围类型 */
export type StatTimeRange = 'day' | 'week' | 'month' | 'year' | 'custom';

/** 统计数据类型 */
export interface StatisticsData {
  /** 时间范围 */
  timeRange: StatTimeRange;
  /** 数据总数 */
  totalCount: number;
  /** 平均值 */
  average: number;
  /** 最大值 */
  max: number;
  /** 最小值 */
  min: number;
  /** 标准差 */
  standardDeviation: number;
  /** 趋势数据 */
  trend: {
    time: Date;
    value: number;
  }[];
  /** 异常数据点 */
  anomalies: {
    time: Date;
    value: number;
    reason: string;
  }[];
}

/** 报告类型 */
export interface HealthReport {
  /** 报告ID */
  id: string;
  /** 生成时间 */
  generatedAt: Date;
  /** 报告类型 */
  type: 'daily' | 'weekly' | 'monthly' | 'annual';
  /** 统计数据 */
  statistics: Record<HealthMetric, StatisticsData>;
  /** 健康建议 */
  recommendations: string[];
  /** 风险提示 */
  risks: {
    level: 'low' | 'medium' | 'high';
    description: string;
  }[];
}

/** 数据统计服务 */
class DataStatisticsService {
  /** 计算指定时间范围内的统计数据 */
  calculateStatistics(
    data: HealthData[],
    metric: HealthMetric,
    timeRange: StatTimeRange,
    startDate?: Date,
    endDate?: Date
  ): StatisticsData {
    // 根据时间范围筛选数据
    const filteredData = this.filterDataByTimeRange(
      data,
      timeRange,
      startDate,
      endDate
    );

    // 提取指定指标的数值
    const values = filteredData.map(d => d[metric] as number);

    return {
      timeRange,
      totalCount: values.length,
      average: this.calculateAverage(values),
      max: Math.max(...values),
      min: Math.min(...values),
      standardDeviation: this.calculateStandardDeviation(values),
      trend: this.calculateTrend(filteredData, metric),
      anomalies: this.detectAnomalies(filteredData, metric)
    };
  }

  /** 生成健康报告 */
  generateReport(
    data: HealthData[],
    type: HealthReport['type']
  ): HealthReport {
    const metrics = Object.values(HealthMetric);
    const statistics: Record<HealthMetric, StatisticsData> = {} as Record<
      HealthMetric,
      StatisticsData
    >;

    // 计算每个指标的统计数据
    metrics.forEach(metric => {
      statistics[metric] = this.calculateStatistics(data, metric, type);
    });

    return {
      id: this.generateReportId(),
      generatedAt: new Date(),
      type,
      statistics,
      recommendations: this.generateRecommendations(statistics),
      risks: this.assessRisks(statistics)
    };
  }

  /** 根据时间范围筛选数据 */
  private filterDataByTimeRange(
    data: HealthData[],
    timeRange: StatTimeRange,
    startDate?: Date,
    endDate?: Date
  ): HealthData[] {
    const now = new Date();
    let start: Date;

    switch (timeRange) {
      case 'day':
        start = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        start = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        start = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        start = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'custom':
        if (!startDate || !endDate) {
          throw new Error('Custom time range requires start and end dates');
        }
        return data.filter(
          d => d.timestamp >= startDate && d.timestamp <= endDate
        );
      default:
        return data;
    }

    return data.filter(d => d.timestamp >= start);
  }

  /** 计算平均值 */
  private calculateAverage(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /** 计算标准差 */
  private calculateStandardDeviation(values: number[]): number {
    const avg = this.calculateAverage(values);
    const squareDiffs = values.map(value => {
      const diff = value - avg;
      return diff * diff;
    });
    const avgSquareDiff = this.calculateAverage(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  /** 计算趋势数据 */
  private calculateTrend(
    data: HealthData[],
    metric: HealthMetric
  ): StatisticsData['trend'] {
    return data.map(d => ({
      time: d.timestamp,
      value: d[metric] as number
    }));
  }

  /** 检测异常数据点 */
  private detectAnomalies(
    data: HealthData[],
    metric: HealthMetric
  ): StatisticsData['anomalies'] {
    const values = data.map(d => d[metric] as number);
    const avg = this.calculateAverage(values);
    const stdDev = this.calculateStandardDeviation(values);
    const threshold = stdDev * 2; // 使用2个标准差作为异常阈值

    return data
      .filter(d => Math.abs((d[metric] as number) - avg) > threshold)
      .map(d => ({
        time: d.timestamp,
        value: d[metric] as number,
        reason: `Value deviates significantly from average (${avg.toFixed(2)})`
      }));
  }

  /** 生成报告ID */
  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /** 生成健康建议 */
  private generateRecommendations(
    statistics: Record<HealthMetric, StatisticsData>
  ): string[] {
    const recommendations: string[] = [];

    // 基于统计数据生成建议
    Object.entries(statistics).forEach(([metric, stat]) => {
      if (stat.anomalies.length > 0) {
        recommendations.push(
          `注意${metric}指标的异常波动，建议进行进一步检查。`
        );
      }
      // 可以添加更多基于不同指标的具体建议
    });

    return recommendations;
  }

  /** 评估健康风险 */
  private assessRisks(
    statistics: Record<HealthMetric, StatisticsData>
  ): HealthReport['risks'] {
    const risks: HealthReport['risks'] = [];

    // 基于统计数据评估风险
    Object.entries(statistics).forEach(([metric, stat]) => {
      const anomalyRate = stat.anomalies.length / stat.totalCount;

      if (anomalyRate > 0.1) {
        risks.push({
          level: 'high',
          description: `${metric}指标异常率超过10%，建议及时就医。`
        });
      } else if (anomalyRate > 0.05) {
        risks.push({
          level: 'medium',
          description: `${metric}指标出现少量异常，建议密切关注。`
        });
      }
    });

    return risks;
  }
}

export const dataStatisticsService = new DataStatisticsService(); 