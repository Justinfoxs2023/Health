import { CacheManager } from '../cache/CacheManager';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface IFoodItem {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** category 的描述 */
    category: string;
  /** subcategory 的描述 */
    subcategory: string;
  /** nutrition 的描述 */
    nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    vitamins: {
      key: string: number;
    };
    minerals: {
      [key: string]: number;
    };
  };
  /** servingSize 的描述 */
    servingSize: {
    amount: number;
    unit: string;
  };
  /** alternativeServings 的描述 */
    alternativeServings: Array<{
    name: string;
    amount: number;
    unit: string;
    multiplier: number;
  }>;
  /** seasonality 的描述 */
    seasonality?: undefined | { peak: string[]; available: string[]; };
  /** storage 的描述 */
    storage?: undefined | { method: string; duration: string; tips: string[]; };
  /** preparation 的描述 */
    preparation?: undefined | { methods: string[]; tips: string[]; };
  /** tags 的描述 */
    tags: string[];
  /** source 的描述 */
    source?: undefined | string;
  /** lastUpdated 的描述 */
    lastUpdated: Date;
}

export interface INutrientInfo {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** category 的描述 */
    category: vitamin  mineral  macronutrient;
  unit: string;
  rdi: {
    ageGroup: string: {
      male: number;
      female: number;
    };
  };
  functions: string[];
  sources: string[];
  deficiencySymptoms: string[];
  excessSymptoms: string[];
}

