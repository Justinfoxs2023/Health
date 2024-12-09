import type { Social } from '../../types/social';

export const socialAuthConfig: Record<Social.Platform, {
  authType: 'oauth' | 'qrcode';
  name: string;
  clientId: string;
  redirectUri: string;
  scope: string[];
}> = {
  // ... 配置内容
}; 