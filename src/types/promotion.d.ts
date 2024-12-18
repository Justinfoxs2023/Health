/**
 * @fileoverview TS 文件 promotion.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 推荐关系
interface IReferralRelationship {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** referrerId 的描述 */
    referrerId: string;
  /** level 的描述 */
    level: number;
  /** createdAt 的描述 */
    createdAt: Date;
  /** status 的描述 */
    status: active  /** inactive 的描述 */
    /** inactive 的描述 */
    inactive;
  /** uplineChain 的描述 */
    uplineChain: string;
}

// 佣金配置
interface ICommissionConfig {
  /** id 的描述 */
    id: string;
  /** level1Rate 的描述 */
    level1Rate: number;
  /** level2Rate 的描述 */
    level2Rate: number;
  /** minimumAmount 的描述 */
    minimumAmount: number;
  /** maximumRate 的描述 */
    maximumRate: number;
  /** updatedAt 的描述 */
    updatedAt: Date;
  /** status 的描述 */
    status: active  /** inactive 的描述 */
    /** inactive 的描述 */
    inactive;
}

// 佣金记录
interface ICommissionRecord {
  /** id 的描述 */
    id: string;
  /** orderId 的描述 */
    orderId: string;
  /** userId 的描述 */
    userId: string;
  /** referrerId 的描述 */
    referrerId: string;
  /** level 的描述 */
    level: number;
  /** amount 的描述 */
    amount: number;
  /** rate 的描述 */
    rate: number;
  /** status 的描述 */
    status: pending  settled  failed;
  createdAt: Date;
  settledAt: Date;
}

// 推广统计
interface IReferralStatistics {
  /** userId 的描述 */
    userId: string;
  /** level1Count 的描述 */
    level1Count: number;
  /** level2Count 的描述 */
    level2Count: number;
  /** level1Consumption 的描述 */
    level1Consumption: number;
  /** level2Consumption 的描述 */
    level2Consumption: number;
  /** totalCommission 的描述 */
    totalCommission: number;
  /** lastUpdateTime 的描述 */
    lastUpdateTime: Date;
}
