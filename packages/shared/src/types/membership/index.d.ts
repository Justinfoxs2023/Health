declare module 'membership' {
  export interface MembershipConfig {
    levels: string[];
    features: Record<string, boolean>;
    pricing: Record<string, number>;
  }
} 