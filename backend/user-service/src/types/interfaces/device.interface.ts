/**
 * @fileoverview TS 文件 device.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IDeviceInfo {
  /** type 的描述 */
  type: string;
  /** os 的描述 */
  os: string;
  /** browser 的描述 */
  browser?: string;
  /** deviceId 的描述 */
  deviceId?: string;
  /** model 的描述 */
  model?: string;
  /** platform 的描述 */
  platform?: string;
  /** version 的描述 */
  version?: string;
  /** manufacturer 的描述 */
  manufacturer?: string;
}

export interface IDeviceSession {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** deviceInfo 的描述 */
  deviceInfo: IDeviceInfo;
  /** lastActive 的描述 */
  lastActive: Date;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}
