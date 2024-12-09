import { Injectable } from '@nestjs/common';
import { Cart, Product } from '../types';
import { StorageService } from '../../storage/storage.service';
import { PromotionService } from '../promotion/promotion.service';

@Injectable()
export class CartService {
  constructor(
    private readonly storage: StorageService,
    private readonly promotionService: PromotionService
  ) {}

  // 购物车操作
  async addToCart(userId: string, productId: string, quantity: number): Promise<void> {
    const cart = await this.getCart(userId);
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        selected: true,
        addedAt: new Date(),
        price: 0, // 需要获取实时价格
        subtotal: 0
      });
    }

    await this.updateCartPrices(cart);
    await this.storage.set(`cart:${userId}`, cart);
  }

  // 价格计算
  private async updateCartPrices(cart: Cart): Promise<void> {
    // 获取商品价格
    const productPrices = await this.getProductPrices(
      cart.items.map(item => item.productId)
    );

    // 更新商品价格和小计
    cart.items.forEach(item => {
      item.price = productPrices[item.productId] || 0;
      item.subtotal = item.price * item.quantity;
    });

    // 计算总价
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.selectedAmount = cart.items
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.subtotal, 0);

    // 应用促销
    const promotions = await this.promotionService.calculatePromotions(cart);
    cart.promotions = promotions;
  }
} 