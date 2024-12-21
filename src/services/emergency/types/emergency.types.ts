/**
 * @fileoverview TS 文件 emergency.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 紧急情况类型定义
export interface IEmergencySituation {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** type 的描述 */
    type: "medical" | "injury" | "mental" | "environmental";
  /** location 的描述 */
    location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  /** description 的描述 */
    description: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** symptoms 的描述 */
    symptoms?: undefined | string[];
  /** vitalSigns 的描述 */
    vitalSigns?: undefined | Record<string, number>;
}

export interface IEmergencyResponse {
  /** id 的描述 */
    id: string;
  /** situation 的描述 */
    situation: IEmergencySituation;
  /** assessment 的描述 */
    assessment: IEmergencyAssessment;
  /** actions 的描述 */
    actions: IEmergencyAction;
  /** status 的描述 */
    status: "active" | "resolved" | "cancelled";
  /** timeline 的描述 */
    timeline: IEmergencyTimelineEvent;
  /** outcomes 的描述 */
    outcomes: IEmergencyOutcome;
}

export interface IEmergencyAssessment {
  /** severity 的描述 */
    severity: "critical" | "high" | "moderate" | "low";
  /** analysis 的描述 */
    analysis: any;
  /** recommendedActions 的描述 */
    recommendedActions: IEmergencyAction;
  /** timestamp 的描述 */
    timestamp: Date;
}

export type EmergencyType = any;

export type EmergencySeverityType = any;

export type EmergencyStatusType = any;

export interface IEmergencyAction {
  /** type 的描述 */
    type: string;
  /** priority 的描述 */
    priority: number;
  /** status 的描述 */
    status: pending  in_progress  completed  failed;
  details: any;
}

export interface IEmergencyResource {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: string;
  /** name 的描述 */
    name: string;
  /** location 的描述 */
    location: number, /** number 的描述 */
    /** number 的描述 */
    number;
  /** distance 的描述 */
    distance: number;
  /** availability 的描述 */
    availability: false | true;
  /** contact 的描述 */
    contact: {
    phone: string;
    email: string;
  };
}

export interface IEmergencyTimelineEvent {
  /** timestamp 的描述 */
    timestamp: Date;
  /** type 的描述 */
    type: string;
  /** description 的描述 */
    description: string;
  /** details 的描述 */
    details: any;
}

export interface IEmergencyOutcome {
  /** type 的描述 */
    type: string;
  /** status 的描述 */
    status: success  partial  failed;
  details: any;
}

export interface IEmergencyReport {
  /** id 的描述 */
    id: string;
  /** situation 的描述 */
    situation: IEmergencySituation;
  /** assessment 的描述 */
    assessment: IEmergencyAssessment;
  /** actions 的描述 */
    actions: IEmergencyAction;
  /** timeline 的描述 */
    timeline: IEmergencyTimelineEvent;
  /** outcomes 的描述 */
    outcomes: IEmergencyOutcome;
  /** recommendations 的描述 */
    recommendations: string;
}
