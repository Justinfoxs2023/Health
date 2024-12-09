import { Router, Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { EventEmitter } from 'events';
import { validate } from 'class-validator';
import { MiddlewareChain } from './middleware/middleware-chain';
import { ErrorHandler } from './middleware/error-handler';
import { RequestValidator } from './middleware/request-validator';
import { ResponseFormatter } from './middleware/response-formatter';

export interface ApiConfig {
  prefix?: string;
  cors?: boolean;
  rateLimit?: {
    windowMs: number;
    max: number;
  };
  timeout?: number;
}

export class ApiService extends EventEmitter {
  private router: Router;
  private logger: Logger;
  private middlewareChain: MiddlewareChain;
  private errorHandler: ErrorHandler;
  private validator: RequestValidator;
  private formatter: ResponseFormatter;

  constructor(config: ApiConfig = {}) {
    super();
    this.router = Router();
    this.logger = new Logger('ApiService');
    
    // 初始化各个组件
    this.middlewareChain = new MiddlewareChain();
    this.errorHandler = new ErrorHandler(this.logger);
    this.validator = new RequestValidator();
    this.formatter = new ResponseFormatter();

    this.initializeMiddlewares(config);
  }

  // 初始化基础中间件
  private initializeMiddlewares(config: ApiConfig): void {
    // 请求日志
    this.use(this.createRequestLogger());
    
    // CORS
    if (config.cors) {
      this.use(this.createCorsMiddleware());
    }

    // 超时处理
    if (config.timeout) {
      this.use(this.createTimeoutMiddleware(config.timeout));
    }

    // 请求限流
    if (config.rateLimit) {
      this.use(this.createRateLimiter(config.rateLimit));
    }

    // 响应格式化
    this.use(this.formatter.middleware());

    // 错误处理(放在最后)
    this.use(this.errorHandler.middleware());
  }

  // 注册路由
  registerRoute(config: {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    handler: (req: Request, res: Response) => Promise<any>;
    validation?: any;
    middlewares?: any[];
  }): void {
    const { path, method, handler, validation, middlewares = [] } = config;

    // 构建中间件链
    const chain = [
      ...middlewares,
      validation ? this.validator.validate(validation) : [],
      this.wrapHandler(handler)
    ].flat();

    // 注册路由
    this.router[method](path, ...chain);
    
    this.logger.info(`注册路由: ${method.toUpperCase()} ${path}`);
  }

  // 包装请求处理器
  private wrapHandler(handler: (req: Request, res: Response) => Promise<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await handler(req, res);
        if (!res.headersSent) {
          res.json(this.formatter.format(result));
        }
      } catch (error) {
        next(error);
      }
    };
  }

  // 添加中间件
  use(middleware: (req: Request, res: Response, next: NextFunction) => void): void {
    this.middlewareChain.add(middleware);
    this.router.use(middleware);
  }

  // 创建请求日志中间件
  private createRequestLogger() {
    return (req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      this.logger.info(`${req.method} ${req.path}`);

      res.on('finish', () => {
        const duration = Date.now() - start;
        this.logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
      });

      next();
    };
  }

  // 获取路由实例
  getRouter(): Router {
    return this.router;
  }

  // 健康检查
  addHealthCheck(): void {
    this.registerRoute({
      path: '/health',
      method: 'get',
      handler: async () => ({
        status: 'ok',
        timestamp: Date.now(),
        uptime: process.uptime()
      })
    });
  }

  // 启动服务
  start(): void {
    this.addHealthCheck();
    this.emit('started');
    this.logger.info('API服务已启动');
  }

  // 停止服务
  stop(): void {
    this.emit('stopped');
    this.logger.info('API服务已停止');
  }
} 