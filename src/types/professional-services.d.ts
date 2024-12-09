// 医生服务类型
export interface DoctorService {
  getPatientList(doctorId: string, page: number, limit: number, status?: string): Promise<any>;
  getPatientDetail(doctorId: string, patientId: string): Promise<any>;
  createPrescription(data: any): Promise<any>;
  createConsultation(data: any): Promise<any>;
}

// 营养师服务类型
export interface NutritionistService {
  createDietPlan(data: any): Promise<any>;
  getClientList(nutritionistId: string, page: number, limit: number): Promise<any>;
}

// 健身教练服务类型
export interface FitnessService {
  createTrainingPlan(data: any): Promise<any>;
  getClientProgress(clientId: string): Promise<any>;
}

// 中医服务类型
export interface TCMService {
  createPrescription(data: any): Promise<any>;
  createWellnessPlan(data: any): Promise<any>;
}

// 心理咨询师服务类型
export interface PsychologistService {
  createCounselingRecord(data: any): Promise<any>;
  createInterventionPlan(data: any): Promise<any>;
} 