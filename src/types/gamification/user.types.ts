/**
 * @fileoverview TS 文件 user.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export type UserRoleType = any;

export type ParticipationType = any;

export interface IChallenge {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** progress 的描述 */
  progress: number;
  /** target 的描述 */
  target: number;
  /** rewards 的描述 */
  rewards: IChallengeReward;
  /** expiresAt 的描述 */
  expiresAt: Date;
}

export interface IChallengeReward {
  /** type 的描述 */
  type: string;
  /** value 的描述 */
  value: number;
}
