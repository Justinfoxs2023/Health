import { message } from 'antd';
import { request } from './request';
import * as Social from '../types/social';

const configs: Record<Social.Platform, Social.PlatformConfig> = {
  wechat: {
    name: '微信',
    icon: 'wechat',
    authUrl: 'https://open.weixin.qq.com/connect/qrconnect',
    region: 'domestic',
    scopes: ['snsapi_userinfo'],
    color: '#07C160'
  },
  weibo: {
    name: '微博',
    icon: 'weibo',
    authUrl: 'https://api.weibo.com/oauth2/authorize',
    region: 'domestic',
    scopes: ['email'],
    color: '#E6162D'
  },
  qq: {
    name: 'QQ',
    icon: 'qq',
    authUrl: 'https://graph.qq.com/oauth2.0/authorize',
    region: 'domestic',
    scopes: ['get_user_info'],
    color: '#12B7F5'
  },
  alipay: {
    name: '支付宝',
    icon: 'alipay',
    authUrl: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm',
    region: 'domestic',
    scopes: ['auth_user'],
    color: '#1677FF'
  },
  dingtalk: {
    name: '钉钉',
    icon: 'dingtalk',
    authUrl: 'https://oapi.dingtalk.com/connect/qrconnect',
    region: 'domestic',
    scopes: ['openid'],
    color: '#1890FF'
  },
  google: {
    name: 'Google',
    icon: 'google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    region: 'international',
    scopes: ['profile', 'email'],
    color: '#4285F4'
  },
  facebook: {
    name: 'Facebook',
    icon: 'facebook',
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    region: 'international',
    scopes: ['public_profile', 'email'],
    color: '#1877F2'
  },
  apple: {
    name: 'Apple',
    icon: 'apple',
    authUrl: 'https://appleid.apple.com/auth/authorize',
    region: 'international',
    scopes: ['name', 'email'],
    color: '#000000'
  },
  github: {
    name: 'GitHub',
    icon: 'github',
    authUrl: 'https://github.com/login/oauth/authorize',
    region: 'international',
    scopes: ['user', 'email'],
    color: '#24292F'
  }
};

export const getPlatformName = (platform: Social.Platform): string => {
  return configs[platform].name;
};

export const SocialPlatform = {
  configs,
  getPlatformName,
  getConfig: (platform: Social.Platform) => configs[platform],
  login: async (platform: Social.Platform): Promise<void> => {
    // 实现登录逻辑
  },
  getQrCode: async (platform: Social.Platform): Promise<string> => {
    // 实现获取二维码逻辑
    return '';
  }
}; 