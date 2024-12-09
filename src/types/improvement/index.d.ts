declare module 'improvement' {
  export interface ImprovementConfig {
    metrics: string[];
    goals: Record<string, any>;
    tracking: boolean;
  }
} 