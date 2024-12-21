/**
 * @fileoverview TS 文件 health.events.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export enum HealthEventType {
  PROFILE_UPDATED = 'health.profile.updated',
  RISK_DETECTED = 'health.risk.detected',
  GOAL_ACHIEVED = 'health.goal.achieved',
  TASK_COMPLETED = 'health.task.completed',
}

export interface IHealthEvent {
  /** type 的描述 */
  type: import("D:/Health/src/events/health.events").HealthEventType.PROFILE_UPDATED | import("D:/Health/src/events/health.events").HealthEventType.RISK_DETECTED | import("D:/Health/src/events/health.events").HealthEventType.GOAL_ACHIEVED | import("D:/Health/src/events/health.events").HealthEventType.TASK_COMPLETED;
  /** userId 的描述 */
  userId: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** data 的描述 */
  data: any;
}
