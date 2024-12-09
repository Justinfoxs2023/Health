import { Router } from 'express';
import { foodController } from '../controllers/food.controller';
import { auth } from '../middleware/auth.tsx';
import { IAuthRequest } from '../types/models';

const router = Router();

// 获取食物列表
router.get('/', 
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.required(authReq, res, next);
  },
  foodController.getFoodList
);

// 获取食物详情
router.get('/:id',
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.required(authReq, res, next);
  },
  foodController.getFoodDetails
);

// 添加新食物(需要管理员权限)
router.post('/',
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.adminRequired(authReq, res, next);
  },
  foodController.createFood
);

// 更新食物信息(需要管理员权限)
router.put('/:id',
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.adminRequired(authReq, res, next);
  },
  foodController.updateFood
);

// 删除食物(需要管理员权限)
router.delete('/:id',
  async (req, res, next) => {
    const authReq = req as IAuthRequest;
    await auth.adminRequired(authReq, res, next);
  },
  foodController.deleteFood
);

export default router; 