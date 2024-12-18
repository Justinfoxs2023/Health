import jwt from 'jsonwebtoken';
import { IAuthRequest, IUser } from '../types/models';
import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';

export class AuthController {
  /**
   * 用户注册
   */
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, role = 'user' } = req.body;

      // 检查邮箱是否已存在
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: '该邮箱已被注册',
        });
        return;
      }

      // 创建新用户
      const user = new User({
        email,
        password,
        name,
        role,
        verificationToken: Math.random().toString(36).substring(2),
      });

      await user.save();

      // 发送验证邮件
      await sendVerificationEmail(user.email, user.verificationToken);

      res.status(201).json({
        success: true,
        message: '注册成功,请查收验证邮件',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 用户登录
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // 查找用户
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          message: '用户不存在',
        });
        return;
      }

      // 验证密码
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: '密码错误',
        });
        return;
      }

      // 检查账号是否已验证
      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: '请先验证邮箱',
        });
        return;
      }

      // 生成JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
      });

      // 更新最后登录时间
      user.lastLogin = new Date();
      await user.save();

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
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
   * 验证邮箱
   */
  public async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;

      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        res.status(400).json({
          success: false,
          message: '无效的验证链接',
        });
        return;
      }

      user.isActive = true;
      user.verificationToken = undefined;
      await user.save();

      res.json({
        success: true,
        message: '邮箱验证成功',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 请求重置密码
   */
  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在',
        });
        return;
      }

      // 生成重置token
      const resetToken = Math.random().toString(36).substring(2);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1小时有效期
      await user.save();

      // 发送重置密码邮件
      await sendPasswordResetEmail(user.email, resetToken);

      res.json({
        success: true,
        message: '重置密码邮件已发送',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 重置密码
   */
  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        res.status(400).json({
          success: false,
          message: '重置链接无效或已过期',
        });
        return;
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: '密码重置成功',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 修改密码
   */
  public async changePassword(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.id;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在',
        });
        return;
      }

      // 验证当前密码
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: '当前密码错误',
        });
        return;
      }

      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: '密码修改成功',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const authController = new AuthController();
