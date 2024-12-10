import { Injectable } from '@nestjs/common';
import { Logger } from '../utils/logger';
import { SecurityConfig } from '../security/security.config';
import { SecurityService } from '../security/security.service';
import * as mongoose from 'mongoose';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);
  private readonly securityService: SecurityService;

  // 审计日志模型
  private readonly AuditLogModel = mongoose.model('AuditLog', new mongoose.Schema({
    timestamp: { type: Date, required: true, index: true },
    userId: { type: String, required: true, index: true },
    event: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    action: { type: String, required: true },
    status: { type: String, required: true },
    details: mongoose.Schema.Types.Mixed,
    metadata: {
      ip: String,
      userAgent: String,
      sessionId: String,
      requestId: String
    },
    changes: [{
      field: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed
    }],
    relatedResources: [{
      type: String,
      id: String
    }]
  }, {
    timestamps: true,
    versionKey: false
  }));

  constructor() {
    this.securityService = new SecurityService();
    this.setupCleanupJob();
  }

  /**
   * 记录审计日志
   */
  async log(params: {
    userId: string;
    event: string;
    category: string;
    action: string;
    status: 'success' | 'failure' | 'warning';
    details?: any;
    metadata?: {
      ip?: string;
      userAgent?: string;
      sessionId?: string;
      requestId?: string;
    };
    changes?: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }>;
    relatedResources?: Array<{
      type: string;
      id: string;
    }>;
  }): Promise<string> {
    try {
      // 验证事件类型
      if (!SecurityConfig.AUDIT_LOG.events.includes(params.event)) {
        throw new Error(`无效的审计事件类型: ${params.event}`);
      }

      // 脱敏敏感数据
      const maskedDetails = params.details
        ? this.securityService.maskSensitiveData(params.details)
        : undefined;

      const maskedChanges = params.changes?.map(change => ({
        field: change.field,
        oldValue: SecurityConfig.AUDIT_LOG.sensitiveFields.includes(change.field)
          ? '******'
          : change.oldValue,
        newValue: SecurityConfig.AUDIT_LOG.sensitiveFields.includes(change.field)
          ? '******'
          : change.newValue
      }));

      // 创建审计日志
      const auditLog = new this.AuditLogModel({
        timestamp: new Date(),
        userId: params.userId,
        event: params.event,
        category: params.category,
        action: params.action,
        status: params.status,
        details: maskedDetails,
        metadata: params.metadata,
        changes: maskedChanges,
        relatedResources: params.relatedResources
      });

      const result = await auditLog.save();

      this.logger.info('审计日志记录成功', {
        userId: params.userId,
        event: params.event,
        action: params.action
      });

      return result._id.toString();
    } catch (error) {
      this.logger.error('审计日志记录失败', error);
      throw error;
    }
  }

  /**
   * 查询审计日志
   */
  async query(params: {
    userId?: string;
    event?: string;
    category?: string;
    status?: string;
    startTime?: Date;
    endTime?: Date;
    page?: number;
    pageSize?: number;
    sort?: {
      field: string;
      order: 'asc' | 'desc';
    };
  }): Promise<{
    logs: any[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const query: any = {};

      // 构建查询条件
      if (params.userId) query.userId = params.userId;
      if (params.event) query.event = params.event;
      if (params.category) query.category = params.category;
      if (params.status) query.status = params.status;

      if (params.startTime || params.endTime) {
        query.timestamp = {};
        if (params.startTime) query.timestamp.$gte = params.startTime;
        if (params.endTime) query.timestamp.$lte = params.endTime;
      }

      // 分页参数
      const page = params.page || 1;
      const pageSize = params.pageSize || 20;
      const skip = (page - 1) * pageSize;

      // 排序参数
      const sort = {};
      if (params.sort) {
        sort[params.sort.field] = params.sort.order === 'asc' ? 1 : -1;
      } else {
        sort['timestamp'] = -1; // 默认按时间倒序
      }

      // 执行查询
      const [logs, total] = await Promise.all([
        this.AuditLogModel
          .find(query)
          .sort(sort)
          .skip(skip)
          .limit(pageSize)
          .lean(),
        this.AuditLogModel.countDocuments(query)
      ]);

      return {
        logs,
        total,
        page,
        pageSize
      };
    } catch (error) {
      this.logger.error('审计日志查询失败', error);
      throw error;
    }
  }

  /**
   * 获取审计统计信息
   */
  async getStats(params: {
    startTime?: Date;
    endTime?: Date;
    userId?: string;
  }): Promise<{
    totalEvents: number;
    eventsByCategory: Record<string, number>;
    eventsByStatus: Record<string, number>;
    topUsers: Array<{
      userId: string;
      count: number;
    }>;
    timeDistribution: Array<{
      hour: number;
      count: number;
    }>;
  }> {
    try {
      const query: any = {};

      if (params.startTime || params.endTime) {
        query.timestamp = {};
        if (params.startTime) query.timestamp.$gte = params.startTime;
        if (params.endTime) query.timestamp.$lte = params.endTime;
      }

      if (params.userId) query.userId = params.userId;

      const [
        totalEvents,
        eventsByCategory,
        eventsByStatus,
        topUsers,
        timeDistribution
      ] = await Promise.all([
        // 总事件数
        this.AuditLogModel.countDocuments(query),

        // 按类别统计
        this.AuditLogModel.aggregate([
          { $match: query },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ]),

        // 按状态统计
        this.AuditLogModel.aggregate([
          { $match: query },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),

        // 活跃用户统计
        this.AuditLogModel.aggregate([
          { $match: query },
          {
            $group: {
              _id: '$userId',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),

        // 时间分布统计
        this.AuditLogModel.aggregate([
          { $match: query },
          {
            $group: {
              _id: { $hour: '$timestamp' },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id': 1 } }
        ])
      ]);

      return {
        totalEvents,
        eventsByCategory: Object.fromEntries(
          eventsByCategory.map(item => [item._id, item.count])
        ),
        eventsByStatus: Object.fromEntries(
          eventsByStatus.map(item => [item._id, item.count])
        ),
        topUsers: topUsers.map(item => ({
          userId: item._id,
          count: item.count
        })),
        timeDistribution: timeDistribution.map(item => ({
          hour: item._id,
          count: item.count
        }))
      };
    } catch (error) {
      this.logger.error('获取审计统计信息失败', error);
      throw error;
    }
  }

  /**
   * 导出审计日志
   */
  async export(params: {
    format: 'csv' | 'json';
    userId?: string;
    event?: string;
    category?: string;
    status?: string;
    startTime?: Date;
    endTime?: Date;
  }): Promise<Buffer> {
    try {
      const query: any = {};

      // 构建查询条件
      if (params.userId) query.userId = params.userId;
      if (params.event) query.event = params.event;
      if (params.category) query.category = params.category;
      if (params.status) query.status = params.status;

      if (params.startTime || params.endTime) {
        query.timestamp = {};
        if (params.startTime) query.timestamp.$gte = params.startTime;
        if (params.endTime) query.timestamp.$lte = params.endTime;
      }

      // 查询数据
      const logs = await this.AuditLogModel
        .find(query)
        .sort({ timestamp: -1 })
        .lean();

      // 格式化数据
      if (params.format === 'csv') {
        const fields = [
          'timestamp',
          'userId',
          'event',
          'category',
          'action',
          'status'
        ];
        const csv = [
          fields.join(','), // 表头
          ...logs.map(log =>
            fields.map(field =>
              JSON.stringify(log[field] || '')
            ).join(',')
          )
        ].join('\n');

        return Buffer.from(csv, 'utf8');
      } else {
        return Buffer.from(JSON.stringify(logs, null, 2), 'utf8');
      }
    } catch (error) {
      this.logger.error('导出审计日志失败', error);
      throw error;
    }
  }

  /**
   * 清理过期日志
   */
  private async cleanupOldLogs(): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setTime(cutoffDate.getTime() - SecurityConfig.AUDIT_LOG.retention);

      const result = await this.AuditLogModel.deleteMany({
        timestamp: { $lt: cutoffDate }
      });

      this.logger.info('清理过期审计日志完成', {
        deletedCount: result.deletedCount
      });
    } catch (error) {
      this.logger.error('清理过期审计日志失败', error);
    }
  }

  /**
   * 设置清理任务
   */
  private setupCleanupJob(): void {
    // 每天凌晨2点执行清理
    const now = new Date();
    const nextRun = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      2, 0, 0
    );
    const timeToNextRun = nextRun.getTime() - now.getTime();

    // 设置定时任务
    setTimeout(() => {
      this.cleanupOldLogs();
      // 设置每24小时执行一次
      setInterval(() => this.cleanupOldLogs(), 24 * 60 * 60 * 1000);
    }, timeToNextRun);
  }
} 