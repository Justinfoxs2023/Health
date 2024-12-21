import {
  IPaymentSystem,
  IServiceIncomeRule,
  PaymentChannelType,
} from '../../types/payment-integration';
import { Injectable } from '@nestjs/common';

@Inj
ectable()
export class IncomeDistributionService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly accountService: AccountService,
    private readonly notificationService: NotificationService,
  ) {}

  // 处理服务收入分配
  async processServiceIncome(
    providerId: string,
    serviceData: ServiceTransactionData,
  ): Promise<IncomeDistributionResult> {
    // 获取收入规则
    const rule = await this.getServiceIncomeRule(serviceData.serviceType);

    // 计算分配金额
    const distribution = await this.calculateDistribution(serviceData.amount, rule);

    // 执行资金分配
    const result = await this.executeDistribution(distribution);

    // 生成结算记录
    await this.createSettlementRecord(providerId, distribution);

    // 通知相关方
    await this.notifyParties(providerId, distribution);

    return result;
  }

  // 计算分配金额
  private async calculateDistribution(
    amount: number,
    rule: IServiceIncomeRule,
  ): Promise<IncomeDistribution> {
    return {
      platformFee: amount * (rule.platformFeePercentage / 100),
      familyFund: amount * (rule.familyFundPercentage / 100),
      personalAccount: amount * (rule.personalAccountPercentage / 100),
      total: amount,
    };
  }

  // 执行资金分配
  private async executeDistribution(
    distribution: IncomeDistribution,
  ): Promise<IncomeDistributionResult> {
    // 平台费用处理
    await this.processPlatformFee(distribution.platformFee);

    // 家庭基金分配
    await this.processFamilyFund(distribution.familyFund);

    // 个人账户分配
    await this.processPersonalAccount(distribution.personalAccount);

    return {
      status: 'completed',
      timestamp: new Date(),
      distribution,
    };
  }
}
