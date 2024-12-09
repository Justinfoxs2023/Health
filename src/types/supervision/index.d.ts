declare module 'supervision' {
  export interface SupervisionConfig {
    monitoring: {
      enabled: boolean;
      interval: number;
    };
    alerts: {
      enabled: boolean;
      channels: string[];
    };
  }
} 