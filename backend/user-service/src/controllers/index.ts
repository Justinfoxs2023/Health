/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export * from './user.controller';
export * from './auth.controller';
export * from './doctor.controller';
export * from './nutritionist.controller';
export * from './fitness.controller';
export * from './tcm.controller';
export * from './psychologist.controller';
export * from './advisor.controller';
export * from './admin.controller';

// 导出控制器类型
export type UserControllerType = import('./user.controller').UserController;
export type AuthControllerType = import('./auth.controller').AuthController;
export type DoctorControllerType = import('./doctor.controller').DoctorController;
