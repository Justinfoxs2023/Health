import { Response, NextFunction } from 'express';
import { IAuthRequest } from './models';

// Auth类的接口定义
export interface IAuth {
  required: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  nutritionistRequired: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  adminRequired: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
}

// 导出auth实例的类型
export const auth: IAuth; 