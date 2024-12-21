/**
 * @fileoverview TS 文件 social.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ISocialInteraction {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** targetId 的描述 */
  targetId: string;
  /** type 的描述 */
  type: string;
  /** timestamp 的描述 */
  timestamp: Date;
  /** metadata 的描述 */
  metadata: Recordstring /** any 的描述 */;
  /** any 的描述 */
  any;
}

export interface ITeamChallenge {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: string;
  /** initiatorId 的描述 */
  initiatorId: string;
  /** participants 的描述 */
  participants: string;
  /** milestones 的描述 */
  milestones: {
    description: string;
    target: number;
    progress: number;
    completed: boolean;
  }[];
  /** rewards 的描述 */
  rewards: {
    experience: number;
    items: string[];
    achievements: string[];
  };
  /** status 的描述 */
  status: "pending" | "active" | "completed" | "cancelled";
}
