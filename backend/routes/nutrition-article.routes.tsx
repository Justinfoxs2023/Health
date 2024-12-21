import multer from 'multer';
import { Router } from 'express';
import { auth } from '../middleware/auth';
import { nutritionArticleController } from '../controllers/nutrition-article.controller';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// 创建文章
router.post(
  '/',
  auth.nutritionistRequired,
  upload.single('coverImage'),
  nutritionArticleController.createArticle,
);

// 获取文章列表
router.get('/', nutritionArticleController.getArticles);

// 获取文章详情
router.get('/:id', nutritionArticleController.getArticleDetails);

// 更新文章
router.put(
  '/:id',
  auth.nutritionistRequired,
  upload.single('coverImage'),
  nutritionArticleController.updateArticle,
);

// 更新文章状态(管理员)
router.put('/:id/status', auth.adminRequired, nutritionArticleController.updateArticleStatus);

export default router;
