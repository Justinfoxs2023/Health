// 设备集成类型定义
interface DeviceIntegrationTypes {
  // 设备配置
  DeviceConfig {
    id: string;
    type: 'BLE' | 'WiFi';
    name: string;
    protocol: string;
    priority: number;
  }

  // 健康数据
  HealthData {
    deviceId: string;
    timestamp: number;
    metrics: {
      heartRate?: number;
      bloodPressure?: {
        systolic: number;
        diastolic: number;
      };
      bloodOxygen?: number;
      temperature?: number;
    }
  }
} 