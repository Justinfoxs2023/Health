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
  priority: 'high' | 'medium' | 'low';
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** rationale 的描述 */
  rationale: string;
  /** actions 的描述 */
  actions: ActionItem[];
  /** expectedOutcomes 的描述 */
  expectedOutcomes: string[];
  /** timeframe 的描述 */
  timeframe: string;
  /** evidence 的描述 */
  evidence: Evidence[];
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
  milestones: Milestone[];
  /** adjustments 的描述 */
  adjustments: GoalAdjustment[];
}

// 健康报告
export interface IHealthReport {
  /** period 的描述 */
  period: 'daily' | 'weekly' | 'monthly';
  /** summary 的描述 */
  summary: {
    overallScore: number;
    keyFindings: string[];
    improvements: string[];
    concerns: string[];
  };
  /** details 的描述 */
  details: {
    status: IHealthStatus;
    goals: IHealthGoal[];
    recommendations: IHealthRecommendation[];
  };
  /** analysis 的描述 */
  analysis: {
    trends: TrendAnalysis[];
    correlations: Correlation[];
    insights: Insight[];
  };
}
