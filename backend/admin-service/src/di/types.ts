export const TYPES = {
  // 基础设施
  Logger: Symbol.for('Logger'),
  Redis: Symbol.for('Redis'),

  // 服务
  SystemSettingsService: Symbol.for('SystemSettingsService'),
  AuditService: Symbol.for('AuditService'),
  ConfigManagerService: Symbol.for('ConfigManagerService'),
  InitializationService: Symbol.for('InitializationService'),

  // 控制器
  SystemSettingsController: Symbol.for('SystemSettingsController')
}; 