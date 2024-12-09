export interface DoctorService {
  getPatientList(doctorId: string, page: number, limit: number, status?: string): Promise<any>;
  getPatientDetail(doctorId: string, patientId: string): Promise<any>;
  createPrescription(data: any): Promise<any>;
  createConsultation(data: any): Promise<any>;
}

export interface NutritionistService {
  createDietPlan(data: any): Promise<any>;
}

export interface FitnessService {
  createTrainingPlan(data: any): Promise<any>;
}

export interface TCMService {
  createPrescription(data: any): Promise<any>;
  createWellnessPlan(data: any): Promise<any>;
}

export interface PsychologistService {
  createCounselingRecord(data: any): Promise<any>;
  createInterventionPlan(data: any): Promise<any>;
} 