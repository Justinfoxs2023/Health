/**
 * @fileoverview TS 文件 activity.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ICreateActivityDTO {
  /** type 的描述 */
  type: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** duration 的描述 */
  duration: number;
  /** maxParticipants 的描述 */
  maxParticipants: number;
  /** requirements 的描述 */
  requirements: {
    minLevel: number;
    features: string;
  };
  /** rewards 的描述 */
  rewards?: undefined | { exp?: number | undefined; points?: number | undefined; items?: string[] | undefined; };
}

export interface IActivityProgress {
  /** userId 的描述 */
  userId: string;
  /** activityId 的描述 */
  activityId: string;
  /** progress 的描述 */
  progress: number;
  /** milestones 的描述 */
  milestones: string;
  /** rewards 的描述 */
  rewards: {
    claimed: string;
    pending: string;
  };
}
