import { IBaseHealthData } from '../../health/types/health-base.types';

// 远程咨询会话
export interface ITelemedicineSession extends IBaseHealthData {
  /** type 的描述 */
    type: "general" | "followUp" | "emergency" | "specialist" | "secondOpinion" | "medicationReview" | "labReview" | "nutritionConsult" | "mentalHealth";
  /** status 的描述 */
    status: "scheduled" | "confirmed" | "inProgress" | "completed" | "cancelled" | "rescheduled" | "noShow";
  /** patient 的描述 */
    patient: IPatientInfo;
  /** provider 的描述 */
    provider: IProviderInfo;
  /** schedule 的描述 */
    schedule: {
    scheduledTime: Date;
    duration: number;
    timeZone: string;
  };
  /** communication 的描述 */
    communication: {
    channel: CommunicationChannelType;
    connectionInfo: Record<string, any>;
  };
  /** healthData 的描述 */
    healthData: IConsultationHealthData;
  /** notes 的描述 */
    notes: IConsultationNote[];
}

// 咨询类型
export type ConsultationType =
  any; // 心理咨询

// 会话状态
export type SessionStatusType =
  any; // 未出席

// 通讯渠道
export type CommunicationChannelType =
  any; // 混合模式

// 患者信息
export interface IPatientInfo {
  /** userId 的描述 */
    userId: string;
  /** name 的描述 */
    name: string;
  /** age 的描述 */
    age: number;
  /** gender 的描述 */
    gender: string;
  /** primaryComplaints 的描述 */
    primaryComplaints: string;
  /** preferences 的描述 */
    preferences: {
    language: string;
    communicationPreference: CommunicationChannelType;
    specialNeeds: string;
  };
}

// 医生信息
export interface IProviderInfo {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** title 的描述 */
    title: string;
  /** specialty 的描述 */
    specialty: string;
  /** qualifications 的描述 */
    qualifications: string;
  /** languages 的描述 */
    languages: string;
  /** rating 的描述 */
    rating: number;
  /** availability 的描述 */
    availability: ITimeSlot;
}

// 时间段
export interface ITimeSlot {
  /** startTime 的描述 */
    startTime: Date;
  /** endTime 的描述 */
    endTime: Date;
  /** status 的描述 */
    status: available  booked  blocked;
  sessionType: ConsultationType;
}

// 咨询健康数据
export interface IConsultationHealthData {
  /** vitalSigns 的描述 */
    vitalSigns: {
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    bloodOxygen?: number;
  };
  /** symptoms 的描述 */
    symptoms: Array<{
    description: string;
    duration: string;
    severity: number;
    frequency: string;
  }>;
  /** medications 的描述 */
    medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
  }>;
  /** allergies 的描述 */
    allergies: string[];
  /** medicalHistory 的描述 */
    medicalHistory: {
    conditions: string[];
    surgeries: string[];
    familyHistory: string[];
  };
  /** recentTests 的描述 */
    recentTests?: undefined | { type: string; date: Date; results: string; files?: string[] | undefined; }[];
}

// 咨询笔记
export interface IConsultationNote {
  /** timestamp 的描述 */
    timestamp: Date;
  /** type 的描述 */
    type: "followUp" | "observation" | "diagnosis" | "prescription" | "instruction" | "question" | "recommendation" | "summary";
  /** content 的描述 */
    content: string;
  /** author 的描述 */
    author: string;
  /** visibility 的描述 */
    visibility: private  shared  public;
  attachments: Array{
    type: string;
    url: string;
    description: string;
  }>;
}

// 笔记类型
export type NoteType =
  any; // 总结

// 咨询评价
export interface IConsultationFeedback {
  /** sessionId 的描述 */
    sessionId: string;
  /** rating 的描述 */
    rating: number;
  /** categories 的描述 */
    categories: {
    professionalism: number;
    communication: number;
    helpfulness: number;
    timeliness: number;
  };
  /** comments 的描述 */
    comments?: undefined | string;
  /** wouldRecommend 的描述 */
    wouldRecommend: false | true;
  /** followUpNeeded 的描述 */
    followUpNeeded: false | true;
}

// 咨询报告
export interface IConsultationReport {
  /** sessionId 的描述 */
    sessionId: string;
  /** summary 的描述 */
    summary: string;
  /** diagnosis 的描述 */
    diagnosis: {
    primary: string;
    differential: string;
    certainty: number;
  };
  /** recommendations 的描述 */
    recommendations: {
    medications?: Array<{
      name: string;
      dosage: string;
      duration: string;
      instructions: string;
    }>;
    lifestyle?: string[];
    followUp?: {
      timing: string;
      type: ConsultationType;
      reason: string;
    };
    tests?: Array<{
      name: string;
      urgency: 'routine' | 'urgent' | 'immediate';
      instructions: string;
    }>;
  };
  /** precautions 的描述 */
    precautions: string[];
  /** emergencyGuidelines 的描述 */
    emergencyGuidelines?: undefined | string[];
}
