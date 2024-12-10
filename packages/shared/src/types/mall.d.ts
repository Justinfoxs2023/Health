// 商品类型定义
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  tags: string[];
  specs: ProductSpec[];
  stock: number;
  sales: number;
  rating: number;
  relatedContent?: {
    dietPlans?: string[]; // 关联的饮食方案ID
    posts?: string[]; // 关联的社区分享ID
  };
}

// 商品分类
export enum ProductCategory {
  FOOD = 'food',           // 健康食品
  SUPPLEMENT = 'supplement', // 营养补充剂
  EQUIPMENT = 'equipment',   // 运动器材
  WEARABLE = 'wearable',    // 可穿戴设备
  BOOK = 'book'             // 健康图书
}

// 商品规格
export interface ProductSpec {
  name: string;
  options: {
    id: string;
    value: string;
    price: number;
    stock: number;
  }[];
}

// 购物车项
export interface CartItem {
  productId: string;
  specId: string;
  quantity: number;
  selected: boolean;
} 