// 集成体验类型定义
export interface IntegratedExperience {
  // 健康分析结果
  analysis: {
    predictiveHealth: {
      risks: Array<{
        type: string;
        level: 'low' | 'medium' | 'high';
        factors: string[];
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
  userId: string;
  healthProfile: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    preferences: Record<string, any>;
  };
  socialContext: {
    circles: string[];
    connections: string[];
    activityLevel: number;
    preferences: Record<string, any>;
  };
  goals: Array<{
    id: string;
    type: string;
    priority: number;
    progress: number;
  }>;
} 