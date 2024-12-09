import { DeviceInfo } from './device.interface';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  id: string;
  userId: string;
  roles: string[];
  permissions?: string[];
}

export interface LoginDTO {
  email: string;
  password: string;
  deviceInfo?: {
    type: string;
    os: string;
    browser?: string;
    deviceId?: string;
  };
} 