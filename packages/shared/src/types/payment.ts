/**
 * @fileoverview TS 文件 payment.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export enum PaymentMethod {
  WECHAT = 'wechat',
  ALIPAY = 'alipay',
  CREDITCARD = 'creditcard',
  BANK = 'bank',
}

export interface IPaymentTransaction {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** amount 的描述 */
  amount: number;
  /** method 的描述 */
  method: PaymentMethod;
  /** status 的描述 */
  status: TransactionStatus;
  /** description 的描述 */
  description: string;
  /** metadata 的描述 */
  metadata: any;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

export interface Invoice {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** items 的描述 */
  items: InvoiceItem[];
  /** amounts 的描述 */
  amounts: {
    subtotal: number;
    tax: number;
    total: number;
  };
  /** status 的描述 */
  status: InvoiceStatus;
  /** dueDate 的描述 */
  dueDate: Date;
  /** createdAt 的描述 */
  createdAt: Date;
}
