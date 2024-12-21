import { Controller, All, Req, Res } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { IGatewayRequest, IRouteConfig, IGatewayMetrics, IRouteStatus } from './interfaces';
import { Logger } from '../logger/logger.service';
import { Request, Response } from 'express';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService, private readonly logger: Logger) {}

  @All()
  async handleRequest(@Req() req: Request, @Res() res: Response) {
    try {
      const gatewayRequest: IGatewayRequest = {
        path: req.path,
        method: req.method,
        headers: req.headers as Record<string, string>,
        query: req.query as Record<string, string>,
        body: req.body,
        ip: req.ip,
      };

      const response = await this.gatewayService.handleRequest(gatewayRequest);

      res.status(response.status).set(response.headers).send(response.body);
    } catch (error) {
      this.logger.error('网关请求处理错误', error);

      res.status(500).json({
        error: '内部服务器错误',
        message: error.message,
      });
    }
  }

  // 路由管理
  @Post()
  async addRoute(@Body() config: IRouteConfig) {
    try {
      await this.gatewayService.addRoute(config.path, config);
      return { message: '路由添加成功' };
    } catch (error) {
      this.logger.error('添加路由失败', error);
      throw error;
    }
  }

  @Delete()
  async removeRoute(@Param() path: string) {
    try {
      await this.gatewayService.removeRoute(path);
      return { message: '路由删除成功' };
    } catch (error) {
      this.logger.error('删除路由失败', error);
      throw error;
    }
  }

  // 速率限制管理
  @Put()
  async updateRateLimit(@Param() path: string, @Body() limit: number) {
    try {
      await this.gatewayService.updateRateLimit(path, limit);
      return { message: '速率限制更新成功' };
    } catch (error) {
      this.logger.error('更新速率限制失败', error);
      throw error;
    }
  }

  // 黑名单管理
  @Post()
  async addToBlacklist(@Body() ip: string) {
    try {
      await this.gatewayService.addToBlacklist(ip);
      return { message: 'IP已添加到黑名单' };
    } catch (error) {
      this.logger.error('添加黑名单失败', error);
      throw error;
    }
  }

  @Delete()
  async removeFromBlacklist(@Param() ip: string) {
    try {
      await this.gatewayService.removeFromBlacklist(ip);
      return { message: 'IP已从黑名单移除' };
    } catch (error) {
      this.logger.error('移除黑名单失败', error);
      throw error;
    }
  }

  // 监控和统计
  @Get()
  getMetrics(): IGatewayMetrics {
    return this.gatewayService.getMetrics();
  }

  @Get()
  getRouteStatus(@Param() path: string): IRouteStatus {
    return this.gatewayService.getRouteStatus(path);
  }

  // 健康检查
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    };
  }

  // 配置管理
  @Get()
  async getConfig() {
    try {
      const config = await this.gatewayService.getConfig();
      return config;
    } catch (error) {
      this.logger.error('获取配置失败', error);
      throw error;
    }
  }

  @Put()
  async updateConfig(@Body() config: any) {
    try {
      await this.gatewayService.updateConfig(config);
      return { message: '配置更新成功' };
    } catch (error) {
      this.logger.error('更新配置失败', error);
      throw error;
    }
  }

  // 缓存管理
  @Post()
  async clearCache() {
    try {
      await this.gatewayService.clearCache();
      return { message: '缓存清理成功' };
    } catch (error) {
      this.logger.error('清理缓存失败', error);
      throw error;
    }
  }

  // 服务发现
  @Get()
  async getServices() {
    try {
      const services = await this.gatewayService.getServices();
      return services;
    } catch (error) {
      this.logger.error('获取服务列表失败', error);
      throw error;
    }
  }

  // 负载均衡
  @Get()
  async getLoadBalancerStatus() {
    try {
      const status = await this.gatewayService.getLoadBalancerStatus();
      return status;
    } catch (error) {
      this.logger.error('获取负载均衡状态失败', error);
      throw error;
    }
  }

  // 断路器
  @Get()
  async getCircuitBreakerStatus() {
    try {
      const status = await this.gatewayService.getCircuitBreakerStatus();
      return status;
    } catch (error) {
      this.logger.error('获取断路器状态失败', error);
      throw error;
    }
  }

  // API文档
  @Get()
  async getApiDocs() {
    try {
      const docs = await this.gatewayService.getApiDocs();
      return docs;
    } catch (error) {
      this.logger.error('获取API文档失败', error);
      throw error;
    }
  }
}
