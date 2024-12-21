import { IAuthRequest } from './models';
import { Response, NextFunction } from 'express';

// Auth类的接口定义
export interface IAuth {
  /** required 的描述 */
  required: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  /** nutritionistRequired 的描述 */
  nutritionistRequired: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  /** adminRequired 的描述 */
  adminRequired: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
}

// 导出auth实例的类型
export const auth: IAuth;
