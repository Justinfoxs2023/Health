/**
 * @fileoverview TS 文件 interfaces.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IProductData {
  /** _id 的描述 */
    _id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** price 的描述 */
    price: number;
  /** originalPrice 的描述 */
    originalPrice: number;
  /** category 的描述 */
    category: string;
  /** subcategory 的描述 */
    subcategory: string;
  /** images 的描述 */
    images: string;
  /** stock 的描述 */
    stock: number;
  /** sales 的描述 */
    sales: number;
  /** status 的描述 */
    status: active  inactive  deleted;
  specifications: {
    name: string;
    value: string;
  }[];
  attributes?: {
    name: string;
    value: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductQuery {
  /** category 的描述 */
    category: string;
  /** keyword 的描述 */
    keyword: string;
  /** minPrice 的描述 */
    minPrice: number;
  /** maxPrice 的描述 */
    maxPrice: number;
  /** status 的描述 */
    status: string;
  /** page 的描述 */
    page: number;
  /** limit 的描述 */
    limit: number;
}

export interface IOrderData {
  /** _id 的描述 */
    _id: string;
  /** userId 的描述 */
    userId: string;
  /** items 的描述 */
    items: {
    productId: string;
    quantity: number;
    price: number;
    specifications: any;
  }[];
  /** amount 的描述 */
    amount: number;
  /** status 的描述 */
    status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  /** address 的描述 */
    address: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
  };
  /** paymentId 的描述 */
    paymentId?: undefined | string;
  /** trackingNumber 的描述 */
    trackingNumber?: undefined | string;
  /** remark 的描述 */
    remark?: undefined | string;
  /** createdAt 的描述 */
    createdAt?: undefined | Date;
  /** updatedAt 的描述 */
    updatedAt?: undefined | Date;
}

export interface IOrderQuery {
  /** userId 的描述 */
    userId: string;
  /** status 的描述 */
    status: string;
  /** startDate 的描述 */
    startDate: string;
  /** endDate 的描述 */
    endDate: string;
  /** page 的描述 */
    page: number;
  /** limit 的描述 */
    limit: number;
}

