import { CacheService } from '../cache/CacheService';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { IProductData, IProductQuery } from './interfaces';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';

@Injectable()
export class ProductService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
  ) {}

  async createProduct(productData: IProductData): Promise<IProductData> {
    try {
      // 数据验证
      this.validateProductData(productData);

      // 创建商品
      const product = await this.databaseService.create('products', {
        ...productData,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 清除相关缓存
      await this.clearProductCache();

      // 发送事件
      await this.eventBus.emit('product.created', { product });

      return product;
    } catch (error) {
      this.logger.error('创建商品失败', error);
      throw error;
    }
  }

  async updateProduct(productId: string, updateData: Partial<IProductData>): Promise<IProductData> {
    try {
      // 验证商品是否存在
      const existingProduct = await this.databaseService.findOne('products', { _id: productId });
      if (!existingProduct) {
        throw new Error('商品不存在');
      }

      // 更新商品
      const product = await this.databaseService.update(
        'products',
        { _id: productId },
        {
          ...updateData,
          updatedAt: new Date(),
        },
      );

      // 清除相关缓存
      await this.clearProductCache(productId);

      // 发送事件
      await this.eventBus.emit('product.updated', { product });

      return product;
    } catch (error) {
      this.logger.error('更新商品失败', error);
      throw error;
    }
  }

  async getProduct(productId: string): Promise<IProductData> {
    try {
      // 尝试从缓存获取
      const cacheKey = `product:${productId}`;
      let product = await this.cacheService.get(cacheKey);

      if (!product) {
        // 从数据库获取
        product = await this.databaseService.findOne('products', { _id: productId });
        if (!product) {
          throw new Error('商品不存在');
        }

        // 设置缓存
        await this.cacheService.set(cacheKey, product, 3600);
      }

      return product;
    } catch (error) {
      this.logger.error('获取商品失败', error);
      throw error;
    }
  }

  async searchProducts(query: IProductQuery): Promise<{
    total: number;
    products: IProductData[];
  }> {
    try {
      const { category, keyword, minPrice, maxPrice, status, page = 1, limit = 20 } = query;

      // 构建查询条件
      const conditions: any = { status: status || 'active' };

      if (category) {
        conditions.category = category;
      }

      if (keyword) {
        conditions.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        conditions.price = {};
        if (minPrice !== undefined) conditions.price.$gte = minPrice;
        if (maxPrice !== undefined) conditions.price.$lte = maxPrice;
      }

      // 执行查询
      const skip = (page - 1) * limit;
      const [total, products] = await Promise.all([
        this.databaseService.count('products', conditions),
        this.databaseService.find('products', conditions, { skip, limit }),
      ]);

      return { total, products };
    } catch (error) {
      this.logger.error('搜索商品失败', error);
      throw error;
    }
  }

  async updateStock(productId: string, quantity: number): Promise<void> {
    try {
      const product = await this.databaseService.findOne('products', { _id: productId });
      if (!product) {
        throw new Error('商品不存在');
      }

      if (product.stock + quantity < 0) {
        throw new Error('库存不足');
      }

      await this.databaseService.update(
        'products',
        { _id: productId },
        {
          $inc: { stock: quantity },
          updatedAt: new Date(),
        },
      );

      // 清除缓存
      await this.clearProductCache(productId);

      // 发送事件
      await this.eventBus.emit('product.stock.updated', {
        productId,
        quantity,
        currentStock: product.stock + quantity,
      });
    } catch (error) {
      this.logger.error('更新库存失败', error);
      throw error;
    }
  }

  private validateProductData(data: IProductData): void {
    if (!data.name || !data.price || !data.category) {
      throw new Error('商品数据不完整');
    }

    if (data.price < 0) {
      throw new Error('商品价格不能为负');
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new Error('商品库存不能为负');
    }
  }

  private async clearProductCache(productId?: string): Promise<void> {
    if (productId) {
      await this.cacheService.del(`product:${productId}`);
    }
    await this.cacheService.del('products:list');
  }
}
