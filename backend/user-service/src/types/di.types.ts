/**
 * @fileoverview TS 文件 di.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const TYPES = {
  Logger: Symbol.for('Logger'),
  Redis: Symbol.for('Redis'),
  UserRepository: Symbol.for('UserRepository'),
  EmailService: Symbol.for('EmailService'),
  JwtService: Symbol.for('JwtService'),
  AuthService: Symbol.for('AuthService'),
};
