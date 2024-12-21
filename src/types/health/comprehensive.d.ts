/**
 * @fileoverview TS 文件 comprehensive.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 综合健康状况
export interface IHealthStatus {
  /** physical 的描述 */
    physical: {
    bmi: number;
    bodyComposition: BodyComposition;
    vitals: VitalSigns;
    fitness: FitnessMetrics;
  };
  /** nutrition 的描述 */
    nutrition: {
    dietQuality: number;
    nutrientBalance: NutrientBalance;
    mealPatterns: MealPattern[];
  };
  /** lifestyle 的描述 */
    lifestyle: {
    sleepQuality: number;
    activityLevel: number;
    stressLevel: number;
    workLifeBalance: number;
  };
  /** trends 的描述 */
    trends: {
    weightTrend: TrendData;
    healthScoreTrend: TrendData;
    nutritionTrend: TrendData;
  };
  /** risks 的描述 */
    risks: HealthRisk[];
}

// 健康建议
export interface IHealthRecommendation {
  /** category 的描述 */
    category: RecommendationCategory;
  /** priority 的描述 */
    priority: high  medium  low;
  title: string;
  description: string;
  rationale: string;
  actions: ActionItem;
  expectedOutcomes: string;
  timeframe: string;
  evidence: Evidence;
}

// 健康目标
export interface IHealthGoal {
  /** type 的描述 */
    type: GoalType;
  /** target 的描述 */
    target: any;
  /** currentValue 的描述 */
    currentValue: any;
  /** progress 的描述 */
    progress: number;
  /** startDate 的描述 */
    startDate: Date;
  /** targetDate 的描述 */
    targetDate: Date;
  /** milestones 的描述 */
    milestones: Milestone;
  /** adjustments 的描述 */
    adjustments: GoalAdjustment;
}

// 健康报告
export interface IHealthReport {
  /** period 的描述 */
    period: daily  weekly  monthly;
  summary: {
    overallScore: number;
    keyFindings: string;
    improvements: string;
    concerns: string;
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