export interface IPaymentData {
  /** _id 的描述 */
    _id: string;
  /** userId 的描述 */
    userId: string;
  /** orderId 的描述 */
    orderId: string;
  /** amount 的描述 */
    amount: number;
  /** paymentMethod 的描述 */
    paymentMethod: string;
  /** status 的描述 */
    status: pending  success  failed  refunded;
  thirdPartyPaymentId: string;
  thirdPartyData: any;
  paymentUrl: string;
  paidTime: Date;
  refundAmount: number;
  refundId: string;
  refundTime: Date;
  subject: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentQuery {
  /** userId 的描述 */
    userId: string;
  /** orderId 的描述 */
    orderId: string;
  /** status 的描述 */
    status: string;
  /** startDate 的描述 */
    startDate: string;
  /** endDate 的描述 */
    endDate: string;
  /** page 的描述 */
    page: number;
  /** limit 的描述 */
    limit: number;
}

export interface ILogisticsData {
  /** _id 的描述 */
    _id: string;
  /** orderId 的描述 */
    orderId: string;
  /** carrier 的描述 */
    carrier: string;
  /** trackingNumber 的描述 */
    trackingNumber: string;
  /** status 的描述 */
    status: pending  shipping  delivered  exception;
  timeline: {
    status: string;
    timestamp: Date;
    location: string;
    description: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILogisticsQuery {
  /** orderId 的描述 */
    orderId: string;
  /** trackingNumber 的描述 */
    trackingNumber: string;
  /** status 的描述 */
    status: string;
  /** startDate 的描述 */
    startDate: string;
  /** endDate 的描述 */
    endDate: string;
  /** page 的描述 */
    page: number;
  /** limit 的描述 */
    limit: number;
}

export interface ICartData {
  /** _id 的描述 */
    _id: string;
  /** userId 的描述 */
    userId: string;
  /** items 的描述 */
    items: {
    productId: string;
    quantity: number;
    specifications: any;
    selected: boolean;
  }[];
  /** createdAt 的描述 */
    createdAt?: undefined | Date;
  /** updatedAt 的描述 */
    updatedAt?: undefined | Date;
}

export interface IReviewData {
  /** _id 的描述 */
    _id: string;
  /** userId 的描述 */
    userId: string;
  /** orderId 的描述 */
    orderId: string;
  /** productId 的描述 */
    productId: string;
  /** rating 的描述 */
    rating: number;
  /** content 的描述 */
    content: string;
  /** images 的描述 */
    images: string;
  /** reply 的描述 */
    reply: {
    content: string;
    time: Date;
  };
  /** status 的描述 */
    status: "pending" | "approved" | "rejected";
  /** createdAt 的描述 */
    createdAt?: undefined | Date;
  /** updatedAt 的描述 */
    updatedAt?: undefined | Date;
}

export interface IReviewQuery {
  /** userId 的描述 */
    userId: string;
  /** productId 的描述 */
    productId: string;
  /** rating 的描述 */
    rating: number;
  /** status 的描述 */
    status: string;
  /** page 的描述 */
    page: number;
  /** limit 的描述 */
    limit: number;
}

export interface ICouponData {
  /** _id 的描述 */
    _id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: amount  /** percentage 的描述 */
    /** percentage 的描述 */
    percentage;
  /** value 的描述 */
    value: number;
  /** minAmount 的描述 */
    minAmount: number;
  /** startTime 的描述 */
    startTime: Date;
  /** endTime 的描述 */
    endTime: Date;
  /** quantity 的描述 */
    quantity: number;
  /** usedCount 的描述 */
    usedCount: number;
  /** perUserLimit 的描述 */
    perUserLimit: number;
  /** categories 的描述 */
    categories: string;
  /** products 的描述 */
    products: string;
  /** status 的描述 */
    status: active  inactive  expired;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICouponQuery {
  /** userId 的描述 */
    userId: string;
  /** status 的描述 */
    status: string;
  /** type 的描述 */
    type: string;
  /** page 的描述 */
    page: number;
  /** limit 的描述 */
    limit: number;
}

export interface IUserCouponData {
  /** _id 的描述 */
    _id: string;
  /** userId 的描述 */
    userId: string;
  /** couponId 的描述 */
    couponId: string;
  /** status 的描述 */
    status: unused  used  expired;
  usedTime: Date;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFavoriteData {
  /** _id 的描述 */
    _id: string;
  /** userId 的描述 */
    userId: string;
  /** productId 的描述 */
    productId: string;
  /** createdAt 的描述 */
    createdAt: Date;
}

export interface IFavoriteQuery {
  /** userId 的描述 */
    userId: string;
  /** page 的描述 */
    page: number;
  /** limit 的描述 */
    limit: number;
}

export interface ICategoryData {
  /** _id 的描述 */
    _id: string;
  /** name 的描述 */
    name: string;
  /** parentId 的描述 */
    parentId: string;
  /** level 的描述 */
    level: number;
  /** sort 的描述 */
    sort: number;
  /** icon 的描述 */
    icon: string;
  /** description 的描述 */
    description: string;
  /** status 的描述 */
    status: active  /** inactive 的描述 */
    /** inactive 的描述 */
    inactive;
  /** createdAt 的描述 */
    createdAt: Date;
  /** updatedAt 的描述 */
    updatedAt: Date;
}

export interface IPromotionData {
  /** _id 的描述 */
    _id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: discount  special_price  bundle;
  startTime: Date;
  endTime: Date;
  rules: {
    type: string;
    value: any;
  }[];
  products: string[];
  status: 'upcoming' | 'active' | 'ended';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMarketingCampaign {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** startDate 的描述 */
    startDate: Date;
  /** endDate 的描述 */
    endDate: Date;
  /** products 的描述 */
    products: string;
  /** discount 的描述 */
    discount: number;
  /** status 的描述 */
    status: draft  active  ended;
}

export interface ICampaign extends IMarketingCampaign {
  /** id 的描述 */
    id: string;
  /** createdAt 的描述 */
    createdAt: Date;
  /** updatedAt 的描述 */
    updatedAt: Date;
}

export enum RewardAction {
  Purchase = 'purchase',
  Review = 'review',
  Share = 'share',
  Register = 'register',
  Login = 'login',
}

export interface IReward {
  /** points 的描述 */
    points: number;
  /** action 的描述 */
    action: import("D:/Health/src/services/mall/interfaces").RewardAction.Purchase | import("D:/Health/src/services/mall/interfaces").RewardAction.Review | import("D:/Health/src/services/mall/interfaces").RewardAction.Share | import("D:/Health/src/services/mall/interfaces").RewardAction.Register | import("D:/Health/src/services/mall/interfaces").RewardAction.Login;
  /** timestamp 的描述 */
    timestamp: Date;
}

export interface ICouponConfig {
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** discountType 的描述 */
    discountType: percentage  /** fixed 的描述 */
    /** fixed 的描述 */
    fixed;
  /** discountValue 的描述 */
    discountValue: number;
  /** minPurchase 的描述 */
    minPurchase: number;
  /** validFrom 的描述 */
    validFrom: Date;
  /** validTo 的描述 */
    validTo: Date;
  /** maxUsage 的描述 */
    maxUsage: number;
  /** productCategories 的描述 */
    productCategories: string;
}

export interface ICoupon extends ICouponConfig {
  /** id 的描述 */
    id: string;
  /** code 的描述 */
    code: string;
  /** isUsed 的描述 */
    isUsed: false | true;
  /** usedAt 的描述 */
    usedAt?: undefined | Date;
  /** userId 的描述 */
    userId?: undefined | string;
}
