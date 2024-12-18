/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 个性化方案类型定义
export interface IPersonalizedPlan {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** type 的描述 */
    type: exercise  /** diet 的描述 */
    /** diet 的描述 */
    diet;
  /** status 的描述 */
    status: active  completed  paused;
  startDate: Date;
  endDate: Date;
  progress: number;  0100

   
  goals: Array{
    type: string;
    target: number;
    unit: string;
    currentValue: number;
    priority: high  medium  low;
  }>;

  // 调整历史
  adjustments: Array<{
    date: Date;
    reason: string;
    changes: Record<string, any>;
  }>;
}

// 运动计划详情
export interface IExercisePlan extends IPersonalizedPlan {
  // 运动安排
  /** schedule 的描述 */
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
  /** restrictions 的描述 */
    restrictions: Array<{
    type: string;
    description: string;
    alternatives: string[];
  }>;

  // 进度追踪
  /** tracking 的描述 */
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
export interface IDietPlan extends IPersonalizedPlan {
  // 营养目标
  /** nutritionTargets 的描述 */
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
  /** mealSchedule 的描述 */
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
  /** restrictions 的描述 */
    restrictions: Array<{
    type: 'allergy' | 'preference' | 'medical';
    items: string[];
    alternatives: string[];
  }>;

  // 水分摄入
  /** hydration 的描述 */
    hydration: {
    dailyTarget: number;
    reminders: string[];
  };
}
