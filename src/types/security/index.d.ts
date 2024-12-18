/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 用户活动类型
export interface IUserActivity {
  /** userId 的描述 */
  userId: string;
  /** sessionId 的描述 */
  sessionId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** action 的描述 */
  action: IUserAction;
  /** context 的描述 */
  context: ActivityContext;
  /** device 的描述 */
  device: DeviceInfo;
  /** location 的描述 */
  location: GeoLocation;
}

export interface IUserAction {
  /** type 的描述 */
  type: "login" | "logout" | "data_access" | "data_modify" | "permission_change" | "api_call";
  /** target 的描述 */
  target: string;
  /** data 的描述 */
  data: any;
  /** result 的描述 */
  result: success /** failure 的描述 */;
  /** failure 的描述 */
  failure;
  /** error 的描述 */
  error: string;
}

export type ActionType =
  any;

// 威胁评估
export interface IThreatAssessment {
  /** id 的描述 */
  id: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** level 的描述 */
  level: "low" | "medium" | "high" | "critical";
  /** type 的描述 */
  type: "unauthorized_access" | "data_breach" | "suspicious_behavior" | "brute_force" | "malware";
  /** source 的描述 */
  source: {
    ip: string;
    location: GeoLocation;
    device: DeviceInfo;
  };
  /** details 的描述 */
  details: {
    description: string;
    indicators: string[];
    evidence: any[];
  };
  /** recommendations 的描述 */
  recommendations: string[];
  /** status 的描述 */
  status: "active" | "investigating" | "resolved";
}

export type ThreatLevelType = any;

export type ThreatType =
  any;

// 行为分析
export interface IBehaviorAnalysis {
  /** userId 的描述 */
  userId: string;
  /** period 的描述 */
  period: {
    start: Date;
    end: Date;
  };
  /** patterns 的描述 */
  patterns: IBehaviorPattern[];
  /** anomalies 的描述 */
  anomalies: BehaviorAnomaly[];
  /** riskScore 的描述 */
  riskScore: number;
  /** recommendations 的描述 */
  recommendations: string[];
}

export interface IBehaviorPattern {
  /** type 的描述 */
  type: string;
  /** frequency 的描述 */
  frequency: number;
  /** timeDistribution 的描述 */
  timeDistribution: TimeDistribution;
  /** confidence 的描述 */
  confidence: number;
}

// 风险评估
export interface IRiskAssessment {
  /** level 的描述 */
  level: "low" | "medium" | "high" | "critical";
  /** score 的描述 */
  score: number;
  /** factors 的描述 */
  factors: IRiskFactor;
  /** context 的描述 */
  context: RiskContext;
  /** mitigations 的描述 */
  mitigations: string;
}

export type RiskLevelType = any;

export interface IRiskFactor {
  /** type 的描述 */
  type: string;
  /** weight 的描述 */
  weight: number;
  /** impact 的描述 */
  impact: string;
  /** probability 的描述 */
  probability: number;
}
