import { BaseService } from '../base.service';
import { Logger } from '../../utils/logger';
import { Redis } from '../../utils/redis';
import { DatabaseOperations } from '../../database/operations';

export abstract class BaseProfessionalService extends BaseService {
  protected dbOps: DatabaseOperations<any>;
  
  constructor(serviceName: string, model: any) {
    super(serviceName);
    this.dbOps = new DatabaseOperations(model, serviceName);
  }

  protected async validateAccess(professionalId: string, clientId: string): Promise<boolean> {
    try {
      // 验证专业人员是否有权限访问该客户
      const relationship = await this.dbOps.findOne({
        professionalId,
        clientId,
        status: 'active'
      });
      return !!relationship;
    } catch (error) {
      this.logger.error('Access validation failed', error);
      return false;
    }
  }

  protected async getClientList(professionalId: string, page: number, limit: number, status?: string) {
    try {
      const query = { professionalId };
      if (status) {
        Object.assign(query, { status });
      }
      
      return await this.dbOps.find(query, {
        skip: (page - 1) * limit,
        limit,
        sort: { updatedAt: -1 }
      });
    } catch (error) {
      this.logger.error('Failed to get client list', error);
      throw error;
    }
  }

  protected async createRecord(data: any) {
    try {
      return await this.dbOps.create(data);
    } catch (error) {
      this.logger.error('Failed to create record', error);
      throw error;
    }
  }
} 