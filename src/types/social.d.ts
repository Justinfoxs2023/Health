/**
 * @fileoverview TS 文件 social.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare namespace Social {
  // 社交平台类型
  type DomesticPlatform = 'wechat' | 'weibo' | 'qq' | 'alipay' | 'dingtalk';
  type InternationalPlatform = 'google' | 'facebook' | 'apple' | 'github';
  type Platform = DomesticPlatform | InternationalPlatform;

  // 社交登录配置
  interface LoginConfig {
    platform: Platform;
    appId: string;
    scope: string;
    redirectUri: string;
    state: string;
    region: domestic  international;
  }

  // 社交登录响应
  interface LoginResponse {
    platform: Platform;
    code: string;
    state: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    userInfo: {
      id: string;
      nickname: string;
      avatar: string;
      email: string;
      gender: male  female  unknown;
      country: string;
      province: string;
      city: string;
      language: string;
    };
  }

  // 社交分享配置
  interface IShareConfig {
    /** platform 的描述 */
      platform: Platform;
    /** title 的描述 */
      title: string;
    /** description 的描述 */
      description: string;
    /** url 的描述 */
      url: string;
    /** image 的描述 */
      image: string;
    /** miniProgram 的描述 */
      miniProgram: {
      appId: string;
      path: string;
      type: release  trial  develop;
    };
  }

  // 平台图标配置
  interface IPlatformIconProps {
    /** platform 的描述 */
      platform: Platform;
    /** size 的描述 */
      size: number  /** string 的描述 */
      /** string 的描述 */
      string;
    /** color 的描述 */
      color: string;
    /** className 的描述 */
      className: string;
    /** onClick 的描述 */
      onClick:   void;
  }

  // 分享内容
  interface IShareContent {
    /** title 的描述 */
      title: string;
    /** description 的描述 */
      description: string;
    /** url 的描述 */
      url: string;
    /** image 的描述 */
      image: string;
  }

  // 平台配置
  interface IPlatformConfig {
    /** name 的描述 */
      name: string;
    /** icon 的描述 */
      icon: string;
    /** authUrl 的描述 */
      authUrl: string;
    /** region 的描述 */
      region: domestic  /** international 的描述 */
      /** international 的描述 */
      international;
    /** scopes 的描述 */
      scopes: string;
    /** color 的描述 */
      color: string;
  }
}

export = Social;
