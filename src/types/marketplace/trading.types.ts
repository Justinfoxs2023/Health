/**
 * @fileoverview TS 文件 trading.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 商品交易类型
export interface ITradingItem {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** originalPrice 的描述 */
    originalPrice: number;
  /** currentPrice 的描述 */
    currentPrice: number;
  /** category 的描述 */
    category: string;
  /** owner 的描述 */
    owner: string;
  /** status 的描述 */
    status: available  trading  sold;
  tradingHistory: TradeRecord;
  displaySettings: {
    showInWindow: boolean;
    position: number;
    customPrice: number;
    shareSettings: {
      allowShare: boolean;
      posterConfig: PosterConfig;
    };
  };
  tradingRules: {
    minPrice: number;
    maxPrice: number;
    tradingFee: number;
    allowBargain: boolean;
    deliveryOptions: string[];
  };
}

// 交易记录
export interface ITradeRecord {
  /** id 的描述 */
    id: string;
  /** itemId 的描述 */
    itemId: string;
  /** seller 的描述 */
    seller: string;
  /** buyer 的描述 */
    buyer: string;
  /** price 的描述 */
    price: number;
  /** timestamp 的描述 */
    timestamp: Date;
  /** type 的描述 */
    type: list  trade  delivery;
  status: pending  completed  cancelled;
  commission: number;
}

// 用户交易档案
export interface ITradingProfile {
  /** userId 的描述 */
    userId: string;
  /** level 的描述 */
    level: number;
  /** tradingVolume 的描述 */
    tradingVolume: number;
  /** reputation 的描述 */
    reputation: number;
  /** achievements 的描述 */
    achievements: string;
  /** commissionRate 的描述 */
    commissionRate: number;
  /** tradingPrivileges 的描述 */
    tradingPrivileges: {
    maxItems: number;
    canSetPrice: boolean;
    canCreatePoster: boolean;
    canEarnCommission: boolean;
  };
  /** statistics 的描述 */
    statistics: {
    totalSales: number;
    totalPurchases: number;
    successfulTrades: number;
    commissionEarned: number;
  };
}
