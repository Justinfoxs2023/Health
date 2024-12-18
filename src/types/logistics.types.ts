/**
 * @fileoverview TS 文件 logistics.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ILogisticsProvider {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** code 的描述 */
  code: string;
  /** supportedRegions 的描述 */
  supportedRegions: string;
  /** services 的描述 */
  services: ILogisticsService;
  /** trackingUrlTemplate 的描述 */
  trackingUrlTemplate: string;
}

export interface ILogisticsService {
  /** code 的描述 */
  code: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** estimatedDays 的描述 */
  estimatedDays: number;
  /** price 的描述 */
  price: number;
}

export type ShipmentStatusType = any;

export interface IShipmentStatus {
  /** trackingId 的描述 */
  trackingId: string;
  /** status 的描述 */
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  /** currentLocation 的描述 */
  currentLocation: string;
  /** estimatedDeliveryTime 的描述 */
  estimatedDeliveryTime: Date;
  /** trackingHistory 的描述 */
  trackingHistory: ITrackingRecord;
}

export interface ITrackingRecord {
  /** time 的描述 */
  time: Date;
  /** location 的描述 */
  location: string;
  /** status 的描述 */
  status: string;
  /** description 的描述 */
  description: string;
}

export interface ILogisticsOrder {
  /** id 的描述 */
  id: string;
  /** providerId 的描述 */
  providerId: string;
  /** serviceCode 的描述 */
  serviceCode: string;
  /** trackingNumber 的描述 */
  trackingNumber: string;
  /** sender 的描述 */
  sender: IShippingAddress;
  /** receiver 的描述 */
  receiver: IShippingAddress;
  /** items 的描述 */
  items: IShipmentItem;
  /** status 的描述 */
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

export interface IShippingAddress {
  /** name 的描述 */
  name: string;
  /** phone 的描述 */
  phone: string;
  /** province 的描述 */
  province: string;
  /** city 的描述 */
  city: string;
  /** district 的描述 */
  district: string;
  /** address 的描述 */
  address: string;
  /** zipCode 的描述 */
  zipCode: string;
}

export interface IShipmentItem {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** quantity 的描述 */
  quantity: number;
  /** weight 的描述 */
  weight: number;
  /** volume 的描述 */
  volume: number;
}

export interface ISaleOptions {
  /** price 的描述 */
  price: number;
  /** quantity 的描述 */
  quantity: number;
  /** deliveryMethods 的描述 */
  deliveryMethods: string;
}
