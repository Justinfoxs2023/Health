import {
  IProductData,
  IOrderData,
  ILogisticsData,
  MembershipData,
  CampaignData,
} from './interfaces';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { PaymentService } from '../payment/PaymentService';

@Injec
table()
export class MallService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly paymentService: PaymentService,
    private readonly eventBus: EventBus,
  ) {}

  async handleProductOperation(operation: string, data: any): Promise<any> {
    try {
      switch (operation) {
        case 'create':
          return await this.createProduct(data.productData);
        case 'update':
          if (!data.productId) throw new Error('商品ID不能为空');
          return await this.updateProduct(data.productId, data.productData);
        case 'delete':
          if (!data.productId) throw new Error('商品ID不能为空');
          return await this.deleteProduct(data.productId);
        default:
          throw new Error('不支持的操作类型');
      }
    } catch (error) {
      this.logger.error('商品操作失败', error);
      throw error;
    }
  }

  private async createProduct(data: IProductData): Promise<any> {
    const product = await this.databaseService.create('products', {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.eventBus.emit('product.created', { product });
    return product;
  }

  private async updateProduct(productId: string, data: Partial<IProductData>): Promise<any> {
    const product = await this.databaseService.update(
      'products',
      { _id: productId },
      {
        ...data,
        updatedAt: new Date(),
      },
    );

    await this.eventBus.emit('product.updated', { product });
    return product;
  }

  private async deleteProduct(productId: string): Promise<void> {
    await this.databaseService.delete('products', { _id: productId });
    await this.eventBus.emit('product.deleted', { productId });
  }

  async createOrder(orderData: IOrderData): Promise<any> {
    try {
      // 验证商品库存
      await this.validateStock(orderData.products);

      // 创建订单
      const order = await this.databaseService.create('orders', {
        ...orderData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 创建支付订单
      const payment = await this.paymentService.createPayment({
        type: 'order',
        referenceId: order._id,
        amount: order.totalAmount,
        userId: order.userId,
      });

      // 锁定库存
      await this.lockStock(orderData.products);

      // 发送订单创建事件
      await this.eventBus.emit('order.created', { order, payment });

      return { order, payment };
    } catch (error) {
      this.logger.error('创建订单失败', error);
      throw error;
    }
  }

  async handlePaymentCallback(paymentData: any): Promise<void> {
    try {
      const { orderId, status, transactionId } = paymentData;

      // 更新订单状态
      const order = await this.databaseService.update(
        'orders',
        { _id: orderId },
        {
          status: status === 'success' ? 'paid' : 'payment_failed',
          transactionId,
          updatedAt: new Date(),
        },
      );

      if (status === 'success') {
        // 确认扣减库存
        await this.confirmStock(order.products);

        // 分配会员积分
        await this.allocatePoints(order);

        // 发送支付成功事件
        await this.eventBus.emit('order.paid', { order });
      } else {
        // 释放库存
        await this.releaseStock(order.products);

        // 发送支付失败事件
        await this.eventBus.emit('order.payment_failed', { order });
      }
    } catch (error) {
      this.logger.error('处理支付回调失败', error);
      throw error;
    }
  }

  private async validateStock(
    products: Array<{ productId: string; quantity: number }>,
  ): Promise<void> {
    for (const item of products) {
      const product = await this.databaseService.findOne('products', { _id: item.productId });
      if (!product || product.stock < item.quantity) {
        throw new Error(`商品 ${item.productId} 库存不足`);
      }
    }
  }

  private async lockStock(products: Array<{ productId: string; quantity: number }>): Promise<void> {
    for (const item of products) {
      await this.databaseService.update(
        'products',
        { _id: item.productId },
        {
          $inc: {
            stock: -item.quantity,
            lockedStock: item.quantity,
          },
        },
      );
    }
  }

  private async confirmStock(
    products: Array<{ productId: string; quantity: number }>,
  ): Promise<void> {
    for (const item of products) {
      await this.databaseService.update(
        'products',
        { _id: item.productId },
        {
          $inc: { lockedStock: -item.quantity },
        },
      );
    }
  }

  private async releaseStock(
    products: Array<{ productId: string; quantity: number }>,
  ): Promise<void> {
    for (const item of products) {
      await this.databaseService.update(
        'products',
        { _id: item.productId },
        {
          $inc: {
            stock: item.quantity,
            lockedStock: -item.quantity,
          },
        },
      );
    }
  }

  private async allocatePoints(order: IOrderData): Promise<void> {
    // 计算积分
    const points = Math.floor(order.totalAmount * 0.01); // 1元=0.01积分

    // 更新会员积分
    await this.databaseService.update(
      'memberships',
      { userId: order.userId },
      {
        $inc: { points },
        updatedAt: new Date(),
      },
      { upsert: true },
    );

    // 创建积分记录
    await this.databaseService.create('point_records', {
      userId: order.userId,
      orderId: order._id,
      points,
      type: 'order_reward',
      createdAt: new Date(),
    });
  }
}
