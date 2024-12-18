/**
 * @fileoverview TS 文件 service-quality.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 服务质量指标
export interface IQualityMetrics {
  /** responseTime 的描述 */
  responseTime: IResponseTimeMetrics;
  /** satisfaction 的描述 */
  satisfaction: SatisfactionMetrics;
  /** compliance 的描述 */
  compliance: ComplianceMetrics;
  /** timestamp 的描述 */
  timestamp: Date;
}

// 响应时间指标
export interface IResponseTimeMetrics {
  /** average 的描述 */
  average: number;
  /** peak 的描述 */
  peak: number;
  /** minimum 的描述 */
  minimum: number;
  /** compliance 的描述 */
  compliance: boolean;
  /** trend 的描述 */
  trend: TrendAnalysis;
}

// 服务反馈
export interface IServiceFeedback {
  /** userId 的描述 */
  userId: string;
  /** serviceId 的描述 */
  serviceId: string;
  /** rating 的描述 */
  rating: number;
  /** comments 的描述 */
  comments: string;
  /** categories 的描述 */
  categories: FeedbackCategory[];
  /** timestamp 的描述 */
  timestamp: Date;
}

// 服务质量报告
export interface IServiceQualityReport {
  /** period 的描述 */
  period: ReportPeriod;
  /** metrics 的描述 */
  metrics: IQualityMetrics[];
  /** trends 的描述 */
  trends: TrendAnalysis[];
  /** recommendations 的描述 */
  recommendations: Recommendation[];
}
