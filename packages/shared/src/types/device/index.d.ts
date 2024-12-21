/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 设备类型定义
export interface IDevice {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: DeviceType;
  /** name 的描述 */
  name: string;
  /** manufacturer 的描述 */
  manufacturer: string;
  /** model 的描述 */
  model: string;
  /** serialNumber 的描述 */
  serialNumber: string;
  /** firmwareVersion 的描述 */
  firmwareVersion: string;
  /** status 的描述 */
  status: DeviceStatusType;
  /** connectionInfo 的描述 */
  connectionInfo: IConnectionInfo;
  /** capabilities 的描述 */
  capabilities: IDeviceCapability[];
  /** lastSync 的描述 */
  lastSync?: Date;
}

// 设备类型
export type DeviceType =
  | 'smartwatch' // 智能手表
  | 'fitnessBand' // 健身手环
  | 'bloodPressure' // 血压计
  | 'glucoseMeter' // 血糖仪
  | 'heartRateMonitor' // 心率监测器
  | 'sleepMonitor' // 睡眠监测器
  | 'ecgMonitor' // 心电监测器
  | 'thermometer'; // 体温计

// 设备状态
export type DeviceStatusType =
  | 'connected' // 已连接
  | 'disconnected' // 已断开
  | 'pairing' // 配对中
  | 'error' // 错误
  | 'lowBattery'; // 低电量

// 连接信息
export interface IConnectionInfo {
  /** protocol 的描述 */
  protocol: 'bluetooth' | 'wifi' | 'usb';
  /** address 的描述 */
  address: string;
  /** signal 的描述 */
  signal?: number;
  /** battery 的描述 */
  battery?: number;
  /** lastConnected 的描述 */
  lastConnected?: Date;
}

// 设备能力
export interface IDeviceCapability {
  /** type 的描述 */
  type: string;
  /** metrics 的描述 */
  metrics: string[];
  /** sampleRate 的描述 */
  sampleRate: number;
  /** accuracy 的描述 */
  accuracy: number;
  /** unit 的描述 */
  unit: string;
}
