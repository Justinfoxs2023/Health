/**
 * @fileoverview TS 文件 inventory.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface InventoryItem {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** type 的描述 */
    type: virtual  /** physical 的描述 */
    /** physical 的描述 */
    physical;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** status 的描述 */
    status: available  on_sale  sold;
  metadata: Recordstring, any;
}

export interface ISaleOptions {
  /** price 的描述 */
    price: number;
  /** deliveryMethods 的描述 */
    deliveryMethods: string;
  /** description 的描述 */
    description: string;
  /** expireAt 的描述 */
    expireAt: Date;
}

export interface ITradeOptions {
  /** deliveryMethod 的描述 */
    deliveryMethod: string;
  /** contactInfo 的描述 */
    contactInfo: {
    phone: string;
    address: string;
  };
  /** paymentMethod 的描述 */
    paymentMethod: string;
}
