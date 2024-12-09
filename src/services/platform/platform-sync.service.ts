import { Logger } from '../../utils/logger';
import { 
  PlatformType, 
  PlatformConfig, 
  AuthInfo, 
  SyncConfig 
} from '../../types/platform';
import { HealthData } from '../../types/health';

export class PlatformSyncService {
  private logger: Logger;
  private platformConfigs: Map<PlatformType, PlatformConfig>;
  private authCache: Map<string, AuthInfo>;

  constructor() {
    this.logger = new Logger('PlatformSync');
    this.initializePlatformConfigs();
  }

  // 同步平台数据
  async syncPlatformData(
    userId: string,
    platform: PlatformType,
    config: SyncConfig
  ): Promise<HealthData[]> {
    try {
      // 1. 验证授权
      const authInfo = await this.validateAuth(userId, platform);
      
      // 2. 获取数据
      const platformData = await this.fetchPlatformData(authInfo, config);
      
      // 3. 转换数据格式
      const healthData = await this.transformPlatformData(platformData, platform);
      
      // 4. 更新同步状态
      await this.updateSyncStatus(userId, platform);
      
      return healthData;
    } catch (error) {
      this.logger.error('平台数据同步失败', error);
      throw error;
    }
  }

  // 配置平台授权
  async configurePlatform(
    userId: string,
    platform: PlatformType,
    authCode: string
  ): Promise<void> {
    try {
      // 1. 获取平台配置
      const config = this.platformConfigs.get(platform);
      if (!config) {
        throw new Error(`不支持的平台: ${platform}`);
      }

      // 2. 获取访问令牌
      const authInfo = await this.getAccessToken(authCode, config);
      
      // 3. 保存授权信息
      await this.saveAuthInfo(userId, platform, authInfo);
      
      // 4. 初始化同步配置
      await this.initializeSyncConfig(userId, platform);
    } catch (error) {
      this.logger.error('平台配置失败', error);
      throw error;
    }
  }

  // 刷新授权令牌
  private async refreshAuth(
    userId: string,
    platform: PlatformType
  ): Promise<AuthInfo> {
    try {
      const authInfo = this.authCache.get(`${userId}:${platform}`);
      if (!authInfo?.refreshToken) {
        throw new Error('无效的刷新令牌');
      }

      const config = this.platformConfigs.get(platform);
      const newAuthInfo = await this.refreshAccessToken(
        authInfo.refreshToken,
        config
      );

      await this.saveAuthInfo(userId, platform, newAuthInfo);
      return newAuthInfo;
    } catch (error) {
      this.logger.error('刷新授权失败', error);
      throw error;
    }
  }
} 