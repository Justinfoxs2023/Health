import { IAuthRequest } from '../types/models';
import { Response } from 'express';
import { User } from '../models/user.model';
import { uploadImage, IUploadedFile } from '../utils/upload/upload';

export class ProfileController {
  /**
   * 获取用户资料
   */
  public async getProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      const user = await User.findById(userId).select(
        '-password -verificationToken -resetPasswordToken -resetPasswordExpires',
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在',
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 更新基本资料
   */
  public async updateProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { name, profile } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在',
        });
        return;
      }

      // 更新基本信息
      user.name = name || user.name;
      if (profile) {
        user.profile = {
          ...user.profile,
          ...profile,
        };
      }

      // 重新计算健康数据
      if (profile?.height || profile?.weight) {
        user.healthData.bmi = user.calculateBMI();
      }
      if (profile?.height || profile?.weight || profile?.age || profile?.gender) {
        user.healthData.basalMetabolicRate = user.calculateBMR();
      }

      await user.save();

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 更新头像
   */
  public async updateAvatar(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const file = req.file as IUploadedFile;

      if (!file) {
        res.status(400).json({
          success: false,
          message: '未上传文件',
        });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在',
        });
        return;
      }

      // 上传图片
      const avatarUrl = await uploadImage(file);
      user.avatar = avatarUrl;
      await user.save();

      res.json({
        success: true,
        data: {
          avatar: avatarUrl,
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
   * 更新健康数据
   */
  public async updateHealthData(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { healthData } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在',
        });
        return;
      }

      user.healthData = {
        ...user.healthData,
        ...healthData,
      };

      await user.save();

      res.json({
        success: true,
        data: user.healthData,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 更新用户设置
   */
  public async updateSettings(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { settings } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在',
        });
        return;
      }

      user.settings = {
        ...user.settings,
        ...settings,
      };

      await user.save();

      res.json({
        success: true,
        data: user.settings,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const profileController = new ProfileController();
