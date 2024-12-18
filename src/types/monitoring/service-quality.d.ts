/**
 * @fileoverview TS 文件 service-quality.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 响应时间指标
export interface IResponseTimeMetrics {
  /** currentResponseTime 的描述 */
  currentResponseTime: number;
  /** standardTime 的描述 */
  standardTime: number;
  /** compliance 的描述 */
  compliance: false | true;
  /** trend 的描述 */
  trend: TrendAnalysis;
  /** recommendations 的描述 */
  recommendations: Recommendation;
}

// 服务质量评估
export interface IQualityEvaluation {
  /** factors 的描述 */
  factors: {
    professionalism: IFactorEvaluation;
    timeliness: IFactorEvaluation;
    effectiveness: IFactorEvaluation;
    satisfaction: IFactorEvaluation;
  };
  /** overallScore 的描述 */
  overallScore: number;
  /** improvements 的描述 */
  improvements: Improvement[];
  /** trends 的描述 */
  trends: TrendAnalysis[];
}

// 合规检查
export interface IComplianceCheck {
  /** processCompliance 的描述 */
  processCompliance: IComplianceResult;
  /** professionalCompliance 的描述 */
  professionalCompliance: IComplianceResult;
  /** trainingCompliance 的描述 */
  trainingCompliance: IComplianceResult;
  /** overallCompliance 的描述 */
  overallCompliance: number;
  /** requiredActions 的描述 */
  requiredActions: Action;
}

// 改进计划
export interface ImprovementPlan {
  /** analysis 的描述 */
  analysis: FeedbackAnalysis;
  /** identifiedImprovements 的描述 */
  identifiedImprovements: Improvement;
  /** implementationPlan 的描述 */
  implementationPlan: PlanDetails;
  /** expectedOutcomes 的描述 */
  expectedOutcomes: Outcome;
  /** timeline 的描述 */
  timeline: Timeline;
}

// 评估因素
export interface IFactorEvaluation {
  /** score 的描述 */
  score: number;
  /** strengths 的描述 */
  strengths: string;
  /** weaknesses 的描述 */
  weaknesses: string;
  /** recommendations 的描述 */
  recommendations: string;
}

// 合规结果
export interface IComplianceResult {
  /** isCompliant 的描述 */
  isCompliant: false | true;
  /** score 的描述 */
  score: number;
  /** gaps 的描述 */
  gaps: string;
  /** requiredActions 的描述 */
  requiredActions: string;
}
