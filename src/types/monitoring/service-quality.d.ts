// 响应时间指标
export interface ResponseTimeMetrics {
  currentResponseTime: number;
  standardTime: number;
  compliance: boolean;
  trend: TrendAnalysis;
  recommendations: Recommendation[];
}

// 服务质量评估
export interface QualityEvaluation {
  factors: {
    professionalism: FactorEvaluation;
    timeliness: FactorEvaluation;
    effectiveness: FactorEvaluation;
    satisfaction: FactorEvaluation;
  };
  overallScore: number;
  improvements: Improvement[];
  trends: TrendAnalysis[];
}

// 合规检查
export interface ComplianceCheck {
  processCompliance: ComplianceResult;
  professionalCompliance: ComplianceResult;
  trainingCompliance: ComplianceResult;
  overallCompliance: number;
  requiredActions: Action[];
}

// 改进计划
export interface ImprovementPlan {
  analysis: FeedbackAnalysis;
  identifiedImprovements: Improvement[];
  implementationPlan: PlanDetails;
  expectedOutcomes: Outcome[];
  timeline: Timeline;
}

// 评估因素
export interface FactorEvaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// 合规结果
export interface ComplianceResult {
  isCompliant: boolean;
  score: number;
  gaps: string[];
  requiredActions: string[];
} 