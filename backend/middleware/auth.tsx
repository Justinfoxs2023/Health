import jwt from 'jsonwebtoken';
import { IAuthRequest } from '../types/models';
import { Response, NextFunction } from 'express';
import { User } from '../models/user.model';

class Auth {
  /**
   * 验证用户是否登录
   */
  public required = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({
          success: false,
          message: '未登录',
        });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(401).json({
          success: false,
          message: '用户不存在',
        });
        return;
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: '认证失败',
      });
    }
  };

  /**
   * 验证是否为营养师
   */
  public nutritionistRequired = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.required(req, res, () => {
        if (req.user?.role !== 'nutritionist') {
          res.status(403).json({
            success: false,
            message: '需要营养师权限',
          });
          return;
        }
        next();
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: '认证失败',
      });
    }
  };

  /**
   * 验证是否为管理员
   */
  public adminRequired = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.required(req, res, () => {
        if (req.user?.role !== 'admin') {
          res.status(403).json({
            success: false,
            message: '需要管理员权限',
          });
          return;
        }
        next();
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: '认证失败',
      });
    }
  };
}

export const auth = new Auth();
