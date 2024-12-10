// 积分活动类型
export interface PointsActivity {
  type: ActivityType;
  data: ActivityData;
  timestamp: Date;
  source: string;
}

// 积分交易记录
export interface PointsTransaction {
  id: string;
  userId: string;
  activity: PointsActivity;
  points: number;
  balance: number;
  timestamp: Date;
}

// 兑换请求
export interface RedemptionRequest {
  itemId: string;
  points: number;
  quantity: number;
}

// 兑换结果
export interface RedemptionResult {
  success: boolean;
  redemption?: {
    id: string;
    item: RedemptionItem;
    points: number;
    expiryDate?: Date;
  };
  remainingPoints: number;
  error?: string;
}

// 积分到期管理
export interface ExpiryManagementResult {
  expiredPoints: number;
  nextExpiryDate: Date;
  remainingPoints: number;
  expirySchedule: ExpirySchedule[];
} 