import { HealthData } from '../../../types/health';
import { IAuthInfo, ISyncConfig } from '../../../types/platform';
import { Logger } from '../../../utils/logger';
import { PlatformProvider } from './base.provider';

export class WechatProvider implements PlatformProvider {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('WechatProvider');
  }

  // 获取访问令牌
  async getAccessToken(code: string): Promise<IAuthInfo> {
    try {
      const response = await fetch('https://api.weixin.qq.com/sns/oauth2/access_token', {
        method: 'POST',
        body: JSON.stringify({
          appid: process.env.WECHAT_APP_ID,
          secret: process.env.WECHAT_APP_SECRET,
          code,
          grant_type: 'authorization_code',
        }),
      });

      const data = await response.json();
      return this.transformAuthInfo(data);
    } catch (error) {
      this.logger.error('获取微信访问令牌失败', error);
      throw error;
    }
  }

  // 获取运动数据
  async getHealthData(authInfo: IAuthInfo, config: ISyncConfig): Promise<HealthData[]> {
    try {
      const response = await fetch('https://api.weixin.qq.com/sport/getrunningrecords', {
        headers: {
          Authorization: `Bearer ${authInfo.accessToken}`,
        },
        body: JSON.stringify({
          openid: authInfo.platformUserId,
          begin_time: config.startTime?.getTime(),
          end_time: config.endTime?.getTime(),
        }),
      });

      const data = await response.json();
      return this.transformHealthData(data);
    } catch (error) {
      this.logger.error('获取微信运动数据失败', error);
      throw error;
    }
  }
}
