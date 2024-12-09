declare module '../models/*' {
  import { Document } from 'mongoose';

  // 健康记录模型
  export interface HealthRecord extends Document {
    userId: string;
    type: string;
    metrics: Record<string, any>;
    timestamp: Date;
    source: string;
  }

  // 审计日志模型
  export interface AuditLog extends Document {
    userId: string;
    action: string;
    resource: string;
    details: any;
    timestamp: Date;
  }

  // 通知模型
  export interface Notification extends Document {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
} 