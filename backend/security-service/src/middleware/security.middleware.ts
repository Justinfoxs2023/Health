import { Logger } from '../utils/logger';
import { RateLimiter } from '../utils/rate-limiter';
import { Request, Response, NextFunction } from 'express';
import { SecurityService } from '../services/security.service';

export class SecurityMiddleware {
  private securityService: SecurityService;
  private rateLimiter: RateLimiter;
  private logger: Logger;

  constructor() {
    this.securityService = new SecurityService();
    this.rateLimiter = new RateLimiter();
    this.logger = new Logger('SecurityMiddleware');
  }

  /**
   * 验证请求
   */
  validateRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 检查请求头
      if (!this.validateHeaders(req)) {
        return res.status(400).json({
          code: 400,
          message: '无效的请求头',
        });
      }

      // 验证令牌
      const token = req.headers.authorization?.split(' ')[1];
      if (!token || !(await this.securityService.validateToken(token))) {
        return res.status(401).json({
          code: 401,
          message: '无效的访问令牌',
        });
      }

      // 检查权限
      if (!(await this.checkPermissions(req))) {
        return res.status(403).json({
          code: 403,
          message: '权限不足',
        });
      }

      next();
    } catch (error) {
      this.logger.error('请求验证失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  };

  /**
   * 速率限制
   */
  rateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `rate:${req.ip}`;
      if (!(await this.rateLimiter.checkLimit(key))) {
        return res.status(429).json({
          code: 429,
          message: '请求过于频繁',
        });
      }
      next();
    } catch (error) {
      this.logger.error('速率限制检查失败', error);
      next();
    }
  };

  /**
   * 数据加密
   */
  encryptResponse = async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    res.send = async function (body: any) {
      try {
        if (body && typeof body === 'object') {
          const encryptedData = await this.securityService.encryptData(body);
          arguments[0] = encryptedData;
        }
        return originalSend.apply(res, arguments);
      } catch (error) {
        this.logger.error('响应加密失败', error);
        return originalSend.apply(res, arguments);
      }
    }.bind(this);

    next();
  };

  /**
   * 验证请求头
   */
  private validateHeaders(req: Request): boolean {
    // 检查必要的请求头
    const requiredHeaders = ['content-type', 'user-agent'];
    return requiredHeaders.every(header => req.headers[header]);
  }

  /**
   * 检查权限
   */
  private async checkPermissions(req: Request): Promise<boolean> {
    const userId = req.user?.id;
    if (!userId) return false;

    const resource = req.baseUrl.split('/')[1];
    const action = this.getActionFromMethod(req.method);

    return this.securityService.checkPermission(userId, resource, action);
  }

  /**
   * 获取操作类型
   */
  private getActionFromMethod(method: string): string {
    const actionMap: { [key: string]: string } = {
      GET: 'read',
      POST: 'create',
      PUT: 'update',
      DELETE: 'delete',
    };
    return actionMap[method] || 'read';
  }
}
