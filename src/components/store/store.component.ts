import { Component, OnInit } from '@angular/core';
import { IProduct, ICart } from '../../services/store/types';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
  products: IProduct[] = [];
  recommendations: IProduct[] = [];
  cart: ICart | null = null;
  filters = {
    category: '',
    tags: [],
    priceRange: [0, 1000],
    healthLabels: [],
  };

  constructor(private storeService: StoreService) {}

  async ngOnInit() {
    await this.loadProducts();
    await this.loadRecommendations();
    await this.loadCart();
  }

  async loadProducts() {
    this.products = await this.storeService.getProducts(this.filters);
  }

  async loadRecommendations() {
    this.recommendations = await this.storeService.getRecommendations('current_user_id');
  }

  async loadCart() {
    this.cart = await this.storeService.getCart('current_user_id');
  }

  async addToCart(productId: string) {
    if (!this.cart) return;

    const items = [...this.cart.items];
    const existingItem = items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({
        productId,
        quantity: 1,
        selected: true,
      });
    }

    await this.storeService.updateCart('current_user_id', { items });
    await this.loadCart();
  }

  async checkout() {
    if (!this.cart) return;

    const selectedItems = this.cart.items.filter(item => item.selected);
    if (selectedItems.length === 0) return;

    const order = await this.storeService.createOrder('current_user_id', selectedItems);
    // 跳转到支付页面
  }
}
