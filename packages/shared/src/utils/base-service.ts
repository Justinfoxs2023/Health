import { Logger } from './logger';
import { TypeChecker } from './type-checker';

export abstract class BaseService {
  protected logger: Logger;
  protected typeChecker: TypeChecker;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  protected async handleError(error: any, message: string): Promise<never> {
    this.logger.error(message, error);
    throw error;
  }

  protected validateInput<T>(input: any, schema: Record<keyof T, any>): boolean {
    return TypeChecker.validateObject<T>(input, schema);
  }
} 