@injectable()
export class FoodNutritionDatabase {
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    @inject() private logger: Logger,
    @inject() private databaseService: DatabaseService,
    @inject() private cacheManager: CacheManager,
    @inject() private eventBus: EventBus,
  ) {}

  /**
   * 获取食材信息
   */
  public async getFoodItem(id: string): Promise<IFoodItem> {
    try {
      // 尝试从缓存获取
      const cacheKey = `food:${id}`;
      const cached = await this.cacheManager.get<IFoodItem>(cacheKey);
      if (cached) {
        return cached;
      }

      // 从数据库获取
      const food = await this.databaseService.findOne('food_items', { id });

      if (!food) {
        throw new Error('食材不存在');
      }

      // 缓存结果
      await this.cacheManager.set(cacheKey, food, this.CACHE_TTL);

      return food;
    } catch (error) {
      this.logger.error('获取食材信息失败', error);
      throw error;
    }
  }

  /**
   * 搜索食材
   */
  public async searchFoodItems(
    query: {
      name?: string;
      category?: string;
      tags?: string[];
      nutrient?: {
        type: string;
        min?: number;
        max?: number;
      };
    },
    options: {
      sort?: {
        field: string;
        order: 'asc' | 'desc';
      };
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{
    items: IFoodItem[];
    total: number;
  }> {
    try {
      const filter: any = {};

      if (query.name) {
        filter.name = {
          $regex: query.name,
          $options: 'i',
        };
      }
      if (query.category) {
        filter.category = query.category;
      }
      if (query.tags?.length) {
        filter.tags = { $all: query.tags };
      }
      if (query.nutrient) {
        const field = `nutrition.${query.nutrient.type}`;
        filter[field] = {};
        if (query.nutrient.min !== undefined) {
          filter[field].$gte = query.nutrient.min;
        }
        if (query.nutrient.max !== undefined) {
          filter[field].$lte = query.nutrient.max;
        }
      }

      const [items, total] = await Promise.all([
        this.databaseService.find('food_items', filter, {
          sort: options.sort && {
            [options.sort.field]: options.sort.order === 'asc' ? 1 : -1,
          },
          limit: options.limit,
          skip: options.offset,
        }),
        this.databaseService.count('food_items', filter),
      ]);

      return { items, total };
    } catch (error) {
      this.logger.error('搜索食材失败', error);
      throw error;
    }
  }

  /**
   * 添加食材
   */
  public async addFoodItem(food: Omit<IFoodItem, 'id' | 'lastUpdated'>): Promise<IFoodItem> {
    try {
      const newFood: IFoodItem = {
        ...food,
        id: crypto.randomUUID(),
        lastUpdated: new Date(),
      };

      // 验证数据
      this.validateFoodItem(newFood);

      // 保存到数据库
      await this.databaseService.insert('food_items', newFood);

      // 发布事件
      this.eventBus.publish('food.added', {
        foodId: newFood.id,
        name: newFood.name,
        category: newFood.category,
      });

      return newFood;
    } catch (error) {
      this.logger.error('添加食材失败', error);
      throw error;
    }
  }

  /**
   * 更新食材
   */
  public async updateFoodItem(
    id: string,
    updates: Partial<Omit<IFoodItem, 'id' | 'lastUpdated'>>,
  ): Promise<IFoodItem> {
    try {
      const food = await this.getFoodItem(id);

      const updatedFood: IFoodItem = {
        ...food,
        ...updates,
        lastUpdated: new Date(),
      };

      // 验证数据
      this.validateFoodItem(updatedFood);

      // 更新数据库
      await this.databaseService.update('food_items', { id }, { $set: updatedFood });

      // 清除缓存
      await this.cacheManager.del(`food:${id}`);

      // 发布事件
      this.eventBus.publish('food.updated', {
        foodId: id,
        updates,
      });

      return updatedFood;
    } catch (error) {
      this.logger.error('更新食材失败', error);
      throw error;
    }
  }

  /**
   * 删除食材
   */
  public async deleteFoodItem(id: string): Promise<void> {
    try {
      // 检查食材是否存在
      await this.getFoodItem(id);

      // 从数据库删除
      await this.databaseService.delete('food_items', { id });

      // 清除缓存
      await this.cacheManager.del(`food:${id}`);

      // 发布事件
      this.eventBus.publish('food.deleted', { foodId: id });
    } catch (error) {
      this.logger.error('删除食材失败', error);
      throw error;
    }
  }

  /**
   * 获取营养素信息
   */
  public async getNutrientInfo(id: string): Promise<INutrientInfo> {
    try {
      const cacheKey = `nutrient:${id}`;
      const cached = await this.cacheManager.get<INutrientInfo>(cacheKey);
      if (cached) {
        return cached;
      }

      const nutrient = await this.databaseService.findOne('nutrients', { id });

      if (!nutrient) {
        throw new Error('营养素不存在');
      }

      await this.cacheManager.set(cacheKey, nutrient, this.CACHE_TTL);

      return nutrient;
    } catch (error) {
      this.logger.error('获取营养素信息失败', error);
      throw error;
    }
  }

  /**
   * 计算营养值
   */
  public async calculateNutrition(
    foodId: string,
    amount: number,
    unit: string,
  ): Promise<IFoodItem['nutrition']> {
    try {
      const food = await this.getFoodItem(foodId);

      // 找到对应的单位换算
      let multiplier = 1;
      if (unit !== food.servingSize.unit) {
        const serving = food.alternativeServings.find(s => s.unit === unit);
        if (!serving) {
          throw new Error(`不支持的单位: ${unit}`);
        }
        multiplier = serving.multiplier;
      }

      // 计算实际营养值
      const ratio = (amount * multiplier) / food.servingSize.amount;
      const nutrition: any = {};

      for (const [key, value] of Object.entries(food.nutrition)) {
        if (typeof value === 'number') {
          nutrition[key] = value * ratio;
        } else if (typeof value === 'object') {
          nutrition[key] = {};
          for (const [subKey, subValue] of Object.entries(value)) {
            nutrition[key][subKey] = subValue * ratio;
          }
        }
      }

      return nutrition;
    } catch (error) {
      this.logger.error('计算营养值失败', error);
      throw error;
    }
  }

  /**
   * 获取食材分类
   */
  public async getFoodCategories(): Promise<
    Array<{
      name: string;
      subcategories: string[];
      count: number;
    }>
  > {
    try {
      const cacheKey = 'food:categories';
      const cached = await this.cacheManager.get<any>(cacheKey);
      if (cached) {
        return cached;
      }

      const categories = await this.databaseService.aggregate('food_items', [
        {
          $group: {
            _id: {
              category: '$category',
              subcategory: '$subcategory',
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: '$_id.category',
            subcategories: {
              $push: '$_id.subcategory',
            },
            count: { $sum: '$count' },
          },
        },
        {
          $project: {
            name: '$_id',
            subcategories: 1,
            count: 1,
            _id: 0,
          },
        },
      ]);

      await this.cacheManager.set(cacheKey, categories, this.CACHE_TTL);

      return categories;
    } catch (error) {
      this.logger.error('获取食材分类失败', error);
      throw error;
    }
  }

  /**
   * 获取季节性食材
   */
  public async getSeasonalFoods(month: number): Promise<IFoodItem[]> {
    try {
      const seasons = ['spring', 'summer', 'autumn', 'winter'];
      const season = seasons[Math.floor((month % 12) / 3)];

      return this.databaseService.find('food_items', {
        $or: [{ 'seasonality.peak': season }, { 'seasonality.available': season }],
      });
    } catch (error) {
      this.logger.error('获取季节性食材失败', error);
      throw error;
    }
  }

  /**
   * 验证食材数据
   */
  private validateFoodItem(food: IFoodItem): void {
    // 基本字段验证
    if (!food.name || !food.category) {
      throw new Error('食材名称和分类为必填项');
    }

    // 营养数据验证
    const nutrition = food.nutrition;
    if (
      !nutrition ||
      typeof nutrition.calories !== 'number' ||
      typeof nutrition.protein !== 'number' ||
      typeof nutrition.carbs !== 'number' ||
      typeof nutrition.fat !== 'number'
    ) {
      throw new Error('基本营养数据不完整');
    }

    // 份量单位验证
    if (
      !food.servingSize ||
      typeof food.servingSize.amount !== 'number' ||
      !food.servingSize.unit
    ) {
      throw new Error('份量信息不完整');
    }

    // 替代份量验证
    if (food.alternativeServings) {
      for (const serving of food.alternativeServings) {
        if (
          !serving.name ||
          typeof serving.amount !== 'number' ||
          !serving.unit ||
          typeof serving.multiplier !== 'number'
        ) {
          throw new Error('替代份量信息不完整');
        }
      }
    }
  }
}
