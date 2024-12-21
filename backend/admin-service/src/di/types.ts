/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

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
  SystemSettingsController: Symbol.for('SystemSettingsController'),
};
