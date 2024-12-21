import {
  IPaymentSystem,
  PaymentChannelType,
  RechargeRequest,
} from '../../types/payment-integration';
import { Injectable } from '@nestjs/common';

@Inj
ectable()
export class RechargeService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly accountService: AccountService,
    private readonly notificationService: NotificationService,
  ) {}

  // 处理充值请求
  async processRecharge(userId: string, request: RechargeRequest): Promise<RechargeResult> {
    // 验证充值请求
    await this.validateRechargeRequest(request);

    // 创建支付订单
    const paymentOrder = await this.createPaymentOrder(request);

    // 调用支付通道
    const paymentResult = await this.initiatePayment(request.channel, paymentOrder);

    // 处理支付结果
    if (paymentResult.success) {
      // 更新账户余额
      await this.updateAccountBalance(request.targetAccount, request.amount);

      // 创建充值记录
      await this.createRechargeRecord(request, paymentResult);

      // ���送通知
      await this.sendRechargeNotification(userId, request);
    }

    return {
      success: paymentResult.success,
      orderId: paymentOrder.id,
      amount: request.amount,
      timestamp: new Date(),
      channel: request.channel,
    };
  }

  // 处理充值回调
  async handleRechargeCallback(channelType: PaymentChannelType, callbackData: any): Promise<void> {
    // 验证回调数据
    await this.validateCallback(channelType, callbackData);

    // 查找充值订单
    const order = await this.findRechargeOrder(callbackData.orderId);

    // 更新订单状态
    await this.updateOrderStatus(order.id, callbackData.status);

    // 如果充值成功
    if (callbackData.status === 'success') {
      // 执行账户余额更新
      await this.completeRecharge(order);

      // 发送充值成功通知
      await this.sendSuccessNotification(order);
    }
  }
}
