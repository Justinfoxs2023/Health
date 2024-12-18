import { ConfigLoader } from '../config/config.loader';
import { Logger } from '../types/logger';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class ServiceClient {
  private config = ConfigLoader.getInstance();

  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {}

  async callService(
    serviceName: string,
    endpoint: string,
    method: string,
    data?: any,
  ): Promise<any> {
    try {
      const serviceUrl = this.config.get(`${serviceName.toUpperCase()}_URL`);
      // 实现服务间调用逻辑
    } catch (error) {
      this.logger.error(`服务调用失败: ${serviceName}/${endpoint}`, error);
      throw error;
    }
  }
}
