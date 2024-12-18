/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 商品分类
export type ProductCategoryType =
  any; // 个人护理

// 商品类型
export interface IProduct {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** category 的描述 */
    category: "health_food" | "supplement" | "equipment" | "service" | "traditional" | "personal_care";
  /** description 的描述 */
    description: string;
  /** price 的描述 */
    price: number;
  /** originalPrice 的描述 */
    originalPrice: number;
  /** images 的描述 */
    images: string;
  /** stock 的描述 */
    stock: number;
  /** tags 的描述 */
    tags: string;
  /** specifications 的描述 */
    specifications: {
    weight: number;
    size: string;
    usage: string;
    ingredients: string;
    effect: string;
    shelfLife: string;
    storage: string;
    warnings: string;
  };
  /** ratings 的描述 */
    ratings: {
    average: number;
    count: number;
    details: {
      [key: number]: number; // 1-5星评分分布
    };
  };
  /** metadata 的描述 */
    metadata: {
    views: number;
    sales: number;
    favorites: number;
    lastRestocked?: Date;
    recommendationScore?: number;
  };
  /** relatedProducts 的描述 */
    relatedProducts: string[];
  /** healthLabels 的描述 */
    healthLabels: string[];
  /** certifications 的描述 */
    certifications: string[];
  /** manufacturer 的描述 */
    manufacturer: {
    name: string;
    license?: string;
    contact?: string;
  };
}

// 地址信息
export interface IAddress {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** name 的描述 */
    name: string;
  /** phone 的描述 */
    phone: string;
  /** province 的描述 */
    province: string;
  /** city 的描述 */
    city: string;
  /** district 的描述 */
    district: string;
  /** detail 的描述 */
    detail: string;
  /** isDefault 的描述 */
    isDefault: false | true;
  /** tag 的描述 */
    tag: home  office  other;
}

// 支付信息
export interface IPaymentInfo {
  /** id 的描述 */
    id: string;
  /** method 的描述 */
    method: alipay  wechat  creditcard;
  status: pending  success  failed;
  amount: number;
  currency: string;
  transactionId: string;
  paidAt: Date;
  refundStatus: none  partial  full;
  refundAmount: number;
}

// 物流信息
export interface ILogisticsInfo {
  /** trackingNumber 的描述 */
    trackingNumber: string;
  /** carrier 的描述 */
    carrier: string;
  /** status 的描述 */
    status: pending  shipping  delivered  returned;
  timeline: Array{
    status: string;
    timestamp: Date;
    location: string;
    description: string;
  }>;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  signedBy?: string;
}

// 订单类型
export interface IOrder {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** products 的描述 */
    products: Array{
    productId: string;
    quantity: number;
    price: number;
    discount: number;
    subtotal: number;
  }>;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  address: Address;
  payment: PaymentInfo;
  logistics?: LogisticsInfo;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  invoice?: {
    type: 'personal' | 'company';
    title: string;
    taxNumber?: string;
  };
}

// 购物车类型
export interface ICart {
  /** userId 的描述 */
    userId: string;
  /** items 的描述 */
    items: Array{
    productId: string;
    quantity: number;
    selected: boolean;
    addedAt: Date;
    price: number;
    subtotal: number;
  }>;
  totalAmount: number;
  selectedAmount: number;
  updatedAt: Date;
  promotions?: Array<{
    id: string;
    type: 'discount' | 'coupon' | 'gift';
    amount: number;
    description: string;
  }>;
}

// 商品评价
export interface IProductReview {
  /** id 的描述 */
    id: string;
  /** productId 的描述 */
    productId: string;
  /** userId 的描述 */
    userId: string;
  /** orderId 的描述 */
    orderId: string;
  /** rating 的描述 */
    rating: number;
  /** content 的描述 */
    content: string;
  /** images 的描述 */
    images: string;
  /** tags 的描述 */
    tags: string;
  /** likes 的描述 */
    likes: number;
  /** createdAt 的描述 */
    createdAt: Date;
  /** updatedAt 的描述 */
    updatedAt: Date;
  /** reply 的描述 */
    reply: {
    content: string;
    createdAt: Date;
    isOfficial: boolean;
  };
  /** verifiedPurchase 的描述 */
    verifiedPurchase: false | true;
}

// 促销活动
export interface IPromotion {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: discount  coupon  gift  bundle;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  conditions: {
    minAmount: number;
    productIds: string;
    categories: ProductCategory;
    userLevel: string;
  };
  benefits: {
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxDiscount?: number;
    giftProductId?: string;
  };
  status: 'active' | 'inactive' | 'expired';
  usageLimit?: number;
  usedCount: number;
}

// 商品收藏
export interface IProductFavorite {
  /** userId 的描述 */
    userId: string;
  /** productId 的描述 */
    productId: string;
  /** addedAt 的描述 */
    addedAt: Date;
  /** notifyOnSale 的描述 */
    notifyOnSale: false | true;
  /** notifyOnRestock 的描述 */
    notifyOnRestock: false | true;
}

// 商品库存变更记录
export interface IStockHistory {
  /** productId 的描述 */
    productId: string;
  /** type 的描述 */
    type: in  /** adjustment 的描述 */
    /** adjustment 的描述 */
    out  adjustment;
  /** quantity 的描述 */
    quantity: number;
  /** reason 的描述 */
    reason: string;
  /** operator 的描述 */
    operator: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** batchNumber 的描述 */
    batchNumber: string;
  /** notes 的描述 */
    notes: string;
}

