export interface SystemSettings {
  security: SecuritySettings;
  notifications: NotificationSettings;
  features: FeatureSettings;
  monitoring: MonitoringSettings;
  storage: StorageSettings;
  ai: AISettings;
}

export interface SecuritySettings {
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
  ipWhitelist: string[];
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    provider: string;
    from: string;
    templates: Record<string, string>;
  };
  push: {
    enabled: boolean;
    provider: string;
    config: Record<string, any>;
  };
  sms: {
    enabled: boolean;
    provider: string;
    templates: Record<string, string>;
  };
}

export interface FeatureSettings {
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
  premium: {
    enabled: boolean;
    features: string[];
  };
}

export interface MonitoringSettings {
  performance: {
    enabled: boolean;
    sampleRate: number;
    errorThreshold: number;
  };
  health: {
    enabled: boolean;
    checkInterval: number;
    endpoints: string[];
  };
  alerts: {
    channels: string[];
    thresholds: Record<string, number>;
  };
}

export interface StorageSettings {
  provider: string;
  region: string;
  bucket: string;
  maxFileSize: number;
  allowedTypes: string[];
  compression: {
    enabled: boolean;
    quality: number;
  };
}

export interface AISettings {
  imageRecognition: {
    enabled: boolean;
    provider: string;
    minConfidence: number;
  };
  healthAssessment: {
    enabled: boolean;
    updateFrequency: string;
    models: string[];
  };
  recommendations: {
    enabled: boolean;
    algorithms: string[];
    weights: Record<string, number>;
  };
} 