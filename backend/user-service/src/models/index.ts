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
export type User = import('./user.model').User;
export type Profile = import('./profile.model').Profile;
export type HealthData = import('./health-data.model').HealthData;
export type Notification = import('./notification.model').Notification;
export type AuditLog = import('./audit-log.model').AuditLog; 