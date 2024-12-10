// 健康分析类型
export interface HealthAnalysis {
  userId: string;
  timestamp: Date;
  period: 'daily' | 'weekly' | 'monthly';
  metrics: HealthMetrics;
  trends: HealthTrend[];
  insights: HealthInsight[];
  recommendations: HealthRecommendation[];
}

// 健康指标
export interface HealthMetrics {
  vitalSigns: {
    heartRate: MetricData;
    bloodPressure: {
      systolic: MetricData;
      diastolic: MetricData;
    };
    bloodOxygen: MetricData;
    temperature: MetricData;
    respiratoryRate: MetricData;
  };
  bodyComposition: {
    weight: MetricData;
    bmi: MetricData;
    bodyFat: MetricData;
    muscleMass: MetricData;
  };
  sleep: {
    duration: MetricData;
    quality: MetricData;
    cycles: MetricData;
  };
  activity: {
    steps: MetricData;
    distance: MetricData;
    calories: MetricData;
    activeMinutes: MetricData;
  };
}

// 指标数据
export interface MetricData {
  value: number;
  unit: string;
  range: {
    min: number;
    max: number;
  };
  trend: 'improving' | 'stable' | 'worsening';
  percentile?: number;
}

// 健康趋势
export interface HealthTrend {
  metric: string;
  period: string;
  data: TrendPoint[];
  analysis: {
    pattern: string;
    significance: number;
    factors: string[];
  };
}

// 健康洞察
export interface HealthInsight {
  type: InsightType;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'alert';
  evidence: Evidence[];
  actions: RecommendedAction[];
}

// 健康建议
export interface HealthRecommendation {
  category: 'lifestyle' | 'diet' | 'exercise' | 'sleep' | 'medical';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  benefits: string[];
  steps: ActionStep[];
  timeline: string;
  reminders?: ReminderConfig;
} 