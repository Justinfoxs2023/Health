export interface EdgeComputingConfig {
  enabled: boolean;
  dataProcessing: {
    localProcessing: string[];
    cloudProcessing: string[];
  };
  sync: {
    strategy: 'incremental' | 'full';
    interval: number;
    retryAttempts: number;
  };
  storage: {
    maxLocalSize: number;
    priorityData: string[];
  };
} 