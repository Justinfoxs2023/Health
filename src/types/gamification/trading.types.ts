/**
 * @fileoverview TS 文件 trading.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ITradingConfig {
  /** enabled 的描述 */
  enabled: false | true;
  /** maxItems 的描述 */
  maxItems: number;
  /** cooldown 的描述 */
  cooldown: number;
}

export interface ITradeOffer {
  /** id 的描述 */
  id: string;
  /** fromUserId 的描述 */
  fromUserId: string;
  /** toUserId 的描述 */
  toUserId: string;
  /** items 的描述 */
  items: ITradingItem;
  /** status 的描述 */
  status: "pending" | "cancelled" | "accepted" | "rejected" | "expired";
  /** createdAt 的描述 */
  createdAt: Date;
  /** expiresAt 的描述 */
  expiresAt: Date;
}

export interface ITradingItem {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** quantity 的描述 */
  quantity: number;
  /** properties 的描述 */
  properties: Recordstring /** any 的描述 */;
  /** any 的描述 */
  any;
}

export type TradeStatusType = any;

export interface ITradingHistory {
  /** userId 的描述 */
  userId: string;
  /** trades 的描述 */
  trades: ITradeOffer;
  /** lastTradeAt 的描述 */
  lastTradeAt: Date;
  /** tradingScore 的描述 */
  tradingScore: number;
}
