/**
 * @fileoverview TS 文件 service-management.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 服务管理
export interface IServiceManagement {
   
  /** serviceItem 的描述 */
    serviceItem: {
    id: string;
    providerId: string;
    name: string;
    category: ServiceCategoryType;
    description: string;
    duration: number;  
    price: number;

     
    details: {
      process: string;
      requirements: string;
      contraindications: string;
      preparations: string;
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
  /** appointment 的描述 */
    appointment: {
    id: string;
    serviceId: string;
    userId: string;
    staffId: string;
    status: AppointmentStatusType;

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
  /** serviceReview 的描述 */
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
export type ServiceCategoryType =
  any; // 健身训练

// 预约状态
export type AppointmentStatusType =
  any; // 已改期

// 服务包管理
export interface IServicePackage {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** providerId 的描述 */
    providerId: string;

   
  /** services 的描述 */
    services: Array{
    serviceId: string;
    sessions: number;
    validPeriod: number;  
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
export interface IAppointmentConfig {
   
  /** timeConfig 的描述 */
    timeConfig: {
    minAdvanceTime: number;  
    maxAdvanceTime: number;  
    serviceInterval: number;  
    defaultDuration: number;  
  };

  // 预约规则
  /** rules 的描述 */
    rules: {
    maxActiveBookings: number; // 最大活跃预约数
    cancellationPolicy: {
      deadline: number; // 取消截止时间(小时)
      refundRate: number; // 退款比例
    };
    noShowPolicy: {
      penalty: number; // 违约金
      restrictionDays: number; // 限制预约天数
    };
  };

  // 提醒设置
  /** notifications 的描述 */
    notifications: {
    confirmationRequired: boolean;
    reminderTiming: number[]; // 提前提醒时间(小时)
    channels: string[]; // 提醒渠道
  };
}
