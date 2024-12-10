export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  startTime: Date;
  endTime: Date;
  goals: ChallengeGoal[];
  rewards: ChallengeReward[];
  participants: string[];
  leaderboard: LeaderboardEntry[];
  status: ChallengeStatus;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  criteria: BadgeCriteria;
  rarity: BadgeRarity;
}

export interface Progress {
  userId: string;
  challengeId: string;
  currentValue: number;
  milestones: Milestone[];
  lastUpdate: Date;
}

export interface Reward {
  type: RewardType;
  value: number;
  description: string;
  unlockCriteria: UnlockCriteria;
} 