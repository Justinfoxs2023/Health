import { Document, Model } from 'mongoose';

// 基础文档接口
export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

// 用户文档接口
export interface IUser extends BaseDocument {
  username: string;
  email: string;
  password: string;
  roles: string[];
  status: 'active' | 'inactive' | 'locked';
  profile: {
    name?: string;
    avatar?: string;
    phone?: string;
  };
}

// 健康数据文档接口
export interface IHealthData extends BaseDocument {
  userId: string;
  type: 'vital_signs' | 'exercise' | 'diet' | 'sleep';
  metrics: {
    [key: string]: number | string | object;
  };
  source: string;
  deviceInfo?: {
    deviceId: string;
    deviceType: string;
  };
}

// 模型类型
export type UserModel = Model<IUser>;
export type HealthDataModel = Model<IHealthData>; 