/**
 * 评估结果接口
 */
export interface IAssessmentResult {
  userId: string;
  timestamp: Date;
  assessmentType: 'vital-signs' | 'lifestyle' | 'comprehensive';
  scores: {
    overall: number;
    categories: {
      [key: string]: number;
    };
  };
  patterns?: {
    [key: string]: {
      type: string;
      frequency: string;
      significance: number;
      description: string;
    };
  };
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    reason: string;
    expectedBenefits: string[];
  }>;
  alerts?: Array<{
    type: 'warning' | 'critical';
    message: string;
    metric: string;
    value: number;
    threshold: number;
  }>;
  metadata: {
    modelVersion: string;
    confidenceScores: {
      [key: string]: number;
    };
    dataQuality: {
      featureNames: string[];
      normalizedRanges: {
        [key: string]: {
          min: number;
          max: number;
        };
      };
    };
  };
}

/**
 * 评估配置接口
 */
export interface IAssessmentConfig {
  thresholds: {
    [key: string]: {
      warning: {
        min?: number;
        max?: number;
      };
      critical: {
        min?: number;
        max?: number;
      };
    };
  };
  weights: {
    [key: string]: number;
  };
  recommendations: {
    maxCount: number;
    categories: string[];
  };
  patterns: {
    minSignificance: number;
    timeRanges: string[];
  };
} 