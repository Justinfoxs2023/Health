import { IProduct } from '../../types/mall';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRecommendationService {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  // 基于内容的商品推荐
  async getContentBasedRecommendations(
    contentId: string,
    contentType: 'diet' | 'post',
    limit = 6,
  ): Promise<IProduct[]> {
    // 获取内容相关的标签和属性
    const contentTags = await this.getContentTags(contentId, contentType);

    // 基于标签匹配相关商品
    const recommendations = await this.productService.findByTags(contentTags);

    // 排序和筛选
    return this.rankProducts(recommendations).slice(0, limit);
  }

  // 基于用户行为的商品推荐
  async getUserBasedRecommendations(userId: string, limit = 6): Promise<IProduct[]> {
    // 获取用户兴趣和行为数据
    const userProfile = await this.userService.getUserProfile(userId);
    const userBehavior = await this.analyticsService.getUserBehavior(userId);

    // 计算商品匹配度
    const recommendations = await this.matchProducts(userProfile, userBehavior);

    return recommendations.slice(0, limit);
  }

  // 相关商品推荐
  async getRelatedProducts(productId: string, limit = 4): Promise<IProduct[]> {
    const product = await this.productService.findById(productId);
    const relatedProducts = await this.productService.findRelated(product.category, product.tags);

    return this.rankProducts(relatedProducts).slice(0, limit);
  }

  private async rankProducts(products: IProduct[]): Promise<IProduct[]> {
    return products.sort((a, b) => {
      // 综合考虑销量、评分、上架时间等因素
      const scoreA = this.calculateScore(a);
      const scoreB = this.calculateScore(b);
      return scoreB - scoreA;
    });
  }

  private calculateScore(product: IProduct): number {
    const salesWeight = 0.4;
    const ratingWeight = 0.4;
    const timeWeight = 0.2;

    return (
      product.sales * salesWeight +
      product.rating * ratingWeight +
      this.getTimeScore(product) * timeWeight
    );
  }
}
