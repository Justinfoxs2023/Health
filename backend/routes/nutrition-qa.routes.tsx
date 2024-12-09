import { Router } from 'express';
import multer from 'multer';
import { nutritionQAController } from '../controllers/nutrition-qa.controller';
import { auth } from '../middleware/auth';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// 发布问题
router.post('/', auth.required, upload.array('images', 5), nutritionQAController.createQuestion);

// 获取问题列表
router.get('/', nutritionQAController.getQuestions);

// 获取问题详情
router.get('/:id', auth.required, nutritionQAController.getQuestionDetails);

// 回答问题(营养师)
router.post('/:id/answers', auth.nutritionistRequired, upload.array('images', 5), nutritionQAController.answerQuestion);

// 采纳答案
router.put('/:id/answers/:answerId/accept', auth.required, nutritionQAController.acceptAnswer);

// 点赞答案
router.put('/:id/answers/:answerId/like', auth.required, nutritionQAController.likeAnswer);

export default router; 