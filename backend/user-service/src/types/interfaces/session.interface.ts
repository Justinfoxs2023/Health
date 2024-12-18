import { IDeviceInfo } from './device.interface';

export interface ISession {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** deviceInfo 的描述 */
  deviceInfo: IDeviceInfo;
  /** token 的描述 */
  token: string;
  /** refreshToken 的描述 */
  refreshToken: string;
  /** expiresAt 的描述 */
  expiresAt: Date;
  /** lastActive 的描述 */
  lastActive: Date;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

export interface ISessionMetadata {
  /** ip 的描述 */
  ip?: string;
  /** userAgent 的描述 */
  userAgent?: string;
  /** location 的描述 */
  location?: {
    country?: string;
    city?: string;
  };
}

export interface IActiveSession {
  /** id 的描述 */
  id: string;
  /** deviceInfo 的描述 */
  deviceInfo: IDeviceInfo;
  /** metadata 的描述 */
  metadata: ISessionMetadata;
  /** createdAt 的描述 */
  createdAt: Date;
  /** lastActive 的描述 */
  lastActive: Date;
}
