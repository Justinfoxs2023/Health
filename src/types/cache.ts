export interface CacheOptions {
  local: {
    enabled: boolean;
    maxSize: number;
    ttl: number;
  };
  memory: {
    enabled: boolean;
    maxItems: number;
    ttl: number;
  };
  redis: {
    enabled: boolean;
    maxMemory: string;
    evictionPolicy: string;
    keyPrefix: string;
  };
} 