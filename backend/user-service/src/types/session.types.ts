/**
 * @fileoverview TS 文件 session.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ISession {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** deviceInfo 的描述 */
  deviceInfo: IDeviceInfo;
  /** createdAt 的描述 */
  createdAt: Date;
  /** lastActivityAt 的描述 */
  lastActivityAt: Date;
}

export interface IDeviceInfo {
  /** type 的描述 */
  type: string;
  /** name 的描述 */
  name: string;
  /** os 的描述 */
  os: string;
  /** browser 的描述 */
  browser?: string;
  /** ip 的描述 */
  ip: string;
}
