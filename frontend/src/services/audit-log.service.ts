import { api } from '../utils/api';

export interface AuditLog {
  userId: string;
  action: string;
  module: string;
  details: any;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export class AuditLogService {
  async logAction(action: string, module: string, details: any) {
    try {
      const log: Partial<AuditLog> = {
        action,
        module,
        details,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      };

      await api.post('/api/audit/log', log);
    } catch (error) {
      console.error('记录操作日志失败:', error);
    }
  }

  async getAuditLogs(filters: any) {
    try {
      const response = await api.get('/api/audit/logs', { params: filters });
      return response.data;
    } catch (error) {
      console.error('获取操作日志失败:', error);
      throw error;
    }
  }
} 