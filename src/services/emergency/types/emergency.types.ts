// 紧急情况类型定义
export interface EmergencySituation {
  id: string;
  userId: string;
  type: EmergencyType;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  description: string;
  timestamp: Date;
  symptoms?: string[];
  vitalSigns?: Record<string, number>;
}

export interface EmergencyResponse {
  id: string;
  situation: EmergencySituation;
  assessment: EmergencyAssessment;
  actions: EmergencyAction[];
  status: EmergencyStatus;
  timeline: EmergencyTimelineEvent[];
  outcomes?: EmergencyOutcome[];
}

export interface EmergencyAssessment {
  severity: EmergencySeverity;
  analysis: any;
  recommendedActions: EmergencyAction[];
  timestamp: Date;
}

export type EmergencyType = 
  | 'medical'
  | 'injury'
  | 'mental'
  | 'environmental';

export type EmergencySeverity = 
  | 'critical'
  | 'high' 
  | 'moderate'
  | 'low';

export type EmergencyStatus =
  | 'active'
  | 'resolved'
  | 'cancelled';

export interface EmergencyAction {
  type: string;
  priority: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed';
  details?: any;
}

export interface EmergencyResource {
  id: string;
  type: string;
  name: string;
  location: [number, number];
  distance: number;
  availability: boolean;
  contact: {
    phone: string;
    email?: string;
  };
}

export interface EmergencyTimelineEvent {
  timestamp: Date;
  type: string;
  description: string;
  details?: any;
}

export interface EmergencyOutcome {
  type: string;
  status: 'success' | 'partial' | 'failed';
  details: any;
}

export interface EmergencyReport {
  id: string;
  situation: EmergencySituation;
  assessment: EmergencyAssessment;
  actions: EmergencyAction[];
  timeline: EmergencyTimelineEvent[];
  outcomes: EmergencyOutcome[];
  recommendations: string[];
} 