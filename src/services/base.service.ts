import { Logger } from '../utils/logger';

export abstract class BaseService {
  protected logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  protected async handleError(error: any, message: string): Promise<never> {
    this.logger.error(message, error);
    throw error;
  }

  protected validateInput<T>(input: any, schema: Record<keyof T, any>): boolean {
    // 实现输入验证逻辑
    return true;
  }
}
