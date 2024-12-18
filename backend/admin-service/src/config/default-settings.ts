import { ISystemSettings } from '../types/system-settings';

export const defaultSettings: ISystemSettings = {
  security: {
    passwordPolicy: {
      minLength: 8,
      requireNumbers: true,
      requireSpecialChars: true,
      requireUppercase: true,
      maxLoginAttempts: 5,
    },
    sessionTimeout: 3600,
    tokenExpiry: {
      access: 3600,
      refresh: 604800,
    },
    ipWhitelist: [],
  },
  notifications: {
    email: {
      enabled: true,
      provider: 'smtp',
      from: 'noreply@health-app.com',
      templates: {},
    },
    push: {
      enabled: true,
      provider: 'firebase',
      config: {},
    },
    sms: {
      enabled: false,
      provider: 'aliyun',
      templates: {},
    },
  },
  features: {
    socialLogin: {
      google: true,
      apple: true,
      wechat: true,
    },
    healthTracking: {
      steps: true,
      heartRate: true,
      sleep: true,
      nutrition: true,
    },
    premium: {
      enabled: false,
      features: [],
    },
  },
  monitoring: {
    performance: {
      enabled: true,
      sampleRate: 0.1,
      errorThreshold: 1000,
    },
    health: {
      enabled: true,
      checkInterval: 60,
      endpoints: [],
    },
    alerts: {
      channels: ['email'],
      thresholds: {},
    },
  },
  storage: {
    provider: 's3',
    region: 'us-east-1',
    bucket: 'health-app',
    maxFileSize: 10485760,
    allowedTypes: ['image/jpeg', 'image/png'],
    compression: {
      enabled: true,
      quality: 80,
    },
  },
  ai: {
    imageRecognition: {
      enabled: true,
      provider: 'tensorflow',
      minConfidence: 0.8,
    },
    healthAssessment: {
      enabled: true,
      updateFrequency: 'daily',
      models: [],
    },
    recommendations: {
      enabled: true,
      algorithms: ['collaborative', 'content-based'],
      weights: {},
    },
  },
};
