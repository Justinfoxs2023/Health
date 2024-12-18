/**
 * @fileoverview TS 文件 reward-account.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 奖励账户系统
export interface IRewardAccountSystem {
  /** personalAccount 的描述 */
  personalAccount: {
    accountId: string;
    userId: string;
    balance: number;
    currency: string;
    transactions: ITransaction;
    withdrawalSettings: WithdrawalSetting;
  };

  // 家庭基金账户
  /** familyAccount 的描述 */
  familyAccount: {
    accountId: string;
    familyId: string;
    balance: number;
    currency: string;
    members: FamilyMember[];
    transactions: ITransaction[];
    usageRules: IFundUsageRule[];
  };

  // 奖励规则
  /** rewardRules 的描述 */
  rewardRules: {
    promotionRewards: PromotionRule[];
    referralRewards: ReferralRule[];
    achievementRewards: AchievementRule[];
    seasonalBonuses: SeasonalBonus[];
  };

  // 资金使用权限
  /** permissions 的描述 */
  permissions: {
    personalPermissions: PersonalPermission[];
    familyPermissions: FamilyPermission[];
    withdrawalLimits: WithdrawalLimit[];
  };
}

// 交易记录
export interface ITransaction {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: import("D:/Health/src/types/reward-account").TransactionType.PROMOTION_REWARD | import("D:/Health/src/types/reward-account").TransactionType.REFERRAL_BONUS | import("D:/Health/src/types/reward-account").TransactionType.ACHIEVEMENT_REWARD | import("D:/Health/src/types/reward-account").TransactionType.WITHDRAWAL | import("D:/Health/src/types/reward-account").TransactionType.PURCHASE | import("D:/Health/src/types/reward-account").TransactionType.TRANSFER | import("D:/Health/src/types/reward-account").TransactionType.REFUND;
  /** amount 的描述 */
  amount: number;
  /** currency 的描述 */
  currency: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** status 的描述 */
  status: TransactionStatus;
  /** description 的描述 */
  description: string;
  /** relatedOrder 的描述 */
  relatedOrder: string;
  /** metadata 的描述 */
  metadata: Recordstring /** any 的描述 */;
  /** any 的描述 */
  any;
}

// 家庭基金使用规则
export interface IFundUsageRule {
  /** ruleId 的描述 */
  ruleId: string;
  /** category 的描述 */
  category: import("D:/Health/src/types/reward-account").FundCategory.HEALTH_PRODUCTS | import("D:/Health/src/types/reward-account").FundCategory.MEDICAL_SERVICES | import("D:/Health/src/types/reward-account").FundCategory.FITNESS_PROGRAMS | import("D:/Health/src/types/reward-account").FundCategory.NUTRITION_CONSULTING | import("D:/Health/src/types/reward-account").FundCategory.WELLNESS_ACTIVITIES | import("D:/Health/src/types/reward-account").FundCategory.EMERGENCY_MEDICAL;
  /** approvalRequired 的描述 */
  approvalRequired: false | true;
  /** minApprovers 的描述 */
  minApprovers: number;
  /** maxAmount 的描述 */
  maxAmount: number;
  /** cooldownPeriod 的描述 */
  cooldownPeriod: number;
  /** allowedPurposes 的描述 */
  allowedPurposes: string;
  /** restrictions 的描述 */
  restrictions: string;
}

// 交易类型
export enum TransactionType {
  PROMOTION_REWARD = 'promotionReward',
  REFERRAL_BONUS = 'referralBonus',
  ACHIEVEMENT_REWARD = 'achievementReward',
  WITHDRAWAL = 'withdrawal',
  PURCHASE = 'purchase',
  TRANSFER = 'transfer',
  REFUND = 'refund',
}

// 资金使用类别
export enum FundCategory {
  HEALTH_PRODUCTS = 'healthProducts',
  MEDICAL_SERVICES = 'medicalServices',
  FITNESS_PROGRAMS = 'fitnessPrograms',
  NUTRITION_CONSULTING = 'nutritionConsulting',
  WELLNESS_ACTIVITIES = 'wellnessActivities',
  EMERGENCY_MEDICAL = 'emergencyMedical',
}
