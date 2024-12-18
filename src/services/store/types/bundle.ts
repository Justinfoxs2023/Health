/**
 * @fileoverview TS 文件 bundle.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 商品套装
export interface IProductBundle {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** products 的描述 */
    products: Array{
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
