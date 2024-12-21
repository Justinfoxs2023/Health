import { Logger } from '../types';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class AuditService {
  constructor(@inject(TYPES.Logger) private logger: Logger) {}

  async logAction(userId: string, action: string, details: any): Promise<void> {
    try {
      // 记录审计日志
      this.logger.info('Audit Log', {
        userId,
        action,
        details,
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error('审计日志记录失败', error);
      throw error;
    }
  }
}
