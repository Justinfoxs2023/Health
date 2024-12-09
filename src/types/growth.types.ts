export interface GrowthActivity {
  type: string;
  points: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Achievement {
  id: string;
  type: string;
  points: number;
  unlockedAt: Date;
  description?: string;
  icon?: string;
}

export interface UserLevel {
  level: number;
  points: number;
  achievedAt: Date;
  benefits?: {
    discounts?: number;
    features?: string[];
    privileges?: string[];
  };
}

export interface GrowthMetrics {
  totalPoints: number;
  currentLevel: number;
  nextLevelPoints: number;
  achievements: Achievement[];
  recentActivities: GrowthActivity[];
} 