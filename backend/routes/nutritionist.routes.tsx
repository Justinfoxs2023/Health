import { Router, Request, Response, NextFunction } from 'express';
import { nutritionistController } from '../controllers/nutritionist.controller';
import { auth } from '../middleware/auth.tsx';
import { IAuthRequest } from '../types/models';

const router = Router();

// 获取营养师列表
router.get('/', nutritionistController.getNutritionists);

// 获取营养师详情
router.get('/:id', nutritionistController.getNutritionistDetails);

// 创建中间件来处理类型转换
const convertToAuthRequest = (req: Request): IAuthRequest => {
  return req as IAuthRequest;
};

// 更新营养师资料(需要营养师权限)
router.put('/profile', 
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = convertToAuthRequest(req);
    await auth.nutritionistRequired(authReq, res, next);
  },
  async (req: Request, res: Response) => {
    const authReq = convertToAuthRequest(req);
    await nutritionistController.updateNutritionistProfile(authReq, res);
  }
);

// 更新工作时间(需要营养师权限)
router.put('/availability',
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = convertToAuthRequest(req);
    await auth.nutritionistRequired(authReq, res, next);
  },
  async (req: Request, res: Response) => {
    const authReq = convertToAuthRequest(req);
    await nutritionistController.updateAvailability(authReq, res);
  }
);

export default router; 