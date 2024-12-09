import { BaseHealthData } from '../../health/types/health-base.types';

// 远程咨询会话
export interface TelemedicineSession extends BaseHealthData {
  type: ConsultationType;
  status: SessionStatus;
  patient: PatientInfo;
  provider: ProviderInfo;
  schedule: {
    scheduledTime: Date;
    duration: number;
    timeZone: string;
  };
  communication: {
    channel: CommunicationChannel;
    connectionInfo: Record<string, any>;
  };
  healthData: ConsultationHealthData;
  notes: ConsultationNote[];
}

// 咨询类型
export type ConsultationType = 
  | 'general'           // 一般咨询
  | 'followUp'          // 复诊
  | 'emergency'         // 紧急咨询
  | 'specialist'        // 专科咨询
  | 'secondOpinion'     // 第二诊疗意见
  | 'medicationReview'  // 用药评估
  | 'labReview'         // 检查结果解读
  | 'nutritionConsult'  // 营养咨询
  | 'mentalHealth';     // 心理咨询

// 会话状态
export type SessionStatus = 
  | 'scheduled'     // 已预约
  | 'confirmed'     // 已确认
  | 'inProgress'    // 进行中
  | 'completed'     // 已完成
  | 'cancelled'     // 已取���
  | 'rescheduled'   // 已改期
  | 'noShow';       // 未出席

// 通讯渠道
export type CommunicationChannel = 
  | 'video'         // 视频
  | 'audio'         // 语音
  | 'chat'          // 即时通讯
  | 'email'         // 电子邮件
  | 'hybrid';       // 混合模式

// 患者信息
export interface PatientInfo {
  userId: string;
  name: string;
  age: number;
  gender: string;
  primaryComplaints: string[];
  preferences: {
    language: string;
    communicationPreference: CommunicationChannel[];
    specialNeeds?: string[];
  };
}

// 医生信息
export interface ProviderInfo {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  qualifications: string[];
  languages: string[];
  rating: number;
  availability: TimeSlot[];
}

// 时间段
export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  status: 'available' | 'booked' | 'blocked';
  sessionType?: ConsultationType[];
}

// 咨询健康数据
export interface ConsultationHealthData {
  vitalSigns?: {
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    bloodOxygen?: number;
  };
  symptoms: Array<{
    description: string;
    duration: string;
    severity: number;
    frequency: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
  }>;
  allergies: string[];
  medicalHistory: {
    conditions: string[];
    surgeries: string[];
    familyHistory: string[];
  };
  recentTests?: Array<{
    type: string;
    date: Date;
    results: string;
    files?: string[];
  }>;
}

// 咨询笔记
export interface ConsultationNote {
  timestamp: Date;
  type: NoteType;
  content: string;
  author: string;
  visibility: 'private' | 'shared' | 'public';
  attachments?: Array<{
    type: string;
    url: string;
    description?: string;
  }>;
}

// 笔记类型
export type NoteType = 
  | 'observation'    // 观察记录
  | 'diagnosis'      // 诊断结果
  | 'prescription'   // 处方信息
  | 'instruction'    // 医嘱说明
  | 'followUp'       // 随访记录
  | 'question'       // 问题记录
  | 'recommendation' // 建议
  | 'summary';       // 总结

// 咨询评价
export interface ConsultationFeedback {
  sessionId: string;
  rating: number;
  categories: {
    professionalism: number;
    communication: number;
    helpfulness: number;
    timeliness: number;
  };
  comments?: string;
  wouldRecommend: boolean;
  followUpNeeded: boolean;
}

// 咨询报告
export interface ConsultationReport {
  sessionId: string;
  summary: string;
  diagnosis?: {
    primary: string;
    differential: string[];
    certainty: number;
  };
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
  precautions: string[];
  emergencyGuidelines?: string[];
} 