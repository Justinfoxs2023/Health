/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const TYPES = {
  Logger: Symbol.for('Logger'),
  Redis: Symbol.for('Redis'),
  UserService: Symbol.for('UserService'),
  AuthService: Symbol.for('AuthService'),
  JwtService: Symbol.for('JwtService'),
  EmailService: Symbol.for('EmailService'),
  SmsService: Symbol.for('SmsService'),
  PushService: Symbol.for('PushService'),
  NameGenerator: Symbol.for('NameGenerator'),
  UserRepository: Symbol.for('UserRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  HealthCheck: Symbol.for('HealthCheck'),
};
