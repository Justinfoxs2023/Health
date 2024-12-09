// 团队挑战
export interface TeamChallenges {
  activeTeamChallenges: TeamChallenge[];
  teamRoles: TeamRole[];
  teamGoals: TeamGoal[];
  progressTracking: TeamProgress;
  teamRewards: TeamReward[];
}

// 竞争性挑战
export interface CompetitiveChallenges {
  activeCompetitions: Competition[];
  matchedOpponents: Opponent[];
  competitionRules: Rule[];
  rankings: Ranking[];
  rewards: CompetitionReward[];
}

// 社交挑战
export interface SocialChallenges {
  socialTasks: SocialTask[];
  interactionGoals: InteractionGoal[];
  socialActivities: Activity[];
  networkGrowth: GrowthMetric;
  communityImpact: ImpactMetric;
}

// 成就解锁条件
export interface AchievementConditions {
  unlockConditions: UnlockCondition[];
  progressionPath: ProgressionStep[];
  difficultyLevels: DifficultyLevel[];
  milestones: Milestone[];
  adaptiveRequirements: AdaptiveRequirement[];
}

// 团队挑战详情
export interface TeamChallenge {
  id: string;
  type: ChallengeType;
  participants: Participant[];
  objectives: Objective[];
  duration: Period;
  rewards: TeamReward[];
}

// 竞赛规则
export interface Rule {
  id: string;
  type: RuleType;
  conditions: Condition[];
  penalties: Penalty[];
  rewards: Reward[];
}

// 社交任务
export interface SocialTask {
  id: string;
  type: TaskType;
  requirements: Requirement[];
  impact: ImpactMetric;
  rewards: SocialReward[];
}

// 解锁条件
export interface UnlockCondition {
  id: string;
  type: ConditionType;
  requirements: Requirement[];
  alternatives: Alternative[];
  timeConstraints: TimeConstraint[];
} 