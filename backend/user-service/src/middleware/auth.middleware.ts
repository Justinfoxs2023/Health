import { JwtService } from '../utils/jwt.service';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../di/types';
import { UnauthorizedError } from '../utils/errors';
import { injectable, inject } from 'inversify';

@injectable()
export class AuthMiddleware {
  constructor(@inject(TYPES.JwtService) private jwtService: JwtService) {}

  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedError('未提供token');
      }

      const payload = await this.jwtService.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      next(new UnauthorizedError('无效的token'));
    }
  }

  checkRole(role: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user?.roles.includes(role)) {
        next(new UnauthorizedError('权限不足'));
        return;
      }
      next();
    };
  }
}
