import type { Social } from '../types/social';

interface IAuthConfig {
  /** authType 的描述 */
  authType: 'oauth' | 'qrcode';
  /** name 的描述 */
  name: string;
  /** clientId 的描述 */
  clientId: string;
  /** redirectUri 的描述 */
  redirectUri: string;
  /** scope 的描述 */
  scope: string[];
}

export const socialAuthConfig: Record<Social.Platform, IAuthConfig> = {
  wechat: {
    authType: 'qrcode',
    name: '微信',
    clientId: process.env.WECHAT_CLIENT_ID || '',
    redirectUri: '/auth/wechat/callback',
    scope: ['snsapi_userinfo'],
  },
  weibo: {
    authType: 'oauth',
    name: '微博',
    clientId: process.env.WEIBO_CLIENT_ID || '',
    redirectUri: '/auth/weibo/callback',
    scope: ['email'],
  },
  qq: {
    authType: 'oauth',
    name: 'QQ',
    clientId: process.env.QQ_CLIENT_ID || '',
    redirectUri: '/auth/qq/callback',
    scope: ['get_user_info'],
  },
  alipay: {
    authType: 'qrcode',
    name: '支付宝',
    clientId: process.env.ALIPAY_CLIENT_ID || '',
    redirectUri: '/auth/alipay/callback',
    scope: ['auth_user'],
  },
  dingtalk: {
    authType: 'qrcode',
    name: '钉钉',
    clientId: process.env.DINGTALK_CLIENT_ID || '',
    redirectUri: '/auth/dingtalk/callback',
    scope: ['openid'],
  },
  google: {
    authType: 'oauth',
    name: 'Google',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    redirectUri: '/auth/google/callback',
    scope: ['profile', 'email'],
  },
  facebook: {
    authType: 'oauth',
    name: 'Facebook',
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    redirectUri: '/auth/facebook/callback',
    scope: ['public_profile', 'email'],
  },
  apple: {
    authType: 'oauth',
    name: 'Apple',
    clientId: process.env.APPLE_CLIENT_ID || '',
    redirectUri: '/auth/apple/callback',
    scope: ['name', 'email'],
  },
  github: {
    authType: 'oauth',
    name: 'GitHub',
    clientId: process.env.GITHUB_CLIENT_ID || '',
    redirectUri: '/auth/github/callback',
    scope: ['user', 'email'],
  },
};
