import { AIError } from '../utils/errors';
import { BaseService } from './base.service';
import { Logger } from '../utils/logger';

export abstract class BaseAIService extends BaseService {
  protected logger: Logger;

  constructor(serviceName: string) {
    super(serviceName);
    this.logger = new Logger(serviceName);
  }

  protected async validateInput(input: any, schema: any) {
    try {
      const { error } = schema.validate(input);
      if (error) {
        throw new AIError(`输入验证失败: ${error.message}`);
      }
    } catch (error) {
      this.logger.error('Input validation failed', error);
      throw error;
    }
  }

  protected async preprocessData(data: any) {
    try {
      // 实现数据预处理逻辑
      return data;
    } catch (error) {
      this.logger.error('Data preprocessing failed', error);
      throw new AIError('数据预处理失败');
    }
  }

  protected async postprocessResult(result: any) {
    try {
      // 实现结果后处理逻辑
      return result;
    } catch (error) {
      this.logger.error('Result postprocessing failed', error);
      throw new AIError('结果后处理失败');
    }
  }
}
