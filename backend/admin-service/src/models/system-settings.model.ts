export interface SystemSettings {
  security: {
    passwordPolicy: {
      minLength: number;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      requireUppercase: boolean;
      maxLoginAttempts: number;
    };
    sessionTimeout: number;
    tokenExpiry: {
      access: number;
      refresh: number;
    };
  };
  notifications: {
    email: {
      enabled: boolean;
      provider: string;
      from: string;
    };
    push: {
      enabled: boolean;
      provider: string;
    };
  };
  features: {
    socialLogin: {
      google: boolean;
      apple: boolean;
      wechat: boolean;
    };
    healthTracking: {
      steps: boolean;
      heartRate: boolean;
      sleep: boolean;
      nutrition: boolean;
    };
  };
} 