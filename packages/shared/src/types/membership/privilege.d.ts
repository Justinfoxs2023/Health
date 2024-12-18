/**
 * @fileoverview TS 文件 privilege.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 会员权益类型
export type PrivilegeType = 'health_service' | 'exclusive_feature' | 'priority_service';

// 权益频率
export type ServiceFrequencyType =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'on_demand';

// 权益定义
export interface IPrivilege {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: PrivilegeType;
  /** frequency 的描述 */
  frequency?: ServiceFrequencyType;
  /** tier 的描述 */
  tier: TierLevel[];
  /** status 的描述 */
  status: 'active' | 'inactive' | 'deprecated';
  /** effectiveDate 的描述 */
  effectiveDate: Date;
  /** expiryDate 的描述 */
  expiryDate?: Date;
}

// 新权益数据
export interface INewPrivilegeData {
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: PrivilegeType;
  /** frequency 的描述 */
  frequency?: ServiceFrequencyType;
  /** tier 的描述 */
  tier: TierLevel[];
  /** effectiveDate 的描述 */
  effectiveDate: Date;
  /** expiryDate 的描述 */
  expiryDate?: Date;
}

// 权益更新数据
export interface IPrivilegeUpdates {
  /** name 的描述 */
  name?: string;
  /** description 的描述 */
  description?: string;
  /** frequency 的描述 */
  frequency?: ServiceFrequencyType;
  /** tier 的描述 */
  tier?: TierLevel[];
  /** status 的描述 */
  status?: 'active' | 'inactive';
  /** effectiveDate 的描述 */
  effectiveDate?: Date;
  /** expiryDate 的描述 */
  expiryDate?: Date;
}

// 权益使用统计
export interface IUsageStats {
  /** usage 的描述 */
  usage: {
    total: number;
    byTier: Record<TierLevel, number>;
    byPeriod: Record<string, number>;
  };
  /** trends 的描述 */
  trends: UsageTrend[];
  /** report 的描述 */
  report: UsageReport;
  /** recommendations 的描述 */
  recommendations: Recommendation[];
}
