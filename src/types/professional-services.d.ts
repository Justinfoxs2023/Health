/**
 * @fileoverview TS 文件 professional-services.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 医生服务类型
export interface IDoctorService {
  /** getPatientListdoctorId 的描述 */
    getPatientListdoctorId: string, /** page 的描述 */
    /** page 的描述 */
    page: number, /** limit 的描述 */
    /** limit 的描述 */
    limit: number, /** status 的描述 */
    /** status 的描述 */
    status: string: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
  /** getPatientDetaildoctorId 的描述 */
    getPatientDetaildoctorId: string, /** patientId 的描述 */
    /** patientId 的描述 */
    patientId: string: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
  /** createPrescriptiondata 的描述 */
    createPrescriptiondata: any: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
  /** createConsultationdata 的描述 */
    createConsultationdata: any: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
}

// 营养师服务类型
export interface INutritionistService {
  /** createDietPlandata 的描述 */
    createDietPlandata: any: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
  /** getClientListnutritionistId 的描述 */
    getClientListnutritionistId: string, /** page 的描述 */
    /** page 的描述 */
    page: number, /** limit 的描述 */
    /** limit 的描述 */
    limit: number: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
}

// 健身教练服务类型
export interface IFitnessService {
  /** createTrainingPlandata 的描述 */
    createTrainingPlandata: any: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
  /** getClientProgressclientId 的描述 */
    getClientProgressclientId: string: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
}

// 中医服务类型
export interface ITCMService {
  /** createPrescriptiondata 的描述 */
    createPrescriptiondata: any: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
  /** createWellnessPlandata 的描述 */
    createWellnessPlandata: any: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
}

// 心理咨询师服务类型
export interface IPsychologistService {
  /** createCounselingRecorddata 的描述 */
    createCounselingRecorddata: any: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
  /** createInterventionPlandata 的描述 */
    createInterventionPlandata: any: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
}
