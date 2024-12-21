/**
 * @fileoverview TS 文件 professional-services.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 医生服务类型
export interface IDoctorService {
  getPatientList(doctorId: string, page: number, limit: number, status?: string): Promise<any>;
  getPatientDetail(doctorId: string, patientId: string): Promise<any>;
  createPrescription(data: any): Promise<any>;
  createConsultation(data: any): Promise<any>;
}

// 营养师服务类型
export interface INutritionistService {
  createDietPlan(data: any): Promise<any>;
  getClientList(nutritionistId: string, page: number, limit: number): Promise<any>;
}

// 健身教练服务类型
export interface IFitnessService {
  createTrainingPlan(data: any): Promise<any>;
  getClientProgress(clientId: string): Promise<any>;
}

// 中医服务类型
export interface ITCMService {
  createPrescription(data: any): Promise<any>;
  createWellnessPlan(data: any): Promise<any>;
}

// 心理咨询师服务类型
export interface IPsychologistService {
  createCounselingRecord(data: any): Promise<any>;
  createInterventionPlan(data: any): Promise<any>;
}
