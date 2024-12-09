// 营销工具
export interface MarketingTool {
  id: string;
  name: string;
  type: MarketingType;
  status: 'draft' | 'active' | 'ended' | 'paused';
  
  // 基本配置
  config: {
    startTime: Date;
    endTime: Date;
    platforms: string[];
    userGroups: string[];
    budget?: number;
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
  | 'coupon'
  | 'groupBuy'
  | 'flashSale'
  | 'bundleSale'
  | 'pointsPromotion'
  | 'giftWithPurchase';

// 优惠券
export interface Coupon {
  id: string;
  code: string;
  type: 'fixed' | 'percentage' | 'shipping' | 'gift';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  
  // 使用范围
  applicability: {
    products?: string[];
    categories?: string[];
    brands?: string[];
    services?: string[];
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
export interface PointsPromotion {
  id: string;
  name: string;
  type: 'earn' | 'redeem' | 'multiply';
  
  // 积分规则
  rules: {
    earnRate?: number;
    redeemRate?: number;
    multiplier?: number;
    maxPoints?: number;
    minPurchase?: number;
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
export interface GiftPromotion {
  id: string;
  name: string;
  
  // 赠品配置
  gifts: Array<{
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