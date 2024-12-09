// 综合健康状况
export interface HealthStatus {
  physical: {
    bmi: number;
    bodyComposition: BodyComposition;
    vitals: VitalSigns;
    fitness: FitnessMetrics;
  };
  nutrition: {
    dietQuality: number;
    nutrientBalance: NutrientBalance;
    mealPatterns: MealPattern[];
  };
  lifestyle: {
    sleepQuality: number;
    activityLevel: number;
    stressLevel: number;
    workLifeBalance: number;
  };
  trends: {
    weightTrend: TrendData;
    healthScoreTrend: TrendData;
    nutritionTrend: TrendData;
  };
  risks: HealthRisk[];
}

// 健康建议
export interface HealthRecommendation {
  category: RecommendationCategory;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  actions: ActionItem[];
  expectedOutcomes: string[];
  timeframe: string;
  evidence: Evidence[];
}

// 健康目标
export interface HealthGoal {
  type: GoalType;
  target: any;
  currentValue: any;
  progress: number;
  startDate: Date;
  targetDate: Date;
  milestones: Milestone[];
  adjustments: GoalAdjustment[];
}

// 健康报告
export interface HealthReport {
  period: 'daily' | 'weekly' | 'monthly';
  summary: {
    overallScore: number;
    keyFindings: string[];
    improvements: string[];
    concerns: string[];
  };
  details: {
    status: HealthStatus;
    goals: HealthGoal[];
    recommendations: HealthRecommendation[];
  };
  analysis: {
    trends: TrendAnalysis[];
    correlations: Correlation[];
    insights: Insight[];
  };
} 