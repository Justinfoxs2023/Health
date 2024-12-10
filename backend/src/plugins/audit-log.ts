import mongoose from 'mongoose';
import { logger } from '../services/logger';

interface AuditLog {
  collection: string;
  operation: string;
  documentId: mongoose.Types.ObjectId;
  oldValue?: any;
  newValue?: any;
  userId?: mongoose.Types.ObjectId;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

const auditLogSchema = new mongoose.Schema<AuditLog>({
  collection: { type: String, required: true },
  operation: { type: String, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  userId: { type: mongoose.Schema.Types.ObjectId },
  timestamp: { type: Date, required: true },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

const AuditLogModel = mongoose.model<AuditLog>('AuditLog', auditLogSchema);

function auditPlugin(schema: mongoose.Schema) {
  // 保存前
  schema.pre('save', async function(next) {
    if (this.isNew) {
      await logAudit({
        collection: this.collection.name,
        operation: 'create',
        documentId: this._id,
        newValue: this.toObject(),
        userId: (this as any).userId,
        timestamp: new Date()
      });
    } else if (this.isModified()) {
      const oldValue = await this.constructor.findById(this._id);
      await logAudit({
        collection: this.collection.name,
        operation: 'update',
        documentId: this._id,
        oldValue: oldValue?.toObject(),
        newValue: this.toObject(),
        userId: (this as any).userId,
        timestamp: new Date()
      });
    }
    next();
  });

  // 删除前
  schema.pre('remove', async function(next) {
    await logAudit({
      collection: this.collection.name,
      operation: 'delete',
      documentId: this._id,
      oldValue: this.toObject(),
      userId: (this as any).userId,
      timestamp: new Date()
    });
    next();
  });

  // 添加静态方法
  schema.statics.getAuditLogs = async function(
    documentId: mongoose.Types.ObjectId
  ): Promise<AuditLog[]> {
    return AuditLogModel.find({
      collection: this.collection.name,
      documentId
    }).sort({ timestamp: -1 });
  };

  // 添加实例方法
  schema.methods.getAuditLogs = async function(): Promise<AuditLog[]> {
    return AuditLogModel.find({
      collection: this.collection.name,
      documentId: this._id
    }).sort({ timestamp: -1 });
  };
}

async function logAudit(log: AuditLog): Promise<void> {
  try {
    // 获取当前请求上下文
    const ctx = getRequestContext();
    if (ctx) {
      log.ipAddress = ctx.ip;
      log.userAgent = ctx.userAgent;
    }

    // 清理敏感数据
    if (log.oldValue) {
      log.oldValue = sanitizeData(log.oldValue);
    }
    if (log.newValue) {
      log.newValue = sanitizeData(log.newValue);
    }

    // 保存审计日志
    await new AuditLogModel(log).save();
  } catch (error) {
    logger.error('审计日志记录失败:', error);
  }
}

function getRequestContext(): { ip?: string; userAgent?: string } | null {
  // 这里需要根据实际的请求上下文实现获取方式
  // 例如使用 async_hooks 或其他方式获取请求上下文
  return null;
}

function sanitizeData(data: any): any {
  const sensitiveFields = ['password', 'token', 'secret'];
  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '******';
    }
  }

  return sanitized;
}

// 导出插件和模型
export { auditPlugin, AuditLogModel, AuditLog };

// 默认导出插件函数
export default function(schema: mongoose.Schema) {
  auditPlugin(schema);
} 