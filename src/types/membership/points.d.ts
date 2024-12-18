/**
 * @fileoverview TS 文件 points.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 积分活动类型
export interface IPointsActivity {
  /** type 的描述 */
  type: ActivityType;
  /** data 的描述 */
  data: ActivityData;
  /** timestamp 的描述 */
  timestamp: Date;
  /** source 的描述 */
  source: string;
}

// 积分交易记录
export interface IPointsTransaction {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** activity 的描述 */
  activity: IPointsActivity;
  /** points 的描述 */
  points: number;
  /** balance 的描述 */
  balance: number;
  /** timestamp 的描述 */
  timestamp: Date;
}

// 兑换请求
export interface IRedemptionRequest {
  /** itemId 的描述 */
  itemId: string;
  /** points 的描述 */
  points: number;
  /** quantity 的描述 */
  quantity: number;
}

// 兑换结果
export interface IRedemptionResult {
  /** success 的描述 */
  success: false | true;
  /** redemption 的描述 */
  redemption: {
    id: string;
    item: RedemptionItem;
    points: number;
    expiryDate: Date;
  };
  /** remainingPoints 的描述 */
  remainingPoints: number;
  /** error 的描述 */
  error?: undefined | string;
}

// 积分到期管理
export interface IExpiryManagementResult {
  /** expiredPoints 的描述 */
  expiredPoints: number;
  /** nextExpiryDate 的描述 */
  nextExpiryDate: Date;
  /** remainingPoints 的描述 */
  remainingPoints: number;
  /** expirySchedule 的描述 */
  expirySchedule: ExpirySchedule;
}
