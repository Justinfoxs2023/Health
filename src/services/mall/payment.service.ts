import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { IPaymentData, IPaymentQuery } from './interfaces';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';
import { ThirdPartyIntegrationManager } from '../integration/ThirdPartyIntegrationManager';

@Injectable()
export class PaymentService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly integrationManager: ThirdPartyIntegrationManager,
  ) {}

  async createPayment(paymentData: IPaymentData): Promise<IPaymentData> {
    try {
      // 创建支付记录
      const payment = await this.databaseService.create('payments', {
        ...paymentData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 创建第三方支付订单
      const thirdPartyPayment = await this.createThirdPartyPayment(payment);

      // 更新支付信息
      await this.databaseService.update(
        'payments',
        { _id: payment._id },
        {
          thirdPartyPaymentId: thirdPartyPayment.id,
          paymentUrl: thirdPartyPayment.paymentUrl,
        },
      );

      // 发送事件
      await this.eventBus.emit('payment.created', { payment });

      return payment;
    } catch (error) {
      this.logger.error('创建支付失败', error);
      throw error;
    }
  }

  async getPayment(paymentId: string): Promise<IPaymentData> {
    try {
      const payment = await this.databaseService.findOne('payments', { _id: paymentId });
      if (!payment) {
        throw new Error('支付记录不存在');
      }
      return payment;
    } catch (error) {
      this.logger.error('获取支付记录失败', error);
      throw error;
    }
  }

  async updatePaymentStatus(
    paymentId: string,
    status: string,
    thirdPartyData?: any,
  ): Promise<IPaymentData> {
    try {
      const payment = await this.databaseService.update(
        'payments',
        { _id: paymentId },
        {
          status,
          thirdPartyData,
          updatedAt: new Date(),
        },
      );

      // 发送事件
      await this.eventBus.emit('payment.status.updated', { payment });

      return payment;
    } catch (error) {
      this.logger.error('更新支付状态失败', error);
      throw error;
    }
  }

  async refund(paymentId: string, amount?: number): Promise<IPaymentData> {
    try {
      const payment = await this.getPayment(paymentId);

      if (payment.status !== 'success') {
        throw new Error('只能对已支付成功的订单进行退款');
      }

      const refundAmount = amount || payment.amount;
      if (refundAmount > payment.amount) {
        throw new Error('退款金额不能大于支付金额');
      }

      // 创建第三方退款
      const thirdPartyRefund = await this.createThirdPartyRefund(payment, refundAmount);

      // 更新支付记录
      const updatedPayment = await this.databaseService.update(
        'payments',
        { _id: paymentId },
        {
          status: 'refunded',
          refundAmount,
          refundId: thirdPartyRefund.id,
          refundTime: new Date(),
          updatedAt: new Date(),
        },
      );

      // 发送事件
      await this.eventBus.emit('payment.refunded', { payment: updatedPayment });

      return updatedPayment;
    } catch (error) {
      this.logger.error('退款失败', error);
      throw error;
    }
  }

  async searchPayments(query: IPaymentQuery): Promise<{
    total: number;
    payments: IPaymentData[];
  }> {
    try {
      const { userId, orderId, status, startDate, endDate, page = 1, limit = 20 } = query;

      // 构建查询条件
      const conditions: any = {};

      if (userId) {
        conditions.userId = userId;
      }

      if (orderId) {
        conditions.orderId = orderId;
      }

      if (status) {
        conditions.status = status;
      }

      if (startDate || endDate) {
        conditions.createdAt = {};
        if (startDate) conditions.createdAt.$gte = new Date(startDate);
        if (endDate) conditions.createdAt.$lte = new Date(endDate);
      }

      // 执行查询
      const skip = (page - 1) * limit;
      const [total, payments] = await Promise.all([
        this.databaseService.count('payments', conditions),
        this.databaseService.find('payments', conditions, { skip, limit, sort: { createdAt: -1 } }),
      ]);

      return { total, payments };
    } catch (error) {
      this.logger.error('搜索支付记录失败', error);
      throw error;
    }
  }

  private async createThirdPartyPayment(payment: IPaymentData): Promise<any> {
    try {
      // 获取支付渠道配置
      const paymentConfig = await this.getPaymentConfig(payment.paymentMethod);

      // 创建第三方支付订单
      return await this.integrationManager.invoke(paymentConfig.provider, 'createPayment', {
        outTradeNo: payment._id,
        totalAmount: payment.amount,
        subject: payment.subject || '订单支付',
        body: payment.body || '商品购买',
        notifyUrl: paymentConfig.notifyUrl,
      });
    } catch (error) {
      this.logger.error('创建第三方支付订单失败', error);
      throw error;
    }
  }

  private async createThirdPartyRefund(payment: IPaymentData, refundAmount: number): Promise<any> {
    try {
      // 获取支付渠道配置
      const paymentConfig = await this.getPaymentConfig(payment.paymentMethod);

      // 创建第三方退款
      return await this.integrationManager.invoke(paymentConfig.provider, 'createRefund', {
        outTradeNo: payment._id,
        outRefundNo: `${payment._id}_refund`,
        totalAmount: payment.amount,
        refundAmount: refundAmount,
        refundReason: '订单退款',
      });
    } catch (error) {
      this.logger.error('创建第三方退款失败', error);
      throw error;
    }
  }

  private async getPaymentConfig(paymentMethod: string): Promise<any> {
    // 从配置中获取支付渠道配置
    const config = this.configService.get(`payment.${paymentMethod}`);
    if (!config) {
      throw new Error(`不支持的支付方式: ${paymentMethod}`);
    }
    return config;
  }
}
