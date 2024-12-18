/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 用户偏好类型
export interface IUserPreferences {
   
  /** dietaryPreferences 的描述 */
    dietaryPreferences: {
    restrictions: string;  ,
    allergies: string;  
    cuisineTypes: string;  
    mealTimes: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
  };

  // 运动偏好
  /** exercisePreferences 的描述 */
    exercisePreferences: {
    preferredTypes: string[]; // 喜好的运动类型
    intensity: 'low' | 'medium' | 'high';
    duration: number; // 单次运动时长(分钟)
    frequency: number; // 每周运动次数
    timeSlots: string[]; // 适合运动的时间段
  };

  // 睡眠偏好
  /** sleepPreferences 的描述 */
    sleepPreferences: {
    preferredBedtime: string;
    preferredWakeTime: string;
    sleepDuration: number; // 目标睡眠时长(小时)
    naps: boolean; // 是否有午休习惯
  };

  // 生活方式偏好
  /** lifestylePreferences 的描述 */
    lifestylePreferences: {
    activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
    stressManagement: string[]; // 压力管理方式
    workSchedule: {
      workDays: string[];
      workHours: {
        start: string;
        end: string;
      };
    };
  };
}

// 健康目标类型
export interface IHealthGoal {
  /** type 的描述 */
    type: weight  fitness  nutrition  sleep  stress  chronic_condition;
  category: short_term  long_term;
  target: {
    metric: string;
    currentValue: number;
    targetValue: number;
    unit: string;
  };
  timeframe: {
    startDate: Date;
    targetDate: Date;
  };
  priority: 'low' | 'medium' | 'high';
  relatedConditions?: string[]; // 相关健康状况
  restrictions?: string[]; // 限制条件
}

// 环境上下文类型
export interface IEnvironmentContext {
   
  /** weather 的描述 */
    weather: {
    temperature: number;
    humidity: number;
    condition: string;
    airQuality: {
      index: number;
      level: good  moderate  unhealthy  hazardous;
    };
    uvIndex: number;
  };

  // 位置信息
  location: {
    type: 'home' | 'work' | 'outdoor' | 'gym' | 'other';
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    facilities?: string[]; // 周边设施
    accessibility?: string[]; // 无障碍设施
  };

  // 时间上下文
  temporal: {
    timeOfDay: string;
    dayOfWeek: string;
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    isHoliday: boolean;
    specialEvents?: string[];
  };

  // 室���环境
  indoor?: {
    temperature: number;
    humidity: number;
    noise: number;
    lighting: 'bright' | 'moderate' | 'dim';
  };
}

// 社交上下文类型
export interface ISocialContext {
   
  /** supportNetwork 的描述 */
    supportNetwork: {
    family: {
      available: boolean;
      supportLevel: high  medium  low;
      participants: string;
    };
    friends: {
      available: boolean;
      supportLevel: 'high' | 'medium' | 'low';
      participants: string[];
    };
    professional: {
      available: boolean;
      type: string[]; // 如医生、教练等
      nextAppointment?: Date;
    };
  };

  // 群体活动
  groupActivities: {
    current: Array<{
      type: string;
      participants: number;
      frequency: string;
      schedule: string;
    }>;
    preferred: string[];
  };

  // 社交目标
  socialGoals: {
    type: string;
    priority: 'high' | 'medium' | 'low';
    relatedHealthGoals?: string[];
  }[];

  // 社交压力
  socialPressure?: {
    level: 'high' | 'medium' | 'low';
    sources: string[];
    copingStrategies: string[];
  };
}

// 推荐内容类型
export interface IRecommendation {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: diet  exercise  sleep  lifestyle  medical;
  category: string;
  title: string;
  description: string;
  priority: high  medium  low;

   
  actions: {
    steps: string;
    duration: number;
    frequency: string;
    intensity: string;
    requiredResources: string;
    precautions: string;
  };

  // 适用上下文
  context: {
    timeOfDay: string[];
    location: string[];
    weather: string[];
    socialSetting: string[];
  };

  // 个性化因素
  personalization: {
    userPreferenceMatch: number; // 0-1
    goalAlignment: number; // 0-1
    difficulty: 'easy' | 'moderate' | 'challenging';
    adaptations?: string[]; // 针对用户特定情况的调整
  };

  // 预期效果
  expectedOutcomes: {
    shortTerm: string[];
    longTerm: string[];
    metrics?: Array<{
      name: string;
      target: number;
      unit: string;
    }>;
  };

  // 替代方案
  alternatives?: Array<{
    title: string;
    condition: string;
    description: string;
  }>;
}

// 推荐反馈类型
export interface IRecommendationFeedback {
  /** id 的描述 */
    id: string;
  /** recommendationId 的描述 */
    recommendationId: string;
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;

   
  /** rating 的描述 */
    rating: number;  /** 15 的描述 */
    /** 15 的描述 */
    15
  /** completion 的描述 */
    completion: number;  /** 0100 的描述 */
    /** 0100 的描述 */
    0100
  /** difficulty 的描述 */
    difficulty: too_easy  appropriate  too_difficult;

   
  execution: {
    started: boolean;
    completed: boolean;
    duration: number;
    obstacles: string;
  };

  // 效果评估
  effectiveness: {
    perceived: number; // 1-5
    measuredOutcomes?: Array<{
      metric: string;
      value: number;
      unit: string;
    }>;
  };

  // 详细反馈
  feedback: {
    likes?: string[];
    dislikes?: string[];
    suggestions?: string;
    adaptationRequests?: string[];
  };
}
