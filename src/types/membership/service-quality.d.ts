// 服务质量指标
export interface QualityMetrics {
  responseTime: ResponseTimeMetrics;
  satisfaction: SatisfactionMetrics;
  compliance: ComplianceMetrics;
  timestamp: Date;
}

// 响应时间指标
export interface ResponseTimeMetrics {
  average: number;
  peak: number;
  minimum: number;
  compliance: boolean;
  trend: TrendAnalysis;
}

// 服务反馈
export interface ServiceFeedback {
  userId: string;
  serviceId: string;
  rating: number;
  comments: string;
  categories: FeedbackCategory[];
  timestamp: Date;
}

// 服务质量报告
export interface ServiceQualityReport {
  period: ReportPeriod;
  metrics: QualityMetrics[];
  trends: TrendAnalysis[];
  recommendations: Recommendation[];
} 