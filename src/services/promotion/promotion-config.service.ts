@Injectable()
export class PromotionConfigService {
  constructor(
    private readonly adminService: AdminService,
    private readonly validationService: ValidationService
  ) {}

  // 设置佣金比例
  async setCommissionRates(
    rateConfig: CommissionRateConfig
  ): Promise<ConfigUpdateResult> {
    try {
      // 验证配置合规性
      await this.validateCommissionRates(rateConfig);

      // 更新配置
      const updatedConfig = await this.prisma.commissionConfig.update({
        where: { id: 'default' },
        data: {
          level1Rate: rateConfig.level1Rate,
          level2Rate: rateConfig.level2Rate,
          minimumAmount: rateConfig.minimumAmount,
          maximumRate: rateConfig.maximumRate,
          updatedAt: new Date()
        }
      });

      // 记录配置变更
      await this.logConfigChange({
        type: 'COMMISSION_RATE_UPDATE',
        oldConfig: rateConfig.currentConfig,
        newConfig: updatedConfig
      });

      // 通知相关服务
      await this.notifyConfigUpdate(updatedConfig);

      return {
        success: true,
        config: updatedConfig,
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error('佣金比例设置失败', error);
      throw error;
    }
  }

  // 获取当前配置
  async getCurrentConfig(): Promise<PromotionConfig> {
    // 实现配置获取逻辑
  }
} 