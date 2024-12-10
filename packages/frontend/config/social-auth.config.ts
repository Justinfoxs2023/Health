export const socialAuthConfig = {
  wechat: {
    name: '微信',
    icon: 'wechat',
    color: '#07C160',
    authUrl: 'https://open.weixin.qq.com/connect/qrconnect',
    scopes: ['snsapi_userinfo'],
    description: '使用微信扫码登录，安全快捷',
    authType: 'qrcode' as const,
    instructions: [
      '打开微信APP',
      '点击右上角"+"号',
      '选择"扫一扫"',
      '扫描二维码完成授权'
    ]
  },
  qq: {
    name: 'QQ',
    icon: 'qq',
    color: '#12B7F5',
    authUrl: 'https://graph.qq.com/oauth2.0/authorize',
    scopes: ['get_user_info'],
    description: '使用QQ账号一键登录',
    authType: 'popup' as const,
    instructions: [
      '点击QQ图标',
      '在弹出窗口中登录QQ',
      '确认授权信息'
    ]
  },
  weibo: {
    name: '微博',
    icon: 'weibo',
    color: '#E6162D',
    authUrl: 'https://api.weibo.com/oauth2/authorize',
    scopes: ['email'],
    description: '使用微博账号登录',
    authType: 'redirect' as const,
    instructions: [
      '点击微博图标',
      '登录微博账号',
      '确认授权请求'
    ]
  },
  google: {
    name: 'Google',
    icon: 'google',
    color: '#4285F4',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: ['profile', 'email'],
    description: 'Sign in with Google',
    authType: 'popup' as const,
    instructions: [
      'Click Google icon',
      'Select your Google account',
      'Review and accept permissions'
    ]
  },
  facebook: {
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    scopes: ['public_profile', 'email'],
    description: 'Continue with Facebook',
    authType: 'popup' as const,
    instructions: [
      'Click Facebook icon',
      'Login to Facebook',
      'Review permissions'
    ]
  },
  apple: {
    name: 'Apple',
    icon: 'apple',
    color: '#000000',
    authUrl: 'https://appleid.apple.com/auth/authorize',
    scopes: ['name', 'email'],
    description: 'Sign in with Apple',
    authType: 'redirect' as const,
    instructions: [
      'Click Apple icon',
      'Sign in with your Apple ID',
      'Review and confirm'
    ]
  }
} as const;

export type SocialPlatform = keyof typeof socialAuthConfig;
export type AuthType = typeof socialAuthConfig[SocialPlatform]['authType']; 