// 个性化方案类型定义
export interface PersonalizedPlan {
  id: string;
  userId: string;
  type: 'exercise' | 'diet';
  status: 'active' | 'completed' | 'paused';
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100

  // 目标设定
  goals: Array<{
    type: string;
    target: number;
    unit: string;
    currentValue: number;
    priority: 'high' | 'medium' | 'low';
  }>;

  // 调整历史
  adjustments: Array<{
    date: Date;
    reason: string;
    changes: Record<string, any>;
  }>;
}

// 运动计划详情
export interface ExercisePlan extends PersonalizedPlan {
  // 运动安排
  schedule: Array<{
    dayOfWeek: number;
    exercises: Array<{
      name: string;
      type: 'cardio' | 'strength' | 'flexibility' | 'balance';
      duration: number; // 分钟
      intensity: 'low' | 'medium' | 'high';
      sets?: number;
      reps?: number;
      weight?: number;
      restInterval?: number;
    }>;
  }>;

  // 运动限制
  restrictions: Array<{
    type: string;
    description: string;
    alternatives: string[];
  }>;

  // 进度追踪
  tracking: {
    weeklyTarget: {
      sessions: number;
      totalDuration: number;
      caloriesBurn: number;
    };
    actualProgress: {
      completedSessions: number;
      totalDuration: number;
      caloriesBurned: number;
    };
  };
}

// 饮食方案详情
export interface DietPlan extends PersonalizedPlan {
  // 营养目标
  nutritionTargets: {
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    micros: Record<string, number>;
  };

  // 膳食安排
  mealSchedule: Array<{
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
    suggestions: Array<{
      name: string;
      portion: number;
      nutrients: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
      ingredients: string[];
      preparation?: string;
    }>;
  }>;

  // 饮食限制
  restrictions: Array<{
    type: 'allergy' | 'preference' | 'medical';
    items: string[];
    alternatives: string[];
  }>;

  // 水分摄入
  hydration: {
    dailyTarget: number;
    reminders: string[];
  };
} 