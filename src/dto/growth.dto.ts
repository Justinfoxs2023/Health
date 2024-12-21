import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class RecordActivityDto {
  @IsString()
  type: string;

  @IsNumber()
  points: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class GrowthMetricsResponseDto {
  totalPoints: number;
  currentLevel: number;
  nextLevelPoints: number;
  achievements: {
    id: string;
    type: string;
    description?: string;
    icon?: string;
    unlockedAt: Date;
  }[];
  recentActivities: {
    type: string;
    points: number;
    timestamp: Date;
    metadata?: Record<string, any>;
  }[];
}
