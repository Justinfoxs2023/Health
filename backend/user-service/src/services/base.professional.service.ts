import { AppError } from '../utils/errors';
import { BaseService } from './base.service';
import { DatabaseOperations } from '../database/operations';
import { Logger } from '../utils/logger';

export abstract class BaseProfessionalService extends BaseService {
  protected dbOps: DatabaseOperations<any>;
  protected logger: Logger;

  constructor(serviceName: string, model: any) {
    super(serviceName);
    this.dbOps = new DatabaseOperations(model, serviceName);
    this.logger = new Logger(serviceName);
  }

  protected async validateAccess(professionalId: string, clientId: string): Promise<boolean> {
    try {
      const relationship = await this.dbOps.findOne({
        professionalId,
        clientId,
        status: 'active',
      });
      return !!relationship;
    } catch (error) {
      this.logger.error('Access validation failed', error);
      throw new AppError('访问验证失败', 403);
    }
  }

  protected async getClientList(
    professionalId: string,
    page: number,
    limit: number,
    status?: string,
  ) {
    try {
      const query = { professionalId };
      if (status) {
        Object.assign(query, { status });
      }

      return await this.dbOps.find(query, {
        skip: (page - 1) * limit,
        limit,
        sort: { updatedAt: -1 },
      });
    } catch (error) {
      this.logger.error('Failed to get client list', error);
      throw new AppError('获取客户列表失败', 500);
    }
  }
}
