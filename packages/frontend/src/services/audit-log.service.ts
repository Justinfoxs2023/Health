import { api } from '../utils/api';

export interface IAuditLog {
  /** userId 的描述 */
  userId: string;
  /** action 的描述 */
  action: string;
  /** module 的描述 */
  module: string;
  /** details 的描述 */
  details: any;
  /** timestamp 的描述 */
  timestamp: Date;
  /** ipAddress 的描述 */
  ipAddress: string;
  /** userAgent 的描述 */
  userAgent: string;
}

export class AuditLogService {
  async logAction(action: string, module: string, details: any) {
    try {
      const log: Partial<IAuditLog> = {
        action,
        module,
        details,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
      };

      await api.post('/api/audit/log', log);
    } catch (error) {
      console.error('Error in audit-log.service.ts:', '记录操作日志失败:', error);
    }
  }

  async getAuditLogs(filters: any) {
    try {
      const response = await api.get('/api/audit/logs', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error in audit-log.service.ts:', '获取操作日志失败:', error);
      throw error;
    }
  }
}
