import { Response } from 'express';
import { User } from '../models/user.model';
import { IAuthRequest } from '../types/models';
import { uploadImage } from '../utils/upload';

export class ProfileController {
  // 修复 updateProfile 方法中的类型问题
  public async updateProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { name, profile } = req.body as {
        name?: string;
        profile?: {
          gender?: '男' | '女' | '其他';
          age?: number;
          height?: number;
          weight?: number;
          activityLevel?: '久坐' | '轻度活动' | '中度活动' | '重度活动';
          healthGoals?: string[];
          dietaryRestrictions?: string[];
        };
      };

      // ... 其他代码保持不变
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 修复 updateHealthData 方法中的类型问题
  public async updateHealthData(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { healthData } = req.body as {
        healthData: {
          bmi?: number;
          bodyFat?: number;
          muscleMass?: number;
          basalMetabolicRate?: number;
          bloodPressure?: {
            systolic: number;
            diastolic: number;
            lastChecked: Date;
          };
          bloodSugar?: {
            value: number;
            lastChecked: Date;
          };
        };
      };

      // ... 其他代码保持不变
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 修复 updateSettings 方法中的类型问题
  public async updateSettings(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { settings } = req.body as {
        settings: {
          notifications: {
            email: boolean;
            push: boolean;
            sms: boolean;
          };
          privacy: {
            shareHealthData: boolean;
            shareProgress: boolean;
            publicProfile: boolean;
          };
          language: string;
          timezone: string;
        };
      };

      // ... 其他代码保持不变
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const profileController = new ProfileController(); 