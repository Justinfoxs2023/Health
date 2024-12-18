/**
 * @fileoverview TS 文件 subscription.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 订阅服务
export interface IHealthSubscription {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** plan 的描述 */
    plan: {
    type: monthly  quarterly  yearly;
    name: string;
    price: number;
    benefits: string;
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
