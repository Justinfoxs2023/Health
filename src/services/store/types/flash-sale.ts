// 限时特卖
export interface FlashSale {
  id: string;
  name: string;
  products: Array<{
    productId: string;
    originalPrice: number;
    salePrice: number;
    stock: number;
    soldCount: number;
    limit: number;
  }>;
  
  schedule: {
    startTime: Date;
    endTime: Date;
    reminderTime?: Date;
  };
  
  rules: {
    perUserLimit: number;
    membershipRequired?: boolean;
    newUserOnly?: boolean;
  };
  
  status: 'upcoming' | 'active' | 'ended';
  statistics: {
    viewCount: number;
    orderCount: number;
    conversionRate: number;
  };
} 