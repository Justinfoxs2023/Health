import { AxiosError } from 'axios';
import { notification } from 'antd';

export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
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

export interface HealthStatus {
  status: string;
  output?: string;
  checks?: Record<string, boolean>;
  timestamp: Date;
}

export interface ServiceDefinition {
  name: string;
  version: string;
  endpoints: ServiceEndpoint[];
}

export interface ServiceInstance {
  id: string;
  name: string;
  address: string;
  port: number;
  tags: string[];
}

export interface ServiceEndpoint {
  protocol: string;
  host: string;
  port: number;
}

// 健康数据类型定义
export interface HealthData {
  id: string;
  title: string;
  timestamp: string;
  metrics: Record<string, number>;
  tags?: string[];
}

// 健康指标配置
export interface HealthMetric {
  key: string;
  label: string;
  unit: string;
  color: string;
  format?: (value: number) => string;
}

// 详细健康数据
export interface DetailedHealthData {
  overview: {
    summary: string;
    highlights: Array<{
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
export interface HealthGoal {
  id: string;
  title: string;
  description?: string;
  target: number;
  unit: string;
  startDate: string;
  endDate: string;
  milestones?: Array<{
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
    members?: FamilyMember[];
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
    description?: string;
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
    diseases: Disease[];
  }

  interface Disease {
    name: string;
    diagnosisAge: number;
    severity: 'mild' | 'moderate' | 'severe';
  }

  interface RiskAssessment {
    disease: string;
    riskLevel: 'low' | 'medium' | 'high';
    contributingFactors: string[];
    preventiveMeasures: PreventiveMeasure[];
  }

  interface PreventiveMeasure {
    action: string;
    timeline: string;
    priority: number;
  }

  interface TimelineEvent {
    id: string;
    date: string;
    action: string;
    status: 'pending' | 'completed' | 'overdue';
  }
} 