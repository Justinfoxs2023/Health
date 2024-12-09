// 商品分类
export type ProductCategory = 
  | 'health_food'      // 健康食品
  | 'supplement'       // 营养补充剂
  | 'equipment'        // 健康设备
  | 'service'          // 健康服务
  | 'traditional'      // 传统保健
  | 'personal_care';   // 个人护理

// 商品类型
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  tags: string[];
  specifications: {
    weight?: number;
    size?: string;
    usage?: string;
    ingredients?: string[];
    effect?: string[];
    shelfLife?: string;
    storage?: string;
    warnings?: string[];
  };
  ratings: {
    average: number;
    count: number;
    details: {
      [key: number]: number; // 1-5星评分分布
    };
  };
  metadata: {
    views: number;
    sales: number;
    favorites: number;
    lastRestocked?: Date;
    recommendationScore?: number;
  };
  relatedProducts: string[];
  healthLabels: string[];
  certifications: string[];
  manufacturer: {
    name: string;
    license?: string;
    contact?: string;
  };
}

// 地址信息
export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
  tag?: 'home' | 'office' | 'other';
}

// 支付信息
export interface PaymentInfo {
  id: string;
  method: 'alipay' | 'wechat' | 'creditcard';
  status: 'pending' | 'success' | 'failed';
  amount: number;
  currency: string;
  transactionId?: string;
  paidAt?: Date;
  refundStatus?: 'none' | 'partial' | 'full';
  refundAmount?: number;
}

// 物流信息
export interface LogisticsInfo {
  trackingNumber: string;
  carrier: string;
  status: 'pending' | 'shipping' | 'delivered' | 'returned';
  timeline: Array<{
    status: string;
    timestamp: Date;
    location?: string;
    description?: string;
  }>;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  signedBy?: string;
}

// 订单类型
export interface Order {
  id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    discount?: number;
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
export interface Cart {
  userId: string;
  items: Array<{
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
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  content: string;
  images?: string[];
  tags: string[];
  likes: number;
  createdAt: Date;
  updatedAt?: Date;
  reply?: {
    content: string;
    createdAt: Date;
    isOfficial: boolean;
  };
  verifiedPurchase: boolean;
}

// 促销活动
export interface Promotion {
  id: string;
  type: 'discount' | 'coupon' | 'gift' | 'bundle';
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  conditions: {
    minAmount?: number;
    productIds?: string[];
    categories?: ProductCategory[];
    userLevel?: string[];
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
export interface ProductFavorite {
  userId: string;
  productId: string;
  addedAt: Date;
  notifyOnSale: boolean;
  notifyOnRestock: boolean;
}

// 商品库存变更记录
export interface StockHistory {
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  operator: string;
  timestamp: Date;
  batchNumber?: string;
  notes?: string;
}

// 健康商品相关的类型定义
export type HealthProductType = 
  | 'medicine'         // 药品
  | 'medical_device'   // 医疗器械
  | 'health_monitor'   // 健康监测设备
  | 'rehabilitation'   // 康复器材
  | 'protective'       // 防护用品
  | 'first_aid';       // 急救用品

// 健康商品规格
export interface HealthProductSpec {
  // 基础信息
  approvalNumber?: string;    // 批准文号
  manufacturer: string;       // 生产厂家
  producingArea: string;     // 产地
  specification: string;     // 规格
  
  // 使用信息
  usage: string;            // 使用方法
  dosage?: string;         // 用量用法
  indications?: string[];  // 适应症
  contraindications?: string[]; // 禁忌症
  sideEffects?: string[];  // 副作用
  
  // 储存信息
  storageConditions: string; // 储存条件
  shelfLife: string;        // 保质期
  
  // 其他信息
  ingredients?: string[];   // 成分
  warnings?: string[];     // 警告信息
  precautions?: string[];  // 注意事项
}

// 健康商品认证
export interface HealthCertification {
  type: 'FDA' | 'CE' | 'ISO' | 'CFDA' | 'Other';
  number: string;
  issueDate: Date;
  expiryDate: Date;
  issuingBody: string;
  scope: string[];
}

// 扩展商品接口
export interface HealthProduct extends Product {
  type: HealthProductType;
  healthSpec: HealthProductSpec;
  certifications: HealthCertification[];
  prescriptionRequired: boolean;
  insuranceCovered: boolean;
  
  // 健康相关元数据
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
export interface HealthOrder extends Order {
  prescriptionId?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    claimStatus: 'pending' | 'approved' | 'rejected';
  };
  medicalNecessity?: {
    diagnosis: string;
    doctorId: string;
    recommendationDate: Date;
  };
}

// 健康商品评价扩展
export interface HealthProductReview extends ProductReview {
  effectiveness: number;
  sideEffects: string[];
  usageDuration: string;
  condition: string;
  verifiedByHealthcare: boolean;
  professionalReview?: {
    doctorId: string;
    speciality: string;
    review: string;
    recommendation: 'recommended' | 'neutral' | 'not_recommended';
  };
}

// 健康商品促销扩展
export interface HealthPromotion extends Promotion {
  healthConditions?: string[];
  seasonalFactors?: string[];
  insuranceDiscount?: {
    providers: string[];
    discountRate: number;
  };
  professionalEndorsement?: {
    doctorId: string;
    speciality: string;
    endorsementDate: Date;
    content: string;
  };
}

// 健康商品库存扩展
export interface HealthStockHistory extends StockHistory {
  batchInfo: {
    number: string;
    productionDate: Date;
    expiryDate: Date;
    manufacturer: string;
  };
  qualityCheck: {
    inspectorId: string;
    date: Date;
    result: 'passed' | 'failed';
    notes?: string;
  };
  storageConditions: {
    temperature: string;
    humidity: string;
    lightExposure: string;
  };
}

// 健康商品退换货
export interface HealthProductReturn {
  orderId: string;
  productId: string;
  reason: string;
  condition: string;
  qualityIssue?: {
    type: string;
    description: string;
    images?: string[];
  };
  healthImpact?: {
    description: string;
    severity: 'mild' | 'moderate' | 'severe';
    reportedSymptoms: string[];
  };
  returnApproval?: {
    approvedBy: string;
    date: Date;
    notes: string;
  };
}

// 健康商品咨询
export interface HealthProductInquiry {
  id: string;
  userId: string;
  productId: string;
  type: 'usage' | 'safety' | 'effectiveness' | 'insurance' | 'other';
  question: string;
  createdAt: Date;
  status: 'pending' | 'answered' | 'escalated';
  
  // 专业回答
  professionalResponse?: {
    responderId: string;
    speciality: string;
    response: string;
    responseDate: Date;
    references?: string[];
  };
  
  // 追加问题
  followUps?: Array<{
    question: string;
    response: string;
    date: Date;
  }>;
} 