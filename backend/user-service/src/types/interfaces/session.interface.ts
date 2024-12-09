import { DeviceInfo } from './device.interface';

export interface Session {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionMetadata {
  ip?: string;
  userAgent?: string;
  location?: {
    country?: string;
    city?: string;
  };
}

export interface ActiveSession {
  id: string;
  deviceInfo: DeviceInfo;
  metadata: SessionMetadata;
  createdAt: Date;
  lastActive: Date;
} 