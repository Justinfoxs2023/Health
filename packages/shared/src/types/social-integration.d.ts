// 社交平台集成配置
export interface SocialPlatformConfig {
  // 平台基础配置
  platforms: {
    [key in SocialPlatformType]: PlatformConfig;
  };
  
  // 功能开关配置
  features: {
    login: boolean;
    share: boolean;
    comments: boolean;
    follow: boolean;
  };
  
  // 数据同步设置
  syncSettings: {
    autoSync: boolean;
    syncInterval: number;
    dataTypes: SyncDataType[];
  };
}

// 社交平台类型
export enum SocialPlatformType {
  // 国内平台
  WECHAT = 'wechat',
  WEIBO = 'weibo',
  QQ = 'qq',
  ALIPAY = 'alipay',
  DOUYIN = 'douyin',
  XIAOHONGSHU = 'xiaohongshu',
  
  // 国际平台
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  APPLE = 'apple'
}

// 平台具体配置
export interface PlatformConfig {
  enabled: boolean;
  appId: string;
  appSecret: string;
  redirectUri: string;
  scope: string[];
  apiVersion: string;
  features: PlatformFeature[];
}

// 数据同步类型
export enum SyncDataType {
  PROFILE = 'profile',
  ACTIVITIES = 'activities',
  HEALTH_DATA = 'healthData',
  ACHIEVEMENTS = 'achievements'
} 