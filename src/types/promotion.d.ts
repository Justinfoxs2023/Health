// 推荐关系
interface ReferralRelationship {
  id: string;
  userId: string;
  referrerId: string;
  level: number;
  createdAt: Date;
  status: 'active' | 'inactive';
  uplineChain: string[];
}

// 佣金配置
interface CommissionConfig {
  id: string;
  level1Rate: number;
  level2Rate: number;
  minimumAmount: number;
  maximumRate: number;
  updatedAt: Date;
  status: 'active' | 'inactive';
}

// 佣金记录
interface CommissionRecord {
  id: string;
  orderId: string;
  userId: string;
  referrerId: string;
  level: number;
  amount: number;
  rate: number;
  status: 'pending' | 'settled' | 'failed';
  createdAt: Date;
  settledAt?: Date;
}

// 推广统计
interface ReferralStatistics {
  userId: string;
  level1Count: number;
  level2Count: number;
  level1Consumption: number;
  level2Consumption: number;
  totalCommission: number;
  lastUpdateTime: Date;
} 