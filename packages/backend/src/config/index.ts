/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 系统配置更新
interface ISystemConfig {
  // 新增模块配置
  /** modules 的描述 */
  modules: {
    community: {
      enabled: boolean;
      features: {
        posting: boolean;
        interaction: boolean;
        expertQA: boolean;
      };
    };
    deviceIntegration: {
      enabled: boolean;
      supportedDevices: string[];
      syncInterval: number;
    };
    emergency: {
      enabled: boolean;
      autoDetection: boolean;
      notificationMethods: string[];
    };
  };

  // 性能优化配置
  /** performance 的描述 */
  performance: {
    cache: {
      ttl: number;
      maxSize: number;
    };
    realtime: {
      maxConnections: number;
      messageQueueSize: number;
    };
  };
}
