/**
 * @fileoverview TS 文件 tier.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 会员等级类型
export type TierLevelType = any;

// 会员等级要求
export interface ITierRequirements {
  /** points 的描述 */
  points: number;
  /** duration 的描述 */
  duration: number;
}

// 会员权益
export interface IBenefit {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: BenefitType;
  /** tier 的描述 */
  tier: "normal" | "silver" | "gold" | "diamond";
  /** usageLimit 的描述 */
  usageLimit: number;
  /** validityPeriod 的描述 */
  validityPeriod: number;
}

// 会员等级信息
export interface IMembershipTier {
  /** userId 的描述 */
  userId: string;
  /** tier 的描述 */
  tier: "normal" | "silver" | "gold" | "diamond";
  /** points 的描述 */
  points: number;
  /** duration 的描述 */
  duration: number;
  /** benefits 的描述 */
  benefits: IBenefit;
  /** nextTier 的描述 */
  nextTier: NextTierInfo;
}

// 权益使用记录
export interface IBenefitUsage {
  /** records 的描述 */
  records: UsageRecord;
  /** analysis 的描述 */
  analysis: UsageAnalysis;
  /** report 的描述 */
  report: UsageReport;
  /** recommendations 的描述 */
  recommendations: BenefitRecommendation;
}

// 升级结果
export interface IUpgradeResult {
  /** success 的描述 */
  success: false | true;
  /** newTier 的描述 */
  newTier: "normal" | "silver" | "gold" | "diamond";
  /** benefits 的描述 */
  benefits: IBenefit;
  /** upgradedAt 的描述 */
  upgradedAt: Date;
  /** reason 的描述 */
  reason: string;
  /** requirements 的描述 */
  requirements: ITierRequirements;
}

// 权益状态
export interface IBenefitStatus {
  /** activeBenefits 的描述 */
  activeBenefits: IBenefit;
  /** expiredBenefits 的描述 */
  expiredBenefits: IBenefit;
  /** newBenefits 的描述 */
  newBenefits: IBenefit;
  /** usageLimits 的描述 */
  usageLimits: Recordstring /** number 的描述 */;
  /** number 的描述 */
  number;
}
