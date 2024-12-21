import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { IOrderData, IOrderQuery } from './interfaces';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';
import { LogisticsService } from './logistics.service';
import { PaymentService } from './payment.service';
import { ProductService } from './product.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly productService: ProductService,
    private readonly paymentService: PaymentService,
    private readonly logisticsService: LogisticsService,
  ) {}

  async createOrder(userId: string, orderData: IOrderData): Promise<IOrderData> {
    try {
      // 验证商品库存
      await this.validateStock(orderData.items);

      // 计算订单金额
      const amount = await this.calculateOrderAmount(orderData.items);

      // 创建订单
      const order = await this.databaseService.create('orders', {
        ...orderData,
        userId,
        amount,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 锁定库存
      await this.lockStock(order.items);

      // 创建支付订单
      const payment = await this.paymentService.createPayment({
        orderId: order._id,
        amount: order.amount,
        userId: order.userId,
      });

      // 更新订单支付信息
      await this.databaseService.update('orders', { _id: order._id }, { paymentId: payment._id });

      // 发送事件
      await this.eventBus.emit('order.created', { order });

      return order;
    } catch (error) {
      this.logger.error('创建订单失败', error);
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<IOrderData> {
    try {
      const order = await this.databaseService.findOne('orders', { _id: orderId });
      if (!order) {
        throw new Error('订单不存在');
      }
      return order;
    } catch (error) {
      this.logger.error('获取订单失败', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<IOrderData> {
    try {
      const order = await this.databaseService.update(
        'orders',
        { _id: orderId },
        {
          status,
          updatedAt: new Date(),
        },
      );

      // 处理不同状态的业务逻辑
      switch (status) {
        case 'paid':
          await this.handleOrderPaid(order);
          break;
        case 'shipped':
          await this.handleOrderShipped(order);
          break;
        case 'completed':
          await this.handleOrderCompleted(order);
          break;
        case 'cancelled':
          await this.handleOrderCancelled(order);
          break;
      }

      // 发送事件
      await this.eventBus.emit('order.status.updated', { order });

      return order;
    } catch (error) {
      this.logger.error('更新订单状态失败', error);
      throw error;
    }
  }

  async searchOrders(query: IOrderQuery): Promise<{
    total: number;
    orders: IOrderData[];
  }> {
    try {
      const { userId, status, startDate, endDate, page = 1, limit = 20 } = query;

      // 构建查询条件
      const conditions: any = {};

      if (userId) {
        conditions.userId = userId;
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
      const [total, orders] = await Promise.all([
        this.databaseService.count('orders', conditions),
        this.databaseService.find('orders', conditions, { skip, limit, sort: { createdAt: -1 } }),
      ]);

      return { total, orders };
    } catch (error) {
      this.logger.error('搜索订单失败', error);
      throw error;
    }
  }

  private async validateStock(items: any[]): Promise<void> {
    for (const item of items) {
      const product = await this.productService.getProduct(item.productId);
      if (product.stock < item.quantity) {
        throw new Error(`商品 ${product.name} 库存不足`);
      }
    }
  }

  private async lockStock(items: any[]): Promise<void> {
    for (const item of items) {
      await this.productService.updateStock(item.productId, -item.quantity);
    }
  }

  private async unlockStock(items: any[]): Promise<void> {
    for (const item of items) {
      await this.productService.updateStock(item.productId, item.quantity);
    }
  }

  private async calculateOrderAmount(items: any[]): Promise<number> {
    let amount = 0;
    for (const item of items) {
      const product = await this.productService.getProduct(item.productId);
      amount += product.price * item.quantity;
    }
    return amount;
  }

  private async handleOrderPaid(order: IOrderData): Promise<void> {
    // 创建物流订单
    const logistics = await this.logisticsService.createShipment(order);

    // 更新订单物流信息
    await this.databaseService.update(
      'orders',
      { _id: order._id },
      { trackingNumber: logistics.trackingNumber },
    );
  }

  private async handleOrderShipped(order: IOrderData): Promise<void> {
    // 可以添加发送物流通知等逻辑
  }

  private async handleOrderCompleted(order: IOrderData): Promise<void> {
    // 可以添加订单完成后的处理逻辑，如积分奖励等
  }

  private async handleOrderCancelled(order: IOrderData): Promise<void> {
    // 解锁库存
    await this.unlockStock(order.items);

    // 如果已支付，发起退款
    if (order.paymentId) {
      await this.paymentService.refund(order.paymentId);
    }
  }
}
