export interface DeviceInfo {
  type: string;
  os: string;
  browser?: string;
  deviceId?: string;
  model?: string;
  platform?: string;
  version?: string;
  manufacturer?: string;
}

export interface DeviceSession {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
} 