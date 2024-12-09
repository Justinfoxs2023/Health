import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { Logger } from '../utils/logger';
import { validateUserUpdate } from '../utils/validators';

export class UserController {
  private userService: UserService;
  private logger: Logger;

  constructor() {
    this.userService = new UserService();
    this.logger = new Logger('UserController');
  }

  public async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          code: 401,
          message: '未授权的访问'
        });
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在'
        });
      }

      const safeUser = this.userService.sanitizeUser(user);
      return res.json({
        code: 200,
        data: safeUser
      });

    } catch (error) {
      this.logger.error('获取用户信息失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 更新用户信息
   */
  public async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      // 验证更新数据
      const { error } = validateUserUpdate(updateData);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: error.details[0].message
        });
      }

      // 更新用户信息
      const updatedUser = await this.userService.updateUser(userId, updateData);
      
      // 更新用户画像
      await this.profileService.updateProfile(userId, updateData);

      return res.json({
        code: 200,
        data: this.userService.sanitizeUser(updatedUser),
        message: '更新成功'
      });
    } catch (error) {
      this.logger.error('更新用户信息失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 更新用户头像
   */
  public async updateAvatar(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          code: 400,
          message: '请上传头像文件'
        });
      }

      const avatarUrl = await this.userService.uploadAvatar(userId, file);

      return res.json({
        code: 200,
        data: { avatarUrl },
        message: '头像更新成功'
      });
    } catch (error) {
      this.logger.error('更新头像失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 