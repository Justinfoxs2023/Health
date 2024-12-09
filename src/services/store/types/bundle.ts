// 商品套装
export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: Array<{
    productId: string;
    quantity: number;
    originalPrice: number;
    bundlePrice: number;
  }>;
  
  totalOriginalPrice: number;
  bundlePrice: number;
  savingAmount: number;
  savingPercentage: number;
  
  conditions?: {
    minPurchaseAmount?: number;
    membershipLevel?: string[];
    validPeriod?: {
      start: Date;
      end: Date;
    };
  };
  
  type: 'seasonal' | 'health_solution' | 'value_pack';
  targetConditions?: string[];
  recommendedFor?: string[];
} 