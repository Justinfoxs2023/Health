// 系统配置更新
interface SystemConfig {
  // 新增模块配置
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