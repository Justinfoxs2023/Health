// 会员权益类型
export type PrivilegeType = 'health_service' | 'exclusive_feature' | 'priority_service';

// 权益频率
export type ServiceFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on_demand';

// 权益定义
export interface Privilege {
  id: string;
  name: string;
  description: string;
  type: PrivilegeType;
  frequency?: ServiceFrequency;
  tier: TierLevel[];
  status: 'active' | 'inactive' | 'deprecated';
  effectiveDate: Date;
  expiryDate?: Date;
}

// 新权益数据
export interface NewPrivilegeData {
  name: string;
  description: string;
  type: PrivilegeType;
  frequency?: ServiceFrequency;
  tier: TierLevel[];
  effectiveDate: Date;
  expiryDate?: Date;
}

// 权益更新数据
export interface PrivilegeUpdates {
  name?: string;
  description?: string;
  frequency?: ServiceFrequency;
  tier?: TierLevel[];
  status?: 'active' | 'inactive';
  effectiveDate?: Date;
  expiryDate?: Date;
}

// 权益使用统计
export interface UsageStats {
  usage: {
    total: number;
    byTier: Record<TierLevel, number>;
    byPeriod: Record<string, number>;
  };
  trends: UsageTrend[];
  report: UsageReport;
  recommendations: Recommendation[];
} 