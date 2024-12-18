import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserSettingsController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // 更新用户设置
  async updateUserSettings(req: Request, res: Response) {
    const { theme, notifications } = req.body;
    try {
      await this.userService.updateSettings(req.user.id, { theme, notifications });
      return res.status(200).json({ message: '设置更新成功' });
    } catch (error) {
      return res.status(500).json({ message: '更新失败', error });
    }
  }
}
