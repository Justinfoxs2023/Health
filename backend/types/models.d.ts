import { Document, Types } from 'mongoose';
import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';

// 运动姿态分析接口
export interface IPostureAnalysis extends Document {
  /** userId 的描述 */
  userId: Types.ObjectId;
  /** exerciseType 的描述 */
  exerciseType: '跑步' | '深蹲' | '硬拉' | '卧推' | '引体向上' | '其他';
  /** videoUrl 的描述 */
  videoUrl: string;
  /** keypoints 的描述 */
  keypoints: Array<{
    timestamp: number;
    points: Array<{
      name: string;
      x: number;
      y: number;
      confidence: number;
    }>;
  }>;
  /** analysis 的描述 */
  analysis: {
    score: number;
    jointAngles: Array<{
      joint: string;
      angle: number;
      standard: number;
      deviation: number;
    }>;
    trajectory: {
      smoothness: number;
      stability: number;
      symmetry: number;
    };
    issues: Array<{
      timestamp: number;
      type: string;
      description: string;
      severity: string;
      suggestion: string;
    }>;
  };
  /** recommendations 的描述 */
  recommendations: Array<{
    aspect: string;
    description: string;
    exercises: Array<{
      name: string;
      description: string;
      videoUrl: string;
    }>;
  }>;
  /** createdAt 的描述 */
  createdAt: Date;
}

// 健康风险预警接口
export interface IHealthRisk extends Document {
  /** userId 的描述 */
  userId: Types.ObjectId;
  /** riskType 的描述 */
  riskType: '运动损伤' | '过度训练' | '营养不足' | '疾病风险' | '其他健康风险';
  /** severity 的描述 */
  severity: '低' | '中' | '高' | '紧急';
  /** description 的描述 */
  description: string;
  /** triggers 的描述 */
  triggers: Array<{
    indicator: string;
    value: number;
    threshold: number;
    trend: string;
  }>;
  /** relatedData 的描述 */
  relatedData: {
    exercise: {
      intensity: number;
      duration: number;
      frequency: number;
    };
    vitals: {
      heartRate: number;
      bloodPressure: {
        systolic: number;
        diastolic: number;
      };
      bodyTemperature: number;
    };
    nutrition: {
      calorieIntake: number;
      proteinIntake: number;
      hydration: number;
    };
  };
  /** recommendations 的描述 */
  recommendations: Array<{
    type: string;
    description: string;
    priority: string;
    timeframe: string;
  }>;
  /** status 的描述 */
  status: 'active' | 'resolved' | 'monitoring';
  /** handlingRecords 的描述 */
  handlingRecords: Array<{
    time: Date;
    action: string;
    result: string;
    handler: Types.ObjectId;
  }>;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 食谱接口
export interface IRecipe extends Document {
  /** name 的描述 */
  name: string;
  /** ingredients 的描述 */
  ingredients: Array<{
    food: Types.ObjectId;
    amount: number;
    note?: string;
  }>;
  /** steps 的描述 */
  steps: Array<{
    order: number;
    description: string;
    image?: string;
    duration?: number;
  }>;
  /** nutrition 的描述 */
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
    fiber: number;
  };
  /** occasions 的描述 */
  occasions: Array<'早餐' | '午餐' | '晚餐' | '加餐'>;
  /** difficulty 的描述 */
  difficulty: '简单' | '中等' | '困难';
  /** cookingTime 的描述 */
  cookingTime: number;
  /** servings 的描述 */
  servings: number;
  /** tags 的描述 */
  tags: string[];
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 饮食计划接口
export interface IDietPlan extends Document {
  /** userId 的描述 */
  userId: Types.ObjectId;
  /** name 的描述 */
  name: string;
  /** goal 的描述 */
  goal: '减重' | '增重' | '维持体重' | '增肌' | '营养均衡';
  /** dailyCalorieTarget 的描述 */
  dailyCalorieTarget: number;
  /** nutritionTargets 的描述 */
  nutritionTargets: {
    protein: number;
    fat: number;
    carbohydrates: number;
    fiber?: number;
  };
  /** weeklyPlan 的描述 */
  weeklyPlan: Array<{
    dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    meals: Array<{
      type: '早餐' | '午餐' | '晚餐' | '加餐';
      recipe: Types.ObjectId;
      portions: number;
    }>;
  }>;
  /** restrictions 的描述 */
  restrictions: string[];
  /** startDate 的描述 */
  startDate: Date;
  /** endDate 的描述 */
  endDate: Date;
  /** status 的描述 */
  status: '进行中' | '已完成' | '已暂停';
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 用户接口
export interface IUser extends Document {
  /** name 的描述 */
  name: string;
  /** email 的描述 */
  email: string;
  /** password 的描述 */
  password: string;
  /** avatar 的描述 */
  avatar?: string;
  /** role 的描述 */
  role: 'user' | 'nutritionist' | 'admin';
  /** profile 的描述 */
  profile: {
    gender?: '男' | '女' | '其他';
    age?: number;
    height?: number;
    weight?: number;
    activityLevel?: '久坐' | '轻度活动' | '中度活动' | '重度活动';
    healthGoals?: string[];
    dietaryRestrictions?: string[];
  };
  /** healthData 的描述 */
  healthData: {
    bmi?: number;
    bodyFat?: number;
    muscleMass?: number;
    basalMetabolicRate?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
      lastChecked: Date;
    };
    bloodSugar?: {
      value: number;
      lastChecked: Date;
    };
  };
  /** nutritionistProfile 的描述 */
  nutritionistProfile?: {
    specialties: string[];
    certification: string[];
    experience: number;
    rating: number;
    availability: Array<{
      dayOfWeek: number;
      isWorking: boolean;
      workingHours?: {
        start: string;
        end: string;
      };
      maxAppointments?: number;
    }>;
  };
  /** settings 的描述 */
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      shareHealthData: boolean;
      shareProgress: boolean;
      publicProfile: boolean;
    };
    language: string;
    timezone: string;
  };
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
  /** lastLogin 的描述 */
  lastLogin?: Date;
  /** isActive 的描述 */
  isActive: boolean;
  /** verificationToken 的描述 */
  verificationToken?: string;
  /** resetPasswordToken 的描述 */
  resetPasswordToken?: string;
  /** resetPasswordExpires 的描述 */
  resetPasswordExpires?: Date;

  calculateBMI(): number;
  calculateBMR(): number;
}

