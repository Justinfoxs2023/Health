import { Document, Types } from 'mongoose';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

// 运动姿态分析接口
export interface IPostureAnalysis extends Document {
  userId: Types.ObjectId;
  exerciseType: '跑步' | '深蹲' | '硬拉' | '卧推' | '引体向上' | '其他';
  videoUrl: string;
  keypoints: Array<{
    timestamp: number;
    points: Array<{
      name: string;
      x: number;
      y: number;
      confidence: number;
    }>;
  }>;
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
  recommendations: Array<{
    aspect: string;
    description: string;
    exercises: Array<{
      name: string;
      description: string;
      videoUrl: string;
    }>;
  }>;
  createdAt: Date;
}

// 健康风险预警接口
export interface IHealthRisk extends Document {
  userId: Types.ObjectId;
  riskType: '运动损伤' | '过度训练' | '营养不足' | '疾病风险' | '其他健康风险';
  severity: '低' | '中' | '高' | '紧急';
  description: string;
  triggers: Array<{
    indicator: string;
    value: number;
    threshold: number;
    trend: string;
  }>;
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
  recommendations: Array<{
    type: string;
    description: string;
    priority: string;
    timeframe: string;
  }>;
  status: 'active' | 'resolved' | 'monitoring';
  handlingRecords: Array<{
    time: Date;
    action: string;
    result: string;
    handler: Types.ObjectId;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// 食谱接口
export interface IRecipe extends Document {
  name: string;
  ingredients: Array<{
    food: Types.ObjectId;
    amount: number;
    note?: string;
  }>;
  steps: Array<{
    order: number;
    description: string;
    image?: string;
    duration?: number;
  }>;
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
    fiber: number;
  };
  occasions: Array<'早餐' | '午餐' | '晚餐' | '加餐'>;
  difficulty: '简单' | '中等' | '困难';
  cookingTime: number;
  servings: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 饮食计划接口
export interface IDietPlan extends Document {
  userId: Types.ObjectId;
  name: string;
  goal: '减重' | '增重' | '维持体重' | '增肌' | '营养均衡';
  dailyCalorieTarget: number;
  nutritionTargets: {
    protein: number;
    fat: number;
    carbohydrates: number;
    fiber?: number;
  };
  weeklyPlan: Array<{
    dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    meals: Array<{
      type: '早餐' | '午餐' | '晚餐' | '加餐';
      recipe: Types.ObjectId;
      portions: number;
    }>;
  }>;
  restrictions: string[];
  startDate: Date;
  endDate: Date;
  status: '进行中' | '已完成' | '已暂停';
  createdAt: Date;
  updatedAt: Date;
}

// 用户接口
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'nutritionist' | 'admin';
  profile: {
    gender?: '男' | '女' | '其他';
    age?: number;
    height?: number;
    weight?: number;
    activityLevel?: '久坐' | '轻度活动' | '中度活动' | '重度活动';
    healthGoals?: string[];
    dietaryRestrictions?: string[];
  };
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
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  calculateBMI(): number;
  calculateBMR(): number;
}

// 基础的IAuthRequest接口定义
export interface IAuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
  file?: Express.Multer.File;
}

// 用户服务响应接口
export interface IUserResponse {
  success: boolean;
  data?: any;
  message?: string;
  token?: string;
  error?: any;
}

// 预约接口
export interface IAppointment extends Document {
  userId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  type: '线上咨询' | '线下咨询';
  status: '待确认' | '已确认' | '已完成' | '已取消';
  date: Date;
  duration: number; // 分钟
  topic: string;
  description?: string;
  attachments?: string[];
  price: number;
  paymentStatus: '未支付' | '已支付' | '已退款';
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
  rating?: {
    score: number;
    comment: string;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 咨询记录接口
export interface IConsultation extends Document {
  appointmentId: Types.ObjectId;
  userId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  type: '饮食建议' | '运动指导' | '健康评估' | '其他';
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
  attachments?: Array<{
    type: string;
    url: string;
    description?: string;
  }>;
  followUpDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 营养师评价接口
export interface INutritionistReview extends Document {
  userId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  rating: number;
  comment: string;
  reply?: {
    content: string;
    createdAt: Date;
  };
  status: '待审核' | '已发布' | '已隐藏';
  createdAt: Date;
  updatedAt: Date;
}

// 营养知识文章接口
export interface INutritionArticle extends Document {
  title: string;
  author: Types.ObjectId;
  category: '营养知识' | '健康饮食' | '疾病饮食' | '运动营养' | '特殊人群' | '食品安全';
  tags: string[];
  content: string;
  summary: string;
  coverImage?: string;
  readCount: number;
  likeCount: number;
  commentCount: number;
  status: '草稿' | '待审核' | '已发布' | '已下线';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 营养咨询问答接口
export interface INutritionQA extends Document {
  userId: Types.ObjectId;
  title: string;
  content: string;
  images?: string[];
  category: '饮食咨询' | '营养方案' | '体重管理' | '疾病饮食' | '运动营养' | '其他';
  tags: string[];
  status: '待回答' | '已回答' | '已关闭';
  isPrivate: boolean;
  viewCount: number;
  answers: Array<{
    nutritionistId: Types.ObjectId;
    content: string;
    images?: string[];
    likes: number;
    isAccepted: boolean;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// 营养知识收藏接口
export interface INutritionCollection extends Document {
  userId: Types.ObjectId;
  type: '文章' | '问答';
  itemId: Types.ObjectId;
  note?: string;
  createdAt: Date;
} 