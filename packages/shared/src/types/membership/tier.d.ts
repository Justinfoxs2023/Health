// 会员等级类型
export type TierLevel = 'normal' | 'silver' | 'gold' | 'diamond';

// 会员等级要求
export interface TierRequirements {
  points: number;
  duration: number; // 单位：月
}

// 会员权益
export interface Benefit {
  id: string;
  name: string;
  description: string;
  type: BenefitType;
  tier: TierLevel;
  usageLimit?: number;
  validityPeriod?: number;
}

// 会员等级信息
export interface MembershipTier {
  userId: string;
  tier: TierLevel;
  points: number;
  duration: number;
  benefits: Benefit[];
  nextTier: NextTierInfo;
}

// 权益使用记录
export interface BenefitUsage {
  records: UsageRecord[];
  analysis: UsageAnalysis;
  report: UsageReport;
  recommendations: BenefitRecommendation[];
}

// 升级结果
export interface UpgradeResult {
  success: boolean;
  newTier?: TierLevel;
  benefits?: Benefit[];
  upgradedAt?: Date;
  reason?: string;
  requirements?: TierRequirements;
}

// 权益状态
export interface BenefitStatus {
  activeBenefits: Benefit[];
  expiredBenefits: Benefit[];
  newBenefits: Benefit[];
  usageLimits: Record<string, number>;
} 