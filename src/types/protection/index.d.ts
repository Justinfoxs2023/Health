declare module 'protection' {
  export interface ProtectionConfig {
    encryption: {
      enabled: boolean;
      algorithm: string;
    };
    backup: {
      enabled: boolean;
      interval: number;
    };
  }
} 