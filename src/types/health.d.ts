import { AxiosError } from 'axios';
import { notification } from 'antd';

export class APIError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown) => {
  if (error instanceof APIError) {
    notification.error({
      message: '操作失败',
      description: error.message,
    });
    return;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 401:
        notification.error({
          message: '未授权访问',
          description: '请重新登录',
        });
        // 可以在这里处理登录跳转
        break;
      case 403:
        notification.error({
          message: '访问被拒绝',
          description: '您没有权限执行此操作',
        });
        break;
      case 404:
        notification.error({
          message: '资源不存在',
          description: '请求的资源未找到',
        });
        break;
      case 500:
        notification.error({
          message: '服务器错误',
          description: '服务器处理请求时出错',
        });
        break;
      default:
        notification.error({
          message: '请求失败',
          description: message,
        });
    }
    return;
  }

  // 处理其他类型错误
  notification.error({
    message: '未知错误',
    description: '发生未知错误，请稍后重试',
  });
};

export interface IHealthStatus {
  /** status 的描述 */
    status: string;
  /** output 的描述 */
    output: string;
  /** checks 的描述 */
    checks: Recordstring, /** boolean 的描述 */
    /** boolean 的描述 */
    boolean;
  /** timestamp 的描述 */
    timestamp: Date;
}

export interface IServiceDefinition {
  /** name 的描述 */
    name: string;
  /** version 的描述 */
    version: string;
  /** endpoints 的描述 */
    endpoints: IServiceEndpoint;
}

export interface IServiceInstance {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** address 的描述 */
    address: string;
  /** port 的描述 */
    port: number;
  /** tags 的描述 */
    tags: string;
}

export interface IServiceEndpoint {
  /** protocol 的描述 */
    protocol: string;
  /** host 的描述 */
    host: string;
  /** port 的描述 */
    port: number;
}

// 健康数据类型定义
export interface IHealthData {
  /** id 的描述 */
    id: string;
  /** title 的描述 */
    title: string;
  /** timestamp 的描述 */
    timestamp: string;
  /** metrics 的描述 */
    metrics: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number;
  /** tags 的描述 */
    tags: string;
}

// 健康指标配置
export interface IHealthMetric {
  /** key 的描述 */
    key: string;
  /** label 的描述 */
    label: string;
  /** unit 的描述 */
    unit: string;
  /** color 的描述 */
    color: string;
  /** format 的描述 */
    format: value: number  string;
}

// 详细健康数据
export interface IDetailedHealthData {
  /** overview 的描述 */
    overview: {
    summary: string;
    highlights: Array{
      label: string;
      value: number;
      change: number;
    }>;
  };
  trends: Array<{
    date: string;
    [key: string]: number | string;
  }>;
  analysis: {
    insights: string[];
    recommendations: string[];
    risks: string[];
  };
}

// 健康目标类型
export interface IHealthGoal {
  /** id 的描述 */
    id: string;
  /** title 的描述 */
    title: string;
  /** description 的描述 */
    description: string;
  /** target 的描述 */
    target: number;
  /** unit 的描述 */
    unit: string;
  /** startDate 的描述 */
    startDate: string;
  /** endDate 的描述 */
    endDate: string;
  /** milestones 的描述 */
    milestones: Array{
    title: string;
    value: number;
  }>;
}

// 用户成长系统类型
declare namespace Health {
  interface UserGrowth {
    id: string;
    userId: string;
    points: number;
    level: number;
    lastUpdated: Date;
    members: FamilyMember;
  }

  interface FamilyMember {
    id: string;
    name: string;
    healthStatus: string;
    familyId: string;
    userGrowthId: string;
  }

  interface Reward {
    id: string;
    title: string;
    points: number;
    description: string;
    isActive: boolean;
  }

  // API 响应类型
  interface ApiResponse<T = any> {
    code: number;
    message: string;
    data?: T;
  }

  interface DiseaseHistory {
    memberId: string;
    relationship: string;
    diseases: Disease;
  }

  interface Disease {
    name: string;
    diagnosisAge: number;
    severity: mild  moderate  severe;
  }

  interface IRiskAssessment {
    /** disease 的描述 */
      disease: string;
    /** riskLevel 的描述 */
      riskLevel: low  medium  high;
    contributingFactors: string;
    preventiveMeasures: PreventiveMeasure;
  }

  interface IPreventiveMeasure {
    /** action 的描述 */
      action: string;
    /** timeline 的描述 */
      timeline: string;
    /** priority 的描述 */
      priority: number;
  }

  interface ITimelineEvent {
    /** id 的描述 */
      id: string;
    /** date 的描述 */
      date: string;
    /** action 的描述 */
      action: string;
    /** status 的描述 */
      status: pending  completed  overdue;
  }
}
