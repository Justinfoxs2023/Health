/**
 * @fileoverview TS 文件 mall.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 商品类型定义
export interface IProduct {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** price 的描述 */
  price: number;
  /** originalPrice 的描述 */
  originalPrice?: number;
  /** images 的描述 */
  images: string[];
  /** category 的描述 */
  category: ProductCategory;
  /** tags 的描述 */
  tags: string[];
  /** specs 的描述 */
  specs: IProductSpec[];
  /** stock 的描述 */
  stock: number;
  /** sales 的描述 */
  sales: number;
  /** rating 的描述 */
  rating: number;
  /** relatedContent 的描述 */
  relatedContent?: {
    dietPlans?: string[]; // 关联的饮食方案ID
    posts?: string[]; // 关联的社区分享ID
  };
}

// 商品分类
export enum ProductCategory {
  FOOD = 'food', // 健康食品
  SUPPLEMENT = 'supplement', // 营养补充剂
  EQUIPMENT = 'equipment', // 运动器材
  WEARABLE = 'wearable', // 可穿戴设备
  BOOK = 'book', // 健康图书
}

// 商品规格
export interface IProductSpec {
  /** name 的描述 */
  name: string;
  /** options 的描述 */
  options: {
    id: string;
    value: string;
    price: number;
    stock: number;
  }[];
}

// 购物车项
export interface ICartItem {
  /** productId 的描述 */
  productId: string;
  /** specId 的描述 */
  specId: string;
  /** quantity 的描述 */
  quantity: number;
  /** selected 的描述 */
  selected: boolean;
}
