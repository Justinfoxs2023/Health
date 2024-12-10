// 基础健康数据类型
export interface BaseHealthData {
  id: string;
  userId: string;
  timestamp: Date;
  source: 'user' | 'device' | 'professional' | 'ai';
  reliability: number; // 数据可靠性评分
  verified: boolean;
}

// 生命体征数据
export interface VitalSignsData extends BaseHealthData {
  bloodPressure: {
    systolic: number;
    diastolic: number;
    meanArterial?: number;
  };
  heartRate: {
    value: number;
    rhythm: 'regular' | 'irregular';
    variability?: number;
  };
  bodyTemperature: number;
  respiratoryRate: number;
  bloodOxygen: number;
  bloodGlucose?: number;
}

// 症状记录
export interface SymptomRecord extends BaseHealthData {
  type: string;
  severity: 1 | 2 | 3 | 4 | 5;
  duration: number; // 持续时间(分钟)
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant';
  triggers?: string[];
  accompaniedBy?: string[];
  relievedBy?: string[];
  impact: 'none' | 'mild' | 'moderate' | 'severe';
}

// 检测结果
export interface TestResult extends BaseHealthData {
  type: string;
  category: 'blood' | 'imaging' | 'physical' | 'genetic' | 'other';
  values: Record<string, number | string>;
  referenceRanges: Record<string, [number, number]>;
  interpretation: {
    summary: string;
    abnormalities: string[];
    recommendations: string[];
  };
  provider: {
    name: string;
    qualification: string;
    institution: string;
  };
} 