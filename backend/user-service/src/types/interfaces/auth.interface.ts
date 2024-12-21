import { IDeviceInfo } from './device.interface';

export interface IAuthToken {
  /** accessToken 的描述 */
  accessToken: string;
  /** refreshToken 的描述 */
  refreshToken: string;
  /** expiresIn 的描述 */
  expiresIn: number;
}

export interface ITokenPayload {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** roles 的描述 */
  roles: string[];
  /** permissions 的描述 */
  permissions?: string[];
}

export interface ILoginDTO {
  /** email 的描述 */
  email: string;
  /** password 的描述 */
  password: string;
  /** deviceInfo 的描述 */
  deviceInfo?: {
    type: string;
    os: string;
    browser?: string;
    deviceId?: string;
  };
}
