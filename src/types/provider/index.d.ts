declare module 'provider' {
  export interface ProviderConfig {
    services: string[];
    credentials: Record<string, any>;
    endpoints: Record<string, string>;
  }
} 