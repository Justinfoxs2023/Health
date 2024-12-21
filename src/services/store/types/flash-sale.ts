/**
 * @fileoverview TS 文件 flash-sale.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 限时特卖
export interface IFlashSale {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** products 的描述 */
    products: Array{
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
