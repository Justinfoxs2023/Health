// 服务管理
export interface ServiceManagement {
  // 服务项目
  serviceItem: {
    id: string;
    providerId: string;
    name: string;
    category: ServiceCategory;
    description: string;
    duration: number; // 分钟
    price: number;
    
    // 服务详情
    details: {
      process: string[];
      requirements: string[];
      contraindications?: string[];
      preparations?: string[];
    };
    
    // 服务人员
    staff: Array<{
      id: string;
      name: string;
      title: string;
      specialties: string[];
      availability: boolean;
    }>;
    
    // 服务时段
    timeSlots: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      maxBookings: number;
    }>;
  };

  // 预约管理
  appointment: {
    id: string;
    serviceId: string;
    userId: string;
    staffId: string;
    status: AppointmentStatus;
    
    // 预约时间
    schedule: {
      date: Date;
      startTime: string;
      endTime: string;
      duration: number;
    };
    
    // 用户信息
    userInfo: {
      name: string;
      phone: string;
      medicalHistory?: string[];
      specialRequirements?: string;
    };
    
    // 支付信息
    payment: {
      amount: number;
      status: 'pending' | 'paid' | 'refunded';
      method?: string;
      transactionId?: string;
    };
  };

  // 服务评价
  serviceReview: {
    id: string;
    appointmentId: string;
    userId: string;
    staffId: string;
    rating: number;
    
    // 评价内容
    content: {
      overall: string;
      professional: number;
      attitude: number;
      environment: number;
      tags: string[];
    };
    
    // 回复
    reply?: {
      content: string;
      timestamp: Date;
      repliedBy: string;
    };
  };
}

// 服务类别
export type ServiceCategory = 
  | 'medical_consultation'    // 医疗咨询
  | 'health_examination'      // 健康体检
  | 'rehabilitation'          // 康复理疗
  | 'traditional_therapy'     // 传统疗法
  | 'psychological_counsel'   // 心理咨询
  | 'nutrition_guidance'      // 营养指导
  | 'fitness_training';       // 健身训练

// 预约状态
export type AppointmentStatus = 
  | 'pending'      // 待确认
  | 'confirmed'    // 已确认
  | 'in_service'   // 服务中
  | 'completed'    // 已完成
  | 'cancelled'    // 已取消
  | 'rescheduled'; // 已改期

// 服务包管理
export interface ServicePackage {
  id: string;
  name: string;
  providerId: string;
  
  // 包含服务
  services: Array<{
    serviceId: string;
    sessions: number;
    validPeriod: number; // 天数
  }>;
  
  // 价格信息
  pricing: {
    originalPrice: number;
    packagePrice: number;
    savingAmount: number;
    perSessionPrice: number;
  };
  
  // 使用规则
  rules: {
    transferable: boolean;
    refundable: boolean;
    extensible: boolean;
    shareableMembers?: number;
  };
  
  // 销售信息
  sales: {
    soldCount: number;
    activeUsers: number;
    completionRate: number;
    satisfactionRate: number;
  };
}

// 服务预约配置
export interface AppointmentConfig {
  // 时间配置
  timeConfig: {
    minAdvanceTime: number;     // 最少提前预约时间(小时)
    maxAdvanceTime: number;     // 最多提前预约时间(天)
    serviceInterval: number;     // 服务间隔时间(分钟)
    defaultDuration: number;     // 默认服务时长(分钟)
  };
  
  // 预约规则
  rules: {
    maxActiveBookings: number;  // 最大活跃预约数
    cancellationPolicy: {
      deadline: number;         // 取消截止时间(小时)
      refundRate: number;       // 退款比例
    };
    noShowPolicy: {
      penalty: number;          // 违约金
      restrictionDays: number;  // 限制预约天数
    };
  };
  
  // 提醒设置
  notifications: {
    confirmationRequired: boolean;
    reminderTiming: number[];   // 提前提醒时间(小时)
    channels: string[];         // 提醒渠道
  };
} 