// 健康商品相关的类型定义
export type HealthProductType =
  any; // 急救用品

// 健康商品规格
export interface IHealthProductSpec {
   
  /** approvalNumber 的描述 */
    approvalNumber: string;  
  /** manufacturer 的描述 */
    manufacturer: string;  
  /** producingArea 的描述 */
    producingArea: string;  
  /** specification 的描述 */
    specification: string;  

   
  /** usage 的描述 */
    usage: string;  
  /** dosage 的描述 */
    dosage: string;  
  /** indications 的描述 */
    indications: string;  
  /** contraindications 的描述 */
    contraindications: string;  
  /** sideEffects 的描述 */
    sideEffects: string;  

   
  /** storageConditions 的描述 */
    storageConditions: string;  
  /** shelfLife 的描述 */
    shelfLife: string;  

   
  /** ingredients 的描述 */
    ingredients: string;  
  /** warnings 的描述 */
    warnings: string;  
  /** precautions 的描述 */
    precautions: string;  
}

// 健康商品认证
export interface IHealthCertification {
  /** type 的描述 */
    type: FDA  CE  ISO  CFDA  Other;
  number: string;
  issueDate: Date;
  expiryDate: Date;
  issuingBody: string;
  scope: string;
}

// 扩展商品接口
export interface IHealthProduct extends IProduct {
  /** type 的描述 */
    type: "medicine" | "medical_device" | "health_monitor" | "rehabilitation" | "protective" | "first_aid";
  /** healthSpec 的描述 */
    healthSpec: IHealthProductSpec;
  /** certifications 的描述 */
    certifications: IHealthCertification[];
  /** prescriptionRequired 的描述 */
    prescriptionRequired: false | true;
  /** insuranceCovered 的描述 */
    insuranceCovered: false | true;

  // 健康相关元数据
  /** healthMetadata 的描述 */
    healthMetadata: {
    effectivenessRating: number;
    safetyRating: number;
    professionalReviews: number;
    clinicalTrials?: Array<{
      id: string;
      result: string;
      date: Date;
    }>;
  };
}

// 健康商品订单扩展
export interface IHealthOrder extends IOrder {
  /** prescriptionId 的描述 */
    prescriptionId?: undefined | string;
  /** insuranceInfo 的描述 */
    insuranceInfo?: undefined | { provider: string; policyNumber: string; coverageAmount: number; claimStatus: "pending" | "approved" | "rejected"; };
  /** medicalNecessity 的描述 */
    medicalNecessity?: undefined | { diagnosis: string; doctorId: string; recommendationDate: Date; };
}

// 健康商品评价扩展
export interface IHealthProductReview extends IProductReview {
  /** effectiveness 的描述 */
    effectiveness: number;
  /** sideEffects 的描述 */
    sideEffects: string[];
  /** usageDuration 的描述 */
    usageDuration: string;
  /** condition 的描述 */
    condition: string;
  /** verifiedByHealthcare 的描述 */
    verifiedByHealthcare: false | true;
  /** professionalReview 的描述 */
    professionalReview?: undefined | { doctorId: string; speciality: string; review: string; recommendation: "recommended" | "neutral" | "not_recommended"; };
}

// 健康商品促销扩展
export interface IHealthPromotion extends IPromotion {
  /** healthConditions 的描述 */
    healthConditions?: undefined | string[];
  /** seasonalFactors 的描述 */
    seasonalFactors?: undefined | string[];
  /** insuranceDiscount 的描述 */
    insuranceDiscount?: undefined | { providers: string[]; discountRate: number; };
  /** professionalEndorsement 的描述 */
    professionalEndorsement?: undefined | { doctorId: string; speciality: string; endorsementDate: Date; content: string; };
}

// 健康商品库存扩展
export interface IHealthStockHistory extends IStockHistory {
  /** batchInfo 的描述 */
    batchInfo: {
    number: string;
    productionDate: Date;
    expiryDate: Date;
    manufacturer: string;
  };
  /** qualityCheck 的描述 */
    qualityCheck: {
    inspectorId: string;
    date: Date;
    result: 'passed' | 'failed';
    notes?: string;
  };
  /** storageConditions 的描述 */
    storageConditions: {
    temperature: string;
    humidity: string;
    lightExposure: string;
  };
}

// 健康商品退换货
export interface IHealthProductReturn {
  /** orderId 的描述 */
    orderId: string;
  /** productId 的描述 */
    productId: string;
  /** reason 的描述 */
    reason: string;
  /** condition 的描述 */
    condition: string;
  /** qualityIssue 的描述 */
    qualityIssue: {
    type: string;
    description: string;
    images: string;
  };
  /** healthImpact 的描述 */
    healthImpact?: undefined | { description: string; severity: "mild" | "moderate" | "severe"; reportedSymptoms: string[]; };
  /** returnApproval 的描述 */
    returnApproval?: undefined | { approvedBy: string; date: Date; notes: string; };
}

// 健康商品咨询
export interface IHealthProductInquiry {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** productId 的描述 */
    productId: string;
  /** type 的描述 */
    type: usage  safety  effectiveness  insurance  other;
  question: string;
  createdAt: Date;
  status: pending  answered  escalated;

   
  professionalResponse: {
    responderId: string;
    speciality: string;
    response: string;
    responseDate: Date;
    references: string;
  };

  // 追加问题
  followUps?: Array<{
    question: string;
    response: string;
    date: Date;
  }>;
}
