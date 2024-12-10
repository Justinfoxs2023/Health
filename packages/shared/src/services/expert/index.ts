import { logger } from '../logger';

/** 专家类型 */
export enum ExpertType {
  DOCTOR = 'doctor', // 医生
  NUTRITIONIST = 'nutritionist', // 营养师
  TRAINER = 'trainer', // 健身教练
  PSYCHOLOGIST = 'psychologist', // 心理咨询师
  PHYSIOTHERAPIST = 'physiotherapist' // 理疗师
}

/** 专家领域 */
export enum ExpertField {
  GENERAL = 'general', // 全科
  INTERNAL = 'internal', // 内科
  SURGERY = 'surgery', // 外科
  PEDIATRICS = 'pediatrics', // 儿科
  GYNECOLOGY = 'gynecology', // 妇科
  NUTRITION = 'nutrition', // 营养
  FITNESS = 'fitness', // 健身
  REHABILITATION = 'rehabilitation', // 康复
  MENTAL = 'mental', // 心理
  CHINESE_MEDICINE = 'chinese_medicine' // 中医
}

/** 专家信息 */
export interface Expert {
  /** ID */
  id: string;
  /** 姓名 */
  name: string;
  /** 头像 */
  avatar: string;
  /** 类型 */
  type: ExpertType;
  /** 领域 */
  fields: ExpertField[];
  /** 职称 */
  title: string;
  /** 医院/机构 */
  organization: string;
  /** 简介 */
  introduction: string;
  /** 专业特长 */
  specialties: string[];
  /** 资质证书 */
  certificates: {
    name: string;
    number: string;
    issueDate: Date;
    imageUrl: string;
  }[];
  /** 咨询费用(元/次) */
  consultationFee: number;
  /** 评分 */
  rating: number;
  /** 咨询次数 */
  consultationCount: number;
  /** 好评率 */
  satisfactionRate: number;
  /** 在线状态 */
  online: boolean;
  /** 工作时间 */
  workingHours: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/** 咨询记录 */
export interface Consultation {
  /** ID */
  id: string;
  /** 用户ID */
  userId: string;
  /** 专家ID */
  expertId: string;
  /** 咨询类型 */
  type: 'online' | 'video' | 'offline';
  /** 咨询主题 */
  topic: string;
  /** 咨询描述 */
  description: string;
  /** 预约时间 */
  appointmentTime: Date;
  /** 状态 */
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  /** 取消原因 */
  cancelReason?: string;
  /** 咨询记录 */
  records?: {
    time: Date;
    content: string;
    type: 'text' | 'image' | 'voice' | 'video';
    sender: 'user' | 'expert';
  }[];
  /** 处方信息 */
  prescription?: {
    diagnosis: string;
    medicines: {
      name: string;
      usage: string;
      dosage: string;
      duration: string;
    }[];
    advice: string;
  };
  /** 评价信息 */
  evaluation?: {
    rating: number;
    content: string;
    tags: string[];
    createdAt: Date;
  };
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/** 专家查询选项 */
export interface ExpertQueryOptions {
  /** 类型 */
  type?: ExpertType;
  /** 领域 */
  fields?: ExpertField[];
  /** 在线状态 */
  online?: boolean;
  /** 排序方式 */
  sort?: 'rating' | 'consultationCount' | 'consultationFee';
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 专家服务 */
export class ExpertService {
  private static instance: ExpertService;

  private constructor() {}

  /** 获取单例 */
  public static getInstance(): ExpertService {
    if (!ExpertService.instance) {
      ExpertService.instance = new ExpertService();
    }
    return ExpertService.instance;
  }

  /** 获取专家列表 */
  public async getExperts(options: ExpertQueryOptions = {}): Promise<{
    experts: Expert[];
    total: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (options.type) queryParams.append('type', options.type);
      if (options.fields) options.fields.forEach(field => queryParams.append('fields', field));
      if (options.online !== undefined) queryParams.append('online', options.online.toString());
      if (options.sort) queryParams.append('sort', options.sort);
      if (options.page) queryParams.append('page', options.page.toString());
      if (options.pageSize) queryParams.append('pageSize', options.pageSize.toString());

      const response = await fetch(`/api/experts?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch experts');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to fetch experts', { error });
      throw error;
    }
  }

  /** 获取专家详情 */
  public async getExpert(expertId: string): Promise<Expert> {
    try {
      const response = await fetch(`/api/experts/${expertId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expert');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to fetch expert', { error });
      throw error;
    }
  }

