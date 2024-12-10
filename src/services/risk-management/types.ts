// 健康风险类型
export interface HealthRisk {
  id: string;
  type: 'chronic' | 'acute' | 'lifestyle' | 'genetic';
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-1
  
  // 风险因素
  factors: Array<{
    name: string;
    weight: number;
    currentValue: number;
    threshold: {
      min?: number;
      max?: number;
      optimal: number;
    };
  }>;

  // 影响范围
  impacts: Array<{
    aspect: string;
    description: string;
    severity: number; // 1-10
  }>;

  // 预防建议
  preventions: Array<{
    action: string;
    priority: 'immediate' | 'short_term' | 'long_term';
    effectiveness: number; // 0-1
    difficulty: 'easy' | 'moderate' | 'hard';
  }>;

  // 监测指标
  monitoringMetrics: Array<{
    name: string;
    frequency: string;
    normalRange: {
      min: number;
      max: number;
    };
    unit: string;
  }>;
}

// 风险评估结果
export interface RiskAssessment {
  userId: string;
  timestamp: Date;
  
  // 总体风险评分
  overallScore: number; // 0-100
  
  // 具体风险项
  risks: HealthRisk[];
  
  // 关键指标
  keyMetrics: Array<{
    name: string;
    value: number;
    status: 'normal' | 'warning' | 'critical';
    trend: 'improving' | 'stable' | 'worsening';
  }>;

  // 建议行动
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    expectedImpact: string;
    timeframe: string;
  }>;

  // 历史趋势
  trends: Array<{
    metric: string;
    values: Array<{
      timestamp: Date;
      value: number;
    }>;
    analysis: string;
  }>;
}

// 风险预警配置
export interface RiskAlertConfig {
  // 预警阈值
  thresholds: {
    [metric: string]: {
      warning: number;
      critical: number;
    };
  };

  // 监测频率
  monitoringFrequency: {
    [riskType: string]: number; // 监测间隔(分钟)
  };

  // 通知设置
  notifications: {
    channels: string[];
    urgencyLevels: {
      [severity: string]: {
        methods: string[];
        delay: number;
      };
    };
  };
} 