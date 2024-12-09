// 用户活动类型
export interface UserActivity {
  userId: string;
  sessionId: string;
  timestamp: Date;
  action: UserAction;
  context: ActivityContext;
  device: DeviceInfo;
  location?: GeoLocation;
}

export interface UserAction {
  type: ActionType;
  target: string;
  data?: any;
  result: 'success' | 'failure';
  error?: string;
}

export type ActionType = 
  | 'login'
  | 'logout'
  | 'data_access'
  | 'data_modify'
  | 'permission_change'
  | 'api_call';

// 威胁评估
export interface ThreatAssessment {
  id: string;
  timestamp: Date;
  level: ThreatLevel;
  type: ThreatType;
  source: {
    ip: string;
    location?: GeoLocation;
    device?: DeviceInfo;
  };
  details: {
    description: string;
    indicators: string[];
    evidence: any[];
  };
  recommendations: string[];
  status: 'active' | 'investigating' | 'resolved';
}

export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

export type ThreatType = 
  | 'unauthorized_access'
  | 'data_breach'
  | 'suspicious_behavior'
  | 'brute_force'
  | 'malware';

// 行为分析
export interface BehaviorAnalysis {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  patterns: BehaviorPattern[];
  anomalies: BehaviorAnomaly[];
  riskScore: number;
  recommendations: string[];
}

export interface BehaviorPattern {
  type: string;
  frequency: number;
  timeDistribution: TimeDistribution;
  confidence: number;
}

// 风险评估
export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: RiskFactor[];
  context: RiskContext;
  mitigations: string[];
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskFactor {
  type: string;
  weight: number;
  impact: string;
  probability: number;
} 