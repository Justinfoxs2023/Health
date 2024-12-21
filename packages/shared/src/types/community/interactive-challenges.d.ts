/**
 * @fileoverview TS 文件 interactive-challenges.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 团队挑战
export interface ITeamChallenges {
  /** activeTeamChallenges 的描述 */
  activeTeamChallenges: ITeamChallenge[];
  /** teamRoles 的描述 */
  teamRoles: TeamRole[];
  /** teamGoals 的描述 */
  teamGoals: TeamGoal[];
  /** progressTracking 的描述 */
  progressTracking: TeamProgress;
  /** teamRewards 的描述 */
  teamRewards: TeamReward[];
}

// 竞争性挑战
export interface ICompetitiveChallenges {
  /** activeCompetitions 的描述 */
  activeCompetitions: Competition[];
  /** matchedOpponents 的描述 */
  matchedOpponents: Opponent[];
  /** competitionRules 的描述 */
  competitionRules: IRule[];
  /** rankings 的描述 */
  rankings: Ranking[];
  /** rewards 的描述 */
  rewards: CompetitionReward[];
}

// 社交挑战
export interface ISocialChallenges {
  /** socialTasks 的描述 */
  socialTasks: ISocialTask[];
  /** interactionGoals 的描述 */
  interactionGoals: InteractionGoal[];
  /** socialActivities 的描述 */
  socialActivities: Activity[];
  /** networkGrowth 的描述 */
  networkGrowth: GrowthMetric;
  /** communityImpact 的描述 */
  communityImpact: ImpactMetric;
}

// 成就解锁条件
export interface IAchievementConditions {
  /** unlockConditions 的描述 */
  unlockConditions: IUnlockCondition[];
  /** progressionPath 的描述 */
  progressionPath: ProgressionStep[];
  /** difficultyLevels 的描述 */
  difficultyLevels: DifficultyLevel[];
  /** milestones 的描述 */
  milestones: Milestone[];
  /** adaptiveRequirements 的描述 */
  adaptiveRequirements: AdaptiveRequirement[];
}

// 团队挑战详情
export interface ITeamChallenge {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: ChallengeType;
  /** participants 的描述 */
  participants: Participant[];
  /** objectives 的描述 */
  objectives: Objective[];
  /** duration 的描述 */
  duration: Period;
  /** rewards 的描述 */
  rewards: TeamReward[];
}

// 竞赛规则
export interface IRule {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: RuleType;
  /** conditions 的描述 */
  conditions: Condition[];
  /** penalties 的描述 */
  penalties: Penalty[];
  /** rewards 的描述 */
  rewards: Reward[];
}

// 社交任务
export interface ISocialTask {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: TaskType;
  /** requirements 的描述 */
  requirements: Requirement[];
  /** impact 的描述 */
  impact: ImpactMetric;
  /** rewards 的描述 */
  rewards: SocialReward[];
}

// 解锁条件
export interface IUnlockCondition {
  /** id 的描述 */
  id: string;
  /** type 的描述 */
  type: ConditionType;
  /** requirements 的描述 */
  requirements: Requirement[];
  /** alternatives 的描述 */
  alternatives: Alternative[];
  /** timeConstraints 的描述 */
  timeConstraints: TimeConstraint[];
}
