import { Food } from '../models/food.model';
import { IAuthRequest } from '../types/models';
import { Response } from 'express';

export class FoodController {
  /**
   * 获取食物列表
   */
  public async getFoodList(req: IAuthRequest, res: Response) {
    try {
      const { category, search, page = 1, limit = 20, sort = 'name' } = req.query;

      const query: any = {};

      if (category) {
        query.category = category;
      }

      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const foods = await Food.find(query)
        .sort(sort)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await Food.countDocuments(query);

      res.json({
        success: true,
        data: {
          foods,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误',
      });
    }
  }

  /**
   * 获取食物详情
   */
  public async getFoodDetails(req: IAuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const food = await Food.findById(id);

      if (!food) {
        return res.status(404).json({
          success: false,
          message: '食物不存在',
        });
      }

      res.json({
        success: true,
        data: food,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误',
      });
    }
  }

  /**
   * 创建新食物
   */
  public async createFood(req: IAuthRequest, res: Response) {
    try {
      const food = new Food(req.body);
      await food.save();

      res.status(201).json({
        success: true,
        data: food,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误',
      });
    }
  }

  /**
   * 更新食物信息
   */
  public async updateFood(req: IAuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const food = await Food.findByIdAndUpdate(id, req.body, { new: true });

      if (!food) {
        return res.status(404).json({
          success: false,
          message: '食物不存在',
        });
      }

      res.json({
        success: true,
        data: food,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误',
      });
    }
  }

  /**
   * 删除食物
   */
  public async deleteFood(req: IAuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const food = await Food.findByIdAndDelete(id);

      if (!food) {
        return res.status(404).json({
          success: false,
          message: '食物不存在',
        });
      }

      res.json({
        success: true,
        message: '删除成功',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误',
      });
    }
  }
}

export const foodController = new FoodController();
