import { IAuthRequest } from '../types/models';
import { Request, Response } from 'express';
import { User } from '../models/user.model';

export class NutritionistController {
  /**
   * 获取营养师列表
   */
  public async getNutritionists(req: Request, res: Response): Promise<void> {
    try {
      const { specialties, page = 1, limit = 10 } = req.query;

      const query = { role: 'nutritionist' };
      if (specialties) {
        query['nutritionistProfile.specialties'] = { $in: specialties };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const nutritionists = await User.find(query)
        .select('name avatar nutritionistProfile')
        .skip(skip)
        .limit(Number(limit));

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: nutritionists,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 获取营养师详情
   */
  public async getNutritionistDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const nutritionist = await User.findOne({
        _id: id,
        role: 'nutritionist',
      }).select('name avatar nutritionistProfile');

      if (!nutritionist) {
        res.status(404).json({
          success: false,
          message: '未找到该营养师',
        });
        return;
      }

      res.json({
        success: true,
        data: nutritionist,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 更新营养师资料
   */
  public async updateNutritionistProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { nutritionistProfile } = req.body;

      const nutritionist = await User.findOne({
        _id: userId,
        role: 'nutritionist',
      });

      if (!nutritionist) {
        res.status(404).json({
          success: false,
          message: '未找到该营养师',
        });
        return;
      }

      nutritionist.nutritionistProfile = {
        ...nutritionist.nutritionistProfile,
        ...nutritionistProfile,
      };

      await nutritionist.save();

      res.json({
        success: true,
        data: nutritionist.nutritionistProfile,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 更新工作时间
   */
  public async updateAvailability(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { availability } = req.body;

      const nutritionist = await User.findOne({
        _id: userId,
        role: 'nutritionist',
      });

      if (!nutritionist) {
        res.status(404).json({
          success: false,
          message: '未找到该营养师',
        });
        return;
      }

      nutritionist.nutritionistProfile.availability = availability;
      await nutritionist.save();

      res.json({
        success: true,
        data: nutritionist.nutritionistProfile.availability,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const nutritionistController = new NutritionistController();