// 基础的IAuthRequest接口定义
export interface IAuthRequest extends Request {
  /** user 的描述 */
  user?: {
    id: string;
    role: string;
  };
  /** file 的描述 */
  file?: Express.Multer.File;
}

// 用户服务响应接口
export interface IUserResponse {
  /** success 的描述 */
  success: boolean;
  /** data 的描述 */
  data?: any;
  /** message 的描述 */
  message?: string;
  /** token 的描述 */
  token?: string;
  /** error 的描述 */
  error?: any;
}

// 预约接口
export interface IAppointment extends Document {
  /** userId 的描述 */
  userId: Types.ObjectId;
  /** nutritionistId 的描述 */
  nutritionistId: Types.ObjectId;
  /** type 的描述 */
  type: '线上咨询' | '线下咨询';
  /** status 的描述 */
  status: '待确认' | '已确认' | '已完成' | '已取消';
  /** date 的描述 */
  date: Date;
  /** duration 的描述 */
  duration: number; // 分钟
  /** topic 的描述 */
  topic: string;
  /** description 的描述 */
  description?: string;
  /** attachments 的描述 */
  attachments?: string[];
  /** price 的描述 */
  price: number;
  /** paymentStatus 的描述 */
  paymentStatus: '未支付' | '已支付' | '已退款';
  /** consultationRecord 的描述 */
  consultationRecord?: {
    mainComplaints: string;
    diagnosis: string;
    suggestions: string[];
    prescriptions?: Array<{
      type: string;
      content: string;
      duration: string;
    }>;
    followUpPlan?: string;
  };
  /** rating 的描述 */
  rating?: {
    score: number;
    comment: string;
    createdAt: Date;
  };
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 咨询记录接口
export interface IConsultation extends Document {
  /** appointmentId 的描述 */
  appointmentId: Types.ObjectId;
  /** userId 的描述 */
  userId: Types.ObjectId;
  /** nutritionistId 的描述 */
  nutritionistId: Types.ObjectId;
  /** type 的描述 */
  type: '饮食建议' | '运动指导' | '健康评估' | '其他';
  /** content 的描述 */
  content: {
    currentStatus: {
      diet: string;
      exercise: string;
      health: string;
    };
    analysis: string;
    recommendations: Array<{
      category: string;
      content: string;
      priority: '高' | '中' | '低';
    }>;
    mealPlan?: Array<{
      dayOfWeek: number;
      meals: Array<{
        type: '早餐' | '午餐' | '晚餐' | '加餐';
        foods: string[];
        notes?: string;
      }>;
    }>;
    exercisePlan?: Array<{
      dayOfWeek: number;
      exercises: Array<{
        name: string;
        duration: number;
        intensity: string;
        notes?: string;
      }>;
    }>;
  };
  /** attachments 的描述 */
  attachments?: Array<{
    type: string;
    url: string;
    description?: string;
  }>;
  /** followUpDate 的描述 */
  followUpDate?: Date;
  /** notes 的描述 */
  notes?: string;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 营养师评价接口
export interface INutritionistReview extends Document {
  /** userId 的描述 */
  userId: Types.ObjectId;
  /** nutritionistId 的描述 */
  nutritionistId: Types.ObjectId;
  /** appointmentId 的描述 */
  appointmentId: Types.ObjectId;
  /** rating 的描述 */
  rating: number;
  /** comment 的描述 */
  comment: string;
  /** reply 的描述 */
  reply?: {
    content: string;
    createdAt: Date;
  };
  /** status 的描述 */
  status: '待审核' | '已发布' | '已隐藏';
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 营养知识文章接口
export interface INutritionArticle extends Document {
  /** title 的描述 */
  title: string;
  /** author 的描述 */
  author: Types.ObjectId;
  /** category 的描述 */
  category: '营养知识' | '健康饮食' | '疾病饮食' | '运动营养' | '特殊人群' | '食品安全';
  /** tags 的描述 */
  tags: string[];
  /** content 的描述 */
  content: string;
  /** summary 的描述 */
  summary: string;
  /** coverImage 的描述 */
  coverImage?: string;
  /** readCount 的描述 */
  readCount: number;
  /** likeCount 的描述 */
  likeCount: number;
  /** commentCount 的描述 */
  commentCount: number;
  /** status 的描述 */
  status: '草稿' | '待审核' | '已发布' | '已下线';
  /** publishedAt 的描述 */
  publishedAt?: Date;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 营养咨询问答接口
export interface INutritionQA extends Document {
  /** userId 的描述 */
  userId: Types.ObjectId;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** images 的描述 */
  images?: string[];
  /** category 的描述 */
  category: '饮食咨询' | '营养方案' | '体重管理' | '疾病饮食' | '运动营养' | '其他';
  /** tags 的描述 */
  tags: string[];
  /** status 的描述 */
  status: '待回答' | '已回答' | '已关闭';
  /** isPrivate 的描述 */
  isPrivate: boolean;
  /** viewCount 的描述 */
  viewCount: number;
  /** answers 的描述 */
  answers: Array<{
    nutritionistId: Types.ObjectId;
    content: string;
    images?: string[];
    likes: number;
    isAccepted: boolean;
    createdAt: Date;
  }>;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

// 营养知识收藏接口
export interface INutritionCollection extends Document {
  /** userId 的描述 */
  userId: Types.ObjectId;
  /** type 的描述 */
  type: '文章' | '问答';
  /** itemId 的描述 */
  itemId: Types.ObjectId;
  /** note 的描述 */
  note?: string;
  /** createdAt 的描述 */
  createdAt: Date;
}
