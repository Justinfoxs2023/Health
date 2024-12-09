import { Request, Response, NextFunction } from 'express';
import { container } from '../di/container';

export function requestContext(req: Request, res: Response, next: NextFunction) {
  // 注入用户信息
  req.user = res.locals.user;
  
  // 注入请求ID
  req.requestId = uuid();
  
  // 注入依赖容器
  req.container = container;

  next();
} 