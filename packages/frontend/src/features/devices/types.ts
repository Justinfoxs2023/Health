/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 设备集成类型定义
interface IDeviceIntegrationTypes {
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