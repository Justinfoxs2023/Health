/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 健康风险类型
export interface IHealthRisk {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: chronic  acute  lifestyle  genetic;
  name: string;
  description: string;
  severity: low  medium  high  critical;
  probability: number;  01

   
  factors: Array{
    name: string;
    weight: number;
    currentValue: number;
    threshold: {
      min: number;
      max: number;
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
export interface IRiskAssessment {
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;

   
  /** overallScore 的描述 */
    overallScore: number;  /** 0100 的描述 */
    /** 0100 的描述 */
    0100

   
  /** risks 的描述 */
    risks: IHealthRisk;

   
  /** keyMetrics 的描述 */
    keyMetrics: Array{
    name: string;
    value: number;
    status: normal  warning  critical;
    trend: improving  stable  worsening;
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
export interface IRiskAlertConfig {
   
  /** thresholds 的描述 */
    thresholds: {
    metric: string: {
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
