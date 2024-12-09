// 订阅服务
export interface HealthSubscription {
  id: string;
  userId: string;
  plan: {
    type: 'monthly' | 'quarterly' | 'yearly';
    name: string;
    price: number;
    benefits: string[];
  };
  
  products: Array<{
    productId: string;
    quantity: number;
    frequency: 'weekly' | 'monthly';
    nextDeliveryDate: Date;
  }>;
  
  paymentInfo: {
    method: string;
    autoRenewal: boolean;
    nextBillingDate: Date;
  };
  
  status: 'active' | 'paused' | 'cancelled';
  startDate: Date;
  endDate?: Date;
} 