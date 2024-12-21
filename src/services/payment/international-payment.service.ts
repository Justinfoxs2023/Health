import {
  InternationalPaymentConfig,
  IPaymentProviderConfig,
} from '../../types/international-payment';
import { Injectable } from '@nestjs/common';

@In
jectable()
export class InternationalPaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly exchangeService: ExchangeRateService,
    private readonly securityService: SecurityService,
  ) {}

  // 处理国际支付
  async processInternationalPayment(
    paymentData: InternationalPaymentRequest,
  ): Promise<PaymentResult> {
    // 确定支付提供商
    const provider = await this.determinePaymentProvider(paymentData.method, paymentData.region);

    // 货币转换
    const convertedAmount = await this.convertCurrency(
      paymentData.amount,
      paymentData.currency,
      provider.currency,
    );

    // 创建支付意图
    const paymentIntent = await this.createPaymentIntent(provider, convertedAmount, paymentData);

    // 执行支付
    return await this.executePayment(paymentIntent);
  }

  // 处理退款
  async processInternationalRefund(refundData: InternationalRefundRequest): Promise<RefundResult> {
    // 验证退款请求
    await this.validateRefundRequest(refundData);

    // 确定原支付提供商
    const provider = await this.getOriginalPaymentProvider(refundData.paymentId);

    // 创建退款请求
    const refundRequest = await this.createRefundRequest(provider, refundData);

    // 执行退款
    return await this.executeRefund(refundRequest);
  }

  // 处理支付争议
  async handlePaymentDispute(disputeData: DisputeRequest): Promise<DisputeResolution> {
    // 验证争议
    await this.validateDispute(disputeData);

    // 收集证据
    const evidence = await this.collectDisputeEvidence(disputeData);

    // 提交争议处理
    return await this.submitDisputeResolution(evidence);
  }

  // 合规性检查
  async performComplianceCheck(paymentData: PaymentData): Promise<ComplianceResult> {
    return await this.complianceService.checkInternationalPayment(paymentData);
  }
}
