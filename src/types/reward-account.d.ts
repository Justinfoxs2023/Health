// 奖励账户系统
export interface RewardAccountSystem {
  // 个人账户
  personalAccount: {
    accountId: string;
    userId: string;
    balance: number;
    currency: string;
    transactions: Transaction[];
    withdrawalSettings: WithdrawalSetting;
  };
  
  // 家庭基金账户
  familyAccount: {
    accountId: string;
    familyId: string;
    balance: number;
    currency: string;
    members: FamilyMember[];
    transactions: Transaction[];
    usageRules: FundUsageRule[];
  };
  
  // 奖励规则
  rewardRules: {
    promotionRewards: PromotionRule[];
    referralRewards: ReferralRule[];
    achievementRewards: AchievementRule[];
    seasonalBonuses: SeasonalBonus[];
  };
  
  // 资金使用权限
  permissions: {
    personalPermissions: PersonalPermission[];
    familyPermissions: FamilyPermission[];
    withdrawalLimits: WithdrawalLimit[];
  };
}

// 交易记录
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  timestamp: Date;
  status: TransactionStatus;
  description: string;
  relatedOrder?: string;
  metadata: Record<string, any>;
}

// 家庭基金使用规则
export interface FundUsageRule {
  ruleId: string;
  category: FundCategory;
  approvalRequired: boolean;
  minApprovers: number;
  maxAmount: number;
  cooldownPeriod: number;
  allowedPurposes: string[];
  restrictions: string[];
}

// 交易类型
export enum TransactionType {
  PROMOTION_REWARD = 'promotionReward',
  REFERRAL_BONUS = 'referralBonus',
  ACHIEVEMENT_REWARD = 'achievementReward',
  WITHDRAWAL = 'withdrawal',
  PURCHASE = 'purchase',
  TRANSFER = 'transfer',
  REFUND = 'refund'
}

// 资金使用类别
export enum FundCategory {
  HEALTH_PRODUCTS = 'healthProducts',
  MEDICAL_SERVICES = 'medicalServices',
  FITNESS_PROGRAMS = 'fitnessPrograms',
  NUTRITION_CONSULTING = 'nutritionConsulting',
  WELLNESS_ACTIVITIES = 'wellnessActivities',
  EMERGENCY_MEDICAL = 'emergencyMedical'
} 