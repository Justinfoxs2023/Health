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
export type UserController = import('./user.controller').UserController;
export type AuthController = import('./auth.controller').AuthController;
export type DoctorController = import('./doctor.controller').DoctorController; 