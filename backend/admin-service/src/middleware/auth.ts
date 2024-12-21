import { ILogger } from '../types/logger';
import { Request, Response, NextFunction } from 'express';
import { container } from '../di/container';

const logger = container.get<ILogger>(TYPES.Logger);

export interface IAuthenticatedRequest extends Request {
  /** user 的描述 */
  user?: {
    id: string;
    roles: string[];
  };
}

export const authMiddleware = (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    // 验证令牌并设置用户信息
    req.user = { id: 'test-user', roles: ['admin'] }; // 实际应从令牌中解析

    next();
  } catch (error) {
    logger.error('认证失败', error);
    res.status(401).json({ message: '认证失败' });
  }
};

export const adminMiddleware = (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.roles.includes('admin')) {
    return res.status(403).json({ message: '需要管理员权限' });
  }
  next();
};
