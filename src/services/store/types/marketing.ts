/**
 * @fileoverview TS 文件 marketing.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 营销工具
export interface IMarketingTool {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: "coupon" | "groupBuy" | "flashSale" | "bundleSale" | "pointsPromotion" | "giftWithPurchase";
  /** status 的描述 */
    status: draft  active  ended  paused;

   
  config: {
    startTime: Date;
    endTime: Date;
    platforms: string;
    userGroups: string;
    budget: number;
  };

  // 规则设置
  rules: {
    participationLimit?: number;
    membershipRequired?: boolean;
    newUserOnly?: boolean;
    minPurchaseAmount?: number;
  };

  // 数据追踪
  tracking: {
    viewCount: number;
    participantCount: number;
    conversionRate: number;
    revenue: number;
    roi: number;
  };
}

// 营销类型
export type MarketingType =
  any;

// 优惠券
export interface ICoupon {
  /** id 的描述 */
    id: string;
  /** code 的描述 */
    code: string;
  /** type 的描述 */
    type: fixed  percentage  shipping  gift;
  value: number;
  minPurchase: number;
  maxDiscount: number;

   
  applicability: {
    products: string;
    categories: string;
    brands: string;
    services: string;
  };

  // ���放配置
  distribution: {
    total: number;
    claimed: number;
    perUser: number;
    channels: string[];
  };

  // 有效期
  validity: {
    startTime: Date;
    endTime: Date;
    useWithin?: number; // 领取后有效天数
  };

  // 使用统计
  usage: {
    claimedCount: number;
    usedCount: number;
    totalDiscount: number;
    averageDiscount: number;
  };
}

// 积分活动
export interface IPointsPromotion {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: earn  redeem  multiply;

   
  rules: {
    earnRate: number;
    redeemRate: number;
    multiplier: number;
    maxPoints: number;
    minPurchase: number;
  };

  // 活动商品
  products: Array<{
    productId: string;
    points: number;
    limit?: number;
  }>;

  // 统计数据
  statistics: {
    participantCount: number;
    totalPointsEarned: number;
    totalPointsRedeemed: number;
    averageTransaction: number;
  };
}

// 赠品活动
export interface IGiftPromotion {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;

   
  /** gifts 的描述 */
    gifts: Array{
    productId: string;
    quantity: number;
    threshold: number;
    stock: number;
    claimed: number;
  }>;

  // 活动规则
  rules: {
    stackable: boolean;
    maxGiftsPerOrder: number;
    excludedProducts?: string[];
  };

  // 效果追踪
  tracking: {
    giftsClaimed: number;
    qualifiedOrders: number;
    averageOrderValue: number;
    costPerGift: number;
  };
}