  /** 创建咨询预约 */
  public async createConsultation(
    userId: string,
    data: {
      expertId: string;
      type: 'online' | 'video' | 'offline';
      topic: string;
      description: string;
      appointmentTime: Date;
    }
  ): Promise<Consultation> {
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          ...data,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create consultation');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to create consultation', { error });
      throw error;
    }
  }

  /** 获取咨询记录列表 */
  public async getConsultations(
    userId: string,
    options: {
      status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<{
    consultations: Consultation[];
    total: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      if (options.status) queryParams.append('status', options.status);
      if (options.page) queryParams.append('page', options.page.toString());
      if (options.pageSize) queryParams.append('pageSize', options.pageSize.toString());

      const response = await fetch(`/api/consultations?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch consultations');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to fetch consultations', { error });
      throw error;
    }
  }

  /** 获取咨询详情 */
  public async getConsultation(consultationId: string): Promise<Consultation> {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch consultation');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to fetch consultation', { error });
      throw error;
    }
  }

  /** 更新咨询状态 */
  public async updateConsultationStatus(
    consultationId: string,
    status: 'confirmed' | 'cancelled' | 'completed',
    data?: {
      cancelReason?: string;
    }
  ): Promise<Consultation> {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          ...data,
          updatedAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update consultation status');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to update consultation status', { error });
      throw error;
    }
  }

  /** 添加咨询记录 */
  public async addConsultationRecord(
    consultationId: string,
    data: {
      content: string;
      type: 'text' | 'image' | 'voice' | 'video';
      sender: 'user' | 'expert';
    }
  ): Promise<Consultation> {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          time: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add consultation record');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to add consultation record', { error });
      throw error;
    }
  }

  /** 添加处方信息 */
  public async addPrescription(
    consultationId: string,
    data: {
      diagnosis: string;
      medicines: {
        name: string;
        usage: string;
        dosage: string;
        duration: string;
      }[];
      advice: string;
    }
  ): Promise<Consultation> {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/prescription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to add prescription');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to add prescription', { error });
      throw error;
    }
  }

  /** 评价咨询 */
  public async evaluateConsultation(
    consultationId: string,
    data: {
      rating: number;
      content: string;
      tags: string[];
    }
  ): Promise<Consultation> {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          createdAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate consultation');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to evaluate consultation', { error });
      throw error;
    }
  }

  /** 搜索专家 */
  public async searchExperts(
    keyword: string,
    options: ExpertQueryOptions = {}
  ): Promise<{
    experts: Expert[];
    total: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('keyword', keyword);
      if (options.type) queryParams.append('type', options.type);
      if (options.fields) options.fields.forEach(field => queryParams.append('fields', field));
      if (options.online !== undefined) queryParams.append('online', options.online.toString());
      if (options.sort) queryParams.append('sort', options.sort);
      if (options.page) queryParams.append('page', options.page.toString());
      if (options.pageSize) queryParams.append('pageSize', options.pageSize.toString());

      const response = await fetch(`/api/experts/search?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to search experts');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to search experts', { error });
      throw error;
    }
  }

  /** 获取专家工作时间 */
  public async getExpertSchedule(
    expertId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    availableSlots: {
      date: Date;
      slots: {
        startTime: string;
        endTime: string;
        available: boolean;
      }[];
    }[];
  }> {
    try {
      const queryParams = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      const response = await fetch(`/api/experts/${expertId}/schedule?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expert schedule');
      }

      return response.json();
    } catch (error) {
      logger.error('Failed to fetch expert schedule', { error });
      throw error;
    }
  }
}

export const expertService = ExpertService.getInstance(); 