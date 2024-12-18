import { IPageConfig, IProfilePageConfig, ITeamPageConfig } from '../../types/web/pages';
import { Logger } from '../../utils/logger';

export class PageConfigService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('PageConfig');
  }

  // 获取个人主页配置
  async getProfilePageConfig(userId: string): Promise<IProfilePageConfig> {
    try {
      // 1. 获取基础配置
      const baseConfig = await this.getBaseConfig('profile');

      // 2. 获取用户自定义配置
      const userConfig = await this.getUserConfig(userId);

      // 3. 合并配置
      const mergedConfig = this.mergeConfigs(baseConfig, userConfig);

      // 4. 验证配置
      await this.validateConfig(mergedConfig);

      return mergedConfig;
    } catch (error) {
      this.logger.error('获取个人主页配置失败', error);
      throw error;
    }
  }

  // 获取团队主页配置
  async getTeamPageConfig(teamId: string): Promise<ITeamPageConfig> {
    try {
      // 1. 获取基础配置
      const baseConfig = await this.getBaseConfig('team');

      // 2. 获取团队自定义配置
      const teamConfig = await this.getTeamConfig(teamId);

      // 3. 合并配置
      const mergedConfig = this.mergeConfigs(baseConfig, teamConfig);

      // 4. 验证配置
      await this.validateConfig(mergedConfig);

      return mergedConfig;
    } catch (error) {
      this.logger.error('获取团队主页配置失败', error);
      throw error;
    }
  }

  // 更新页面配置
  async updatePageConfig(pageId: string, config: Partial<IPageConfig>): Promise<IPageConfig> {
    try {
      // 1. 验证更新
      await this.validateConfigUpdate(config);

      // 2. 应用更新
      const updatedConfig = await this.applyConfigUpdate(pageId, config);

      // 3. 保存配置
      await this.saveConfig(pageId, updatedConfig);

      return updatedConfig;
    } catch (error) {
      this.logger.error('更新页面配置失败', error);
      throw error;
    }
  }
}
