/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export * from './user.model';
export * from './profile.model';
export * from './role.model';
export * from './permission.model';
export * from './health-data.model';
export * from './medical-record.model';
export * from './prescription.model';
export * from './notification.model';
export * from './audit-log.model';
export * from './system-config.model';
export * from './professional/doctor.model';
export * from './professional/nutritionist.model';
export * from './professional/fitness.model';
export * from './professional/tcm.model';
export * from './professional/psychologist.model';

// 导出模型类型
export type UserType = import('./user.model').User;
export type ProfileType = import('./profile.model').Profile;
export type HealthDataType = import('./health-data.model').HealthData;
export type NotificationType = import('./notification.model').Notification;
export type AuditLogType = import('./audit-log.model').AuditLog;
