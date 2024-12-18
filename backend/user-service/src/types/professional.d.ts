/**
 * @fileoverview TS 文件 professional.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IDoctorService {
  getPatientList(doctorId: string, page: number, limit: number, status?: string): Promise<any>;
  getPatientDetail(doctorId: string, patientId: string): Promise<any>;
  createPrescription(data: any): Promise<any>;
  createConsultation(data: any): Promise<any>;
}

export interface INutritionistService {
  createDietPlan(data: any): Promise<any>;
}

export interface IFitnessService {
  createTrainingPlan(data: any): Promise<any>;
}

export interface ITCMService {
  createPrescription(data: any): Promise<any>;
  createWellnessPlan(data: any): Promise<any>;
}

export interface IPsychologistService {
  createCounselingRecord(data: any): Promise<any>;
  createInterventionPlan(data: any): Promise<any>;
}
