/**
 * @fileoverview TS 文件 analysis.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 健康分析类型
export interface IHealthAnalysis {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** period 的描述 */
  period: 'daily' | 'weekly' | 'monthly';
  /** metrics 的描述 */
  metrics: IHealthMetrics;
  /** trends 的描述 */
  trends: IHealthTrend[];
  /** insights 的描述 */
  insights: IHealthInsight[];
  /** recommendations 的描述 */
  recommendations: IHealthRecommendation[];
}

// 健康指标
export interface IHealthMetrics {
  /** vitalSigns 的描述 */
  vitalSigns: {
    heartRate: IMetricData;
    bloodPressure: {
      systolic: IMetricData;
      diastolic: IMetricData;
    };
    bloodOxygen: IMetricData;
    temperature: IMetricData;
    respiratoryRate: IMetricData;
  };
  /** bodyComposition 的描述 */
  bodyComposition: {
    weight: IMetricData;
    bmi: IMetricData;
    bodyFat: IMetricData;
    muscleMass: IMetricData;
  };
  /** sleep 的描述 */
  sleep: {
    duration: IMetricData;
    quality: IMetricData;
    cycles: IMetricData;
  };
  /** activity 的描述 */
  activity: {
    steps: IMetricData;
    distance: IMetricData;
    calories: IMetricData;
    activeMinutes: IMetricData;
  };
}

// 指标数据
export interface IMetricData {
  /** value 的描述 */
  value: number;
  /** unit 的描述 */
  unit: string;
  /** range 的描述 */
  range: {
    min: number;
    max: number;
  };
  /** trend 的描述 */
  trend: 'improving' | 'stable' | 'worsening';
  /** percentile 的描述 */
  percentile?: number;
}

// 健康趋势
export interface IHealthTrend {
  /** metric 的描述 */
  metric: string;
  /** period 的描述 */
  period: string;
  /** data 的描述 */
  data: TrendPoint[];
  /** analysis 的描述 */
  analysis: {
    pattern: string;
    significance: number;
    factors: string[];
  };
}

// 健康洞察
export interface IHealthInsight {
  /** type 的描述 */
  type: InsightType;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** severity 的描述 */
  severity: 'info' | 'warning' | 'alert';
  /** evidence 的描述 */
  evidence: Evidence[];
  /** actions 的描述 */
  actions: RecommendedAction[];
}

// 健康建议
export interface IHealthRecommendation {
  /** category 的描述 */
  category: 'lifestyle' | 'diet' | 'exercise' | 'sleep' | 'medical';
  /** priority 的描述 */
  priority: 'high' | 'medium' | 'low';
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** benefits 的描述 */
  benefits: string[];
  /** steps 的描述 */
  steps: ActionStep[];
  /** timeline 的描述 */
  timeline: string;
  /** reminders 的描述 */
  reminders?: ReminderConfig;
}
