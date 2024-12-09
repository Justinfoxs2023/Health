// 健康数据类型
export interface HealthData {
  vitalSigns: VitalSigns;
  activities: Activity[];
  sleep: SleepData;
  nutrition: NutritionData;
  mentalHealth: MentalHealthData;
}

// 生命体征
export interface VitalSigns {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bloodOxygen: number;
  temperature: number;
  respiratoryRate: number;
  timestamp: Date;
}

// 风险评估
export interface RiskAssessment {
  overallRisk: RiskLevel;
  riskFactors: RiskFactor[];
  recommendations: Recommendation[];
  nextCheckDate: Date;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskFactor {
  type: string;
  level: RiskLevel;
  description: string;
  metrics: {
    current: number;
    threshold: number;
    unit: string;
  };
  trend: 'improving' | 'stable' | 'worsening';
}

// 健康建议
export interface Recommendation {
  category: 'exercise' | 'diet' | 'sleep' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actions: string[];
  expectedBenefits: string[];
}

// 异常检测
export interface Anomaly {
  metric: string;
  value: number;
  expectedRange: {
    min: number;
    max: number;
  };
  severity: RiskLevel;
  timestamp: Date;
  context?: string;
} 