import { IBaseService } from './index';

// 医生服务接口
export interface IDoctorService extends IBaseService {
  getPatientList(doctorId: string, page: number, limit: number, status?: string): Promise<any>;
  getPatientDetail(doctorId: string, patientId: string): Promise<any>;
  createPrescription(data: any): Promise<any>;
  createConsultation(data: any): Promise<any>;
}

// 营养师服务接口
export interface INutritionistService extends IBaseService {
  createDietPlan(data: any): Promise<any>;
  createAssessment(data: any): Promise<any>;
  createDietaryAdvice(data: any): Promise<any>;
}

// 健身教练服务接口
export interface IFitnessService extends IBaseService {
  createTrainingPlan(data: any): Promise<any>;
  createAssessment(data: any): Promise<any>;
  createExerciseGuidance(data: any): Promise<any>;
  recordProgress(data: any): Promise<any>;
}

// 中医服务接口
export interface ITCMService extends IBaseService {
  assessConstitution(data: any): Promise<any>;
  createPrescription(data: any): Promise<any>;
  createWellnessPlan(data: any): Promise<any>;
  createMassageGuidance(data: any): Promise<any>;
}

// 心理咨询师服务接口
export interface IPsychologistService extends IBaseService {
  createAssessment(data: any): Promise<any>;
  createCounselingRecord(data: any): Promise<any>;
  createInterventionPlan(data: any): Promise<any>;
  createEmotionalRecord(data: any): Promise<any>;
}
