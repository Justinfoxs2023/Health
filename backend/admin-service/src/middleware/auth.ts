import { Request, Response, NextFunction } from 'express';
import { container } from '../di/container';
import { Logger } from '../types/logger';

const logger = container.get<Logger>(TYPES.Logger);

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.roles.includes('admin')) {
    return res.status(403).json({ message: '需要管理员权限' });
  }
  next();
}; 