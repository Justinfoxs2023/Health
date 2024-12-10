// 设备类型定义
export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  status: DeviceStatus;
  connectionInfo: ConnectionInfo;
  capabilities: DeviceCapability[];
  lastSync?: Date;
}

// 设备类型
export type DeviceType = 
  | 'smartwatch'      // 智能手表
  | 'fitnessBand'     // 健身手环
  | 'bloodPressure'   // 血压计
  | 'glucoseMeter'    // 血糖仪
  | 'heartRateMonitor'// 心率监测器
  | 'sleepMonitor'    // 睡眠监测器
  | 'ecgMonitor'      // 心电监测器
  | 'thermometer';    // 体温计

// 设备状态
export type DeviceStatus = 
  | 'connected'     // 已连接
  | 'disconnected'  // 已断开
  | 'pairing'       // 配对中
  | 'error'         // 错误
  | 'lowBattery';   // 低电量

// 连接信息
export interface ConnectionInfo {
  protocol: 'bluetooth' | 'wifi' | 'usb';
  address: string;
  signal?: number;
  battery?: number;
  lastConnected?: Date;
}

// 设备能力
export interface DeviceCapability {
  type: string;
  metrics: string[];
  sampleRate: number;
  accuracy: number;
  unit: string;
} 