export interface Session {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface DeviceInfo {
  type: string;
  name: string;
  os: string;
  browser?: string;
  ip: string;
} 