// 工具功能类型
export enum ToolType {
  // 1. 食物营养工具
  FOOD_SEARCH = 'food_search',           // 食物搜索
  FOOD_SCANNER = 'food_scanner',         // 食物扫描
  NUTRITION_CALC = 'nutrition_calc',     // 营养计算器
  MEAL_PLANNER = 'meal_planner',         // 膳食规划
  RECIPE_MAKER = 'recipe_maker',         // 食谱制作
  DIET_ANALYSIS = 'diet_analysis',       // 饮食分析
  FOOD_DIARY = 'food_diary',             // 饮食日记
  RESTAURANT_GUIDE = 'restaurant_guide', // 外出就餐指南
  SEASONAL_FOOD = 'seasonal_food',       // 时令食材
  DIET_RECOMMEND = 'diet_recommend',     // 个性化饮食推荐

  // 2. 健康监测工具
  VITAL_MONITOR = 'vital_monitor',       // 生命体征监测
  WEIGHT_TRACKER = 'weight_tracker',     // 体重记录
  SLEEP_MONITOR = 'sleep_monitor',       // 睡眠监测
  MOOD_TRACKER = 'mood_tracker',         // 情绪记录
  PERIOD_TRACKER = 'period_tracker',     // 生理期跟踪
  BLOOD_PRESSURE = 'blood_pressure',     // 血压记录
  GLUCOSE_MONITOR = 'glucose_monitor',   // 血糖监测
  SYMPTOM_CHECKER = 'symptom_checker',   // 症状自查
  MEDICINE_REMIND = 'medicine_remind',   // 用药提醒
  HEALTH_REPORT = 'health_report',       // 健康报告

  // 3. 运动健身工具
  EXERCISE_PLAN = 'exercise_plan',       // 运动计划
  WORKOUT_TRACKER = 'workout_tracker',   // 运动记录
  STEP_COUNTER = 'step_counter',         // 步数统计
  POSTURE_CHECK = 'posture_check',       // 姿态检测
  TRAINING_VIDEO = 'training_video',     // 训练视频
  SPORTS_TIMER = 'sports_timer',         // 运动计时器
  MUSCLE_MAP = 'muscle_map',             // 肌肉地图
  CALORIE_COUNTER = 'calorie_counter',   // 卡路里计算
  RECOVERY_GUIDE = 'recovery_guide',     // 恢复指导
  FITNESS_TEST = 'fitness_test',         // 体能测试

  // 4. 中医养生工具
  TCM_DIAGNOSIS = 'tcm_diagnosis',       // 中医诊断
  MERIDIAN_GUIDE = 'meridian_guide',     // 经络指导
  ACUPOINT_MAP = 'acupoint_map',         // 穴位地图
  MASSAGE_GUIDE = 'massage_guide',       // 按摩指导
  HERBAL_LIBRARY = 'herbal_library',     // 中药材库
  HEALTH_PRESERVE = 'health_preserve',   // 养生保健
  SEASON_HEALTH = 'season_health',       // 四季养生
  MEDITATION_GUIDE = 'meditation_guide', // 冥想指导
  TCM_RECIPE = 'tcm_recipe',            // 养生食谱
  QIGONG_EXERCISE = 'qigong_exercise',  // 气功导引

  // 5. 社区互动工具
  POST_CREATOR = 'post_creator',         // 动态发布
  CHALLENGE_JOINER = 'challenge_joiner', // 挑战参与
  GROUP_CHAT = 'group_chat',             // 群组聊天
  EXPERT_QA = 'expert_qa',               // 专家问答
  EXPERIENCE_SHARE = 'experience_share', // 经验分享
  HEALTH_TOPIC = 'health_topic',         // 健康话题
  SUCCESS_STORY = 'success_story',       // 成功案例
  SUPPORT_GROUP = 'support_group',       // 互助小组
  LIVE_STREAM = 'live_stream',           // 直播课程
  COMMUNITY_EVENT = 'community_event',   // 社区活动

  // 6. 会员专属工具
  AI_COACH = 'ai_coach',                 // AI健康教练
  EXPERT_CONSULT = 'expert_consult',     // 专家咨询
  VIP_CONTENT = 'vip_content',           // 会员内容
  PREMIUM_TOOLS = 'premium_tools',       // 高级工具
  PERSONAL_TRAINER = 'personal_trainer', // 私人教练
  DIET_CONSULTANT = 'diet_consultant',   // 营养咨询
  TCM_CONSULTANT = 'tcm_consultant',     // 中医咨询
  HEALTH_COURSE = 'health_course',       // 健康课程
  DATA_ANALYSIS = 'data_analysis',       // 数据分析
  PREMIUM_PLAN = 'premium_plan',         // 专属方案
}

// 工具分类
export enum ToolCategory {
  FOOD = 'food',           // 食物营养
  HEALTH = 'health',       // 健康监测
  FITNESS = 'fitness',     // 运动健身
  TCM = 'tcm',            // 中医养生
  COMMUNITY = 'community', // 社区互动
  VIP = 'vip'             // 会员专属
}

// 工具功能配置接口
export interface ToolFeature {
  type: ToolType;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  category: ToolCategory;
  requiresVip: boolean;
  version: string;
  permissions: string[];
  features: string[];
  supportedDevices: string[];
  config: {
    apiEndpoint?: string;
    updateFrequency?: number;
    maxUsagePerDay?: number;
    cacheEnabled?: boolean;
    offlineEnabled?: boolean;
    dataRetentionDays?: number;
    notificationEnabled?: boolean;
    syncEnabled?: boolean;
    aiAssistEnabled?: boolean;
    shareEnabled?: boolean;
  };
  integration: {
    healthKit?: boolean;
    googleFit?: boolean;
    wearables?: string[];
    thirdPartyApps?: string[];
  };
}

// 工具使用统计接口
export interface ToolUsageStats {
  toolType: ToolType;
  userId: string;
  usageCount: number;
  lastUsed: Date;
  averageDuration: number;
  successRate: number;
  favoriteFeatures: string[];
  achievedGoals: string[];
  dataPoints: number;
  syncStatus: {
    lastSync: Date;
    syncSuccess: boolean;
    errorMessage?: string;
  };
  deviceInfo: {
    platform: string;
    version: string;
    device: string;
  };
}

// ���具反馈接口
export interface ToolFeedback {
  toolType: ToolType;
  userId: string;
  rating: number;
  comment: string;
  timestamp: Date;
  deviceInfo: string;
  suggestions?: string;
  usageContext?: string;
  satisfaction: {
    ease: number;
    effectiveness: number;
    reliability: number;
  };
  featureRequests?: string[];
  bugReport?: {
    description: string;
    steps: string[];
    expectedResult: string;
    actualResult: string;
  };
}

// 工具数据同步接口
export interface ToolDataSync {
  toolType: ToolType;
  userId: string;
  dataType: string;
  timestamp: Date;
  data: any;
  source: string;
  version: string;
  checksum: string;
} 