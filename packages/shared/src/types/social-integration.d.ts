/**
 * @fileoverview TS 文件 social-integration.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 社交平台集成配置
export interface ISocialPlatformConfig {
  // 平台基础配置
  /** platforms 的描述 */
  platforms: {
    [key in SocialPlatformType]: IPlatformConfig;
  };

  // 功能开关配置
  /** features 的描述 */
  features: {
    login: boolean;
    share: boolean;
    comments: boolean;
    follow: boolean;
  };

  // 数据同步设置
  /** syncSettings 的描述 */
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
  APPLE = 'apple',
}

// 平台具体配置
export interface IPlatformConfig {
  /** enabled 的描述 */
  enabled: boolean;
  /** appId 的描述 */
  appId: string;
  /** appSecret 的描述 */
  appSecret: string;
  /** redirectUri 的描述 */
  redirectUri: string;
  /** scope 的描述 */
  scope: string[];
  /** apiVersion 的描述 */
  apiVersion: string;
  /** features 的描述 */
  features: PlatformFeature[];
}

// 数据同步类型
export enum SyncDataType {
  PROFILE = 'profile',
  ACTIVITIES = 'activities',
  HEALTH_DATA = 'healthData',
  ACHIEVEMENTS = 'achievements',
}
