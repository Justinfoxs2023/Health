import { Injectable } from '@nestjs/common';
import { Order, Cart, Address, PaymentInfo } from '../types';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { LogisticsService } from '../logistics/logistics.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly cartService: CartService,
    private readonly paymentService: PaymentService,
    private readonly logisticsService: LogisticsService
  ) {}

  // 创建订单
  async createOrder(userId: string, params: {
    cartItems: Cart['items'];
    address: Address;
    payment: Partial<PaymentInfo>;
    note?: string;
  }): Promise<Order> {
    // 1. 验证库存
    await this.checkStock(params.cartItems);
    
    // 2. 计算价格
    const priceInfo = await this.calculateOrderPrice(params.cartItems);
    
    // 3. 创建订单
    const order: Order = {
      id: this.generateOrderId(),
      userId,
      products: params.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: 0,
        subtotal: item.subtotal
      })),
      status: 'pending',
      totalAmount: priceInfo.total,
      discountAmount: priceInfo.discount,
      finalAmount: priceInfo.final,
      address: params.address,
      payment: {
        id: this.generatePaymentId(),
        ...params.payment,
        amount: priceInfo.final,
        status: 'pending'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 4. 保存订单
    await this.saveOrder(order);
    
    // 5. 清理购物车
    await this.cartService.removeItems(userId, params.cartItems);

    return order;
  }

  // 订单支付
  async payOrder(orderId: string, paymentMethod: string): Promise<void> {
    const order = await this.getOrder(orderId);
    
    // 1. 发起支付
    const paymentResult = await this.paymentService.processPayment({
      orderId,
      amount: order.finalAmount,
      method: paymentMethod
    });

    // 2. 更新订单状态
    if (paymentResult.success) {
      await this.updateOrderStatus(orderId, 'paid');
      // 3. 通知发货
      await this.logisticsService.createShipment(order);
    }
  }

  // 订单退款
  async refundOrder(orderId: string, reason: string): Promise<void> {
    const order = await this.getOrder(orderId);
    
    // 1. 验证退款条件
    await this.validateRefund(order);
    
    // 2. 发起退款
    await this.paymentService.processRefund({
      orderId,
      amount: order.finalAmount,
      reason
    });

    // 3. 更新订单状态
    await this.updateOrderStatus(orderId, 'refunded');
  }
} 