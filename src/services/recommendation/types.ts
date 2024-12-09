// 用户偏好类型
export interface UserPreferences {
  // 饮食偏好
  dietaryPreferences: {
    restrictions: string[];  // 饮食限制,如"素食"、"无麸质"等
    allergies: string[];     // 食物过敏
    cuisineTypes: string[]; // 喜好的菜系
    mealTimes: {
      breakfast: string;
      lunch: string; 
      dinner: string;
    };
  };

  // 运动偏好
  exercisePreferences: {
    preferredTypes: string[];  // 喜好的运动类型
    intensity: 'low' | 'medium' | 'high';
    duration: number;  // 单次运动时长(分钟)
    frequency: number; // 每周运动次数
    timeSlots: string[]; // 适合运动的时间段
  };

  // 睡眠偏好
  sleepPreferences: {
    preferredBedtime: string;
    preferredWakeTime: string;
    sleepDuration: number;  // 目标睡眠时长(小时)
    naps: boolean;  // 是否有午休习惯
  };

  // 生活方式偏好
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
export interface HealthGoal {
  type: 'weight' | 'fitness' | 'nutrition' | 'sleep' | 'stress' | 'chronic_condition';
  category: 'short_term' | 'long_term';
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
export interface EnvironmentContext {
  // 天气信息
  weather: {
    temperature: number;
    humidity: number;
    condition: string;
    airQuality: {
      index: number;
      level: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
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
export interface SocialContext {
  // 社交支持网络
  supportNetwork: {
    family: {
      available: boolean;
      supportLevel: 'high' | 'medium' | 'low';
      participants: string[];
    };
    friends: {
      available: boolean;
      supportLevel: 'high' | 'medium' | 'low';
      participants: string[];
    };
    professional: {
      available: boolean;
      type: string[];  // 如医生、教练等
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
export interface Recommendation {
  id: string;
  type: 'diet' | 'exercise' | 'sleep' | 'lifestyle' | 'medical';
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';

  // 执行细节
  actions: {
    steps: string[];
    duration?: number;
    frequency?: string;
    intensity?: string;
    requiredResources?: string[];
    precautions?: string[];
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
    userPreferenceMatch: number;  // 0-1
    goalAlignment: number;        // 0-1
    difficulty: 'easy' | 'moderate' | 'challenging';
    adaptations?: string[];      // 针对用户特定情况的调整
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
export interface RecommendationFeedback {
  id: string;
  recommendationId: string;
  userId: string;
  timestamp: Date;

  // 用户反馈
  rating: number;  // 1-5
  completion: number;  // 0-100%
  difficulty: 'too_easy' | 'appropriate' | 'too_difficult';
  
  // 执行情况
  execution: {
    started: boolean;
    completed: boolean;
    duration?: number;
    obstacles?: string[];
  };

  // 效果评估
  effectiveness: {
    perceived: number;  // 1-5
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