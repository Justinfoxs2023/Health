export * from './doctor.service';
export * from './nutritionist.service';
export * from './fitness.service';
export * from './tcm.service';
export * from './psychologist.service';
export * from './advisor.service';

// 导出专业服务类型
export type DoctorService = import('./doctor.service').DoctorService;
export type NutritionistService = import('./nutritionist.service').NutritionistService;
export type FitnessService = import('./fitness.service').FitnessService;
export type TCMService = import('./tcm.service').TCMService;
export type PsychologistService = import('./psychologist.service').PsychologistService;
export type AdvisorService = import('./advisor.service').AdvisorService; 