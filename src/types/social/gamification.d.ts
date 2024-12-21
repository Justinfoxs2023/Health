/**
 * @fileoverview TS 文件 gamification.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IChallenge {
  /** id 的描述 */
  id: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: ChallengeType;
  /** startTime 的描述 */
  startTime: Date;
  /** endTime 的描述 */
  endTime: Date;
  /** goals 的描述 */
  goals: ChallengeGoal;
  /** rewards 的描述 */
  rewards: ChallengeReward;
  /** participants 的描述 */
  participants: string;
  /** leaderboard 的描述 */
  leaderboard: LeaderboardEntry;
  /** status 的描述 */
  status: ChallengeStatus;
}

export interface IBadge {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** image 的描述 */
  image: string;
  /** criteria 的描述 */
  criteria: BadgeCriteria;
  /** rarity 的描述 */
  rarity: BadgeRarity;
}

export interface IProgress {
  /** userId 的描述 */
  userId: string;
  /** challengeId 的描述 */
  challengeId: string;
  /** currentValue 的描述 */
  currentValue: number;
  /** milestones 的描述 */
  milestones: Milestone;
  /** lastUpdate 的描述 */
  lastUpdate: Date;
}

export interface IReward {
  /** type 的描述 */
  type: RewardType;
  /** value 的描述 */
  value: number;
  /** description 的描述 */
  description: string;
  /** unlockCriteria 的描述 */
  unlockCriteria: UnlockCriteria;
}
