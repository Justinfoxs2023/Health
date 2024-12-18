/**
 * @fileoverview TS 文件 assessment.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

/**
 * 评估结果接口
 */
export interface IAssessmentResult {
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** assessmentType 的描述 */
  assessmentType: 'vital-signs' | 'lifestyle' | 'comprehensive';
  /** scores 的描述 */
  scores: {
    overall: number;
    categories: {
      [key: string]: number;
    };
  };
  /** patterns 的描述 */
  patterns?: {
    [key: string]: {
      type: string;
      frequency: string;
      significance: number;
      description: string;
    };
  };
  /** recommendations 的描述 */
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    reason: string;
    expectedBenefits: string[];
  }>;
  /** alerts 的描述 */
  alerts?: Array<{
    type: 'warning' | 'critical';
    message: string;
    metric: string;
    value: number;
    threshold: number;
  }>;
  /** metadata 的描述 */
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
  /** thresholds 的描述 */
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
  /** weights 的描述 */
  weights: {
    [key: string]: number;
  };
  /** recommendations 的描述 */
  recommendations: {
    maxCount: number;
    categories: string[];
  };
  /** patterns 的描述 */
  patterns: {
    minSignificance: number;
    timeRanges: string[];
  };
}
