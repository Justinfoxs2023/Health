/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 集成体验类型定义
export interface IntegratedExperience {
   
  /** analysis 的描述 */
    analysis: {
    predictiveHealth: {
      risks: Array{
        type: string;
        level: low  medium  high;
        factors: string;
      }>;
      trends: Array<{
        metric: string;
        direction: 'improving' | 'stable' | 'declining';
        significance: number;
      }>;
    };
    currentStatus: {
      vitalSigns: Record<string, number>;
      healthScore: number;
      concerns: string[];
    };
  };

  // 个性化推荐
  recommendations: {
    immediate: Array<{
      type: string;
      priority: 'high' | 'medium' | 'low';
      action: string;
      context: string;
    }>;
    longTerm: Array<{
      goal: string;
      steps: string[];
      timeline: string;
    }>;
  };

  // 社交活动
  socialActivities: {
    relevantCircles: Array<{
      id: string;
      name: string;
      matchScore: number;
      activeDiscussions: number;
    }>;
    upcomingEvents: Array<{
      id: string;
      type: string;
      title: string;
      relevance: number;
    }>;
    expertConnections: Array<{
      expertId: string;
      expertise: string[];
      relevanceScore: number;
    }>;
  };

  // 整合洞察
  integratedInsights: {
    primaryFocus: string[];
    supportNetwork: {
      type: string;
      strength: number;
      recommendations: string[];
    };
    progressMetrics: Array<{
      metric: string;
      current: number;
      target: number;
      socialSupport: number;
    }>;
    actionPlan: {
      personal: string[];
      social: string[];
      medical: string[];
    };
  };
}

// 集成上下文类型
export interface IntegrationContext {
  /** userId 的描述 */
    userId: string;
  /** healthProfile 的描述 */
    healthProfile: {
    conditions: string;
    medications: string;
    allergies: string;
    preferences: Recordstring, any;
  };
  /** socialContext 的描述 */
    socialContext: {
    circles: string[];
    connections: string[];
    activityLevel: number;
    preferences: Record<string, any>;
  };
  /** goals 的描述 */
    goals: Array<{
    id: string;
    type: string;
    priority: number;
    progress: number;
  }>;
}
