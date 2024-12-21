import 'reflect-metadata';
import express from 'express';
import { Container } from 'inversify';
import { ErrorHandler } from './middleware/error-handler';
import { HealthCheckService } from './services/health-check.service';
import { TYPES } from './di/types';
import { configureMiddleware } from './middleware';
import { configureRoutes } from './routes';

export class App {
  private app: express.Application;
  private container: Container;

  constructor() {
    this.app = express();
    this.container = new Container();
    this.configureContainer();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureContainer(): void {
    // 配置依赖注入容器
  }

  private configureMiddleware(): void {
    configureMiddleware(this.app);
  }

  private configureRoutes(): void {
    configureRoutes(this.app);
  }

  private configureErrorHandling(): void {
    this.app.use(ErrorHandler.handle);
  }

  public async start(): Promise<void> {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // 启动健康检查
    const healthCheck = this.container.get<HealthCheckService>(TYPES.HealthCheck);
    await healthCheck.start();
  }
}
