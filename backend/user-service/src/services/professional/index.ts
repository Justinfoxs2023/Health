/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export * from './doctor.service';
export * from './nutritionist.service';
export * from './fitness.service';
export * from './tcm.service';
export * from './psychologist.service';
export * from './advisor.service';

// 导出专业服务类型
export type DoctorServiceType = import('./doctor.service').DoctorService;
export type NutritionistServiceType = import('./nutritionist.service').NutritionistService;
export type FitnessServiceType = import('./fitness.service').FitnessService;
export type TCMServiceType = import('./tcm.service').TCMService;
export type PsychologistServiceType = import('./psychologist.service').PsychologistService;
export type AdvisorServiceType = import('./advisor.service').AdvisorService;
