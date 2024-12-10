declare namespace Social {
  // 社交平台类型
  type DomesticPlatform = 'wechat' | 'weibo' | 'qq' | 'alipay' | 'dingtalk';
  type InternationalPlatform = 'google' | 'facebook' | 'apple' | 'github';
  type Platform = DomesticPlatform | InternationalPlatform;

  // 社交登录配置
  interface LoginConfig {
    platform: Platform;
    appId: string;
    scope: string[];
    redirectUri: string;
    state?: string;
    region?: 'domestic' | 'international';
  }

  // 社交登录响应
  interface LoginResponse {
    platform: Platform;
    code: string;
    state?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    userInfo?: {
      id: string;
      nickname?: string;
      avatar?: string;
      email?: string;
      gender?: 'male' | 'female' | 'unknown';
      country?: string;
      province?: string;
      city?: string;
      language?: string;
    };
  }

  // 社交分享配置
  interface ShareConfig {
    platform: Platform;
    title: string;
    description?: string;
    url: string;
    image?: string;
    miniProgram?: {
      appId: string;
      path: string;
      type: 'release' | 'trial' | 'develop';
    };
  }

  // 平台图标配置
  interface PlatformIconProps {
    platform: Platform;
    size?: number | string;
    color?: string;
    className?: string;
    onClick?: () => void;
  }

  // 分享内容
  interface ShareContent {
    title: string;
    description: string;
    url: string;
    image?: string;
  }

  // 平台配置
  interface PlatformConfig {
    name: string;
    icon: string;
    authUrl: string;
    region: 'domestic' | 'international';
    scopes: string[];
    color?: string;
  }
}

export = Social; 