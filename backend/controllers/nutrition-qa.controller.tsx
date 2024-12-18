import { IAuthRequest } from '../types/models';
import { NutritionQA } from '../models/nutrition-qa.model';
import { Response } from 'express';
import { uploadImage } from '../utils/upload';

export class NutritionQAController {
  /**
   * 发布问题
   */
  public async createQuestion(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const questionData = req.body;
      const files = req.files as Express.Multer.File[];

      const imageUrls = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const imageUrl = await uploadImage(file);
          imageUrls.push(imageUrl);
        }
      }

      const question = new NutritionQA({
        ...questionData,
        userId,
        images: imageUrls,
      });

      await question.save();

      res.status(201).json({
        success: true,
        data: question,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 获取问题列表
   */
  public async getQuestions(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { category, status, isPrivate = false, search, page = 1, limit = 10 } = req.query;

      const query: any = { isPrivate };

      if (category) {
        query.category = category;
      }

      if (status) {
        query.status = status;
      }

      if (search) {
        query.$text = { $search: search as string };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const questions = await NutritionQA.find(query)
        .populate('userId', 'name avatar')
        .populate('answers.nutritionistId', 'name avatar nutritionistProfile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await NutritionQA.countDocuments(query);

      res.json({
        success: true,
        data: questions,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 获取问题详情
   */
  public async getQuestionDetails(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const question = await NutritionQA.findById(id)
        .populate('userId', 'name avatar')
        .populate('answers.nutritionistId', 'name avatar nutritionistProfile');

      if (!question) {
        res.status(404).json({
          success: false,
          message: '未找到该问题',
        });
        return;
      }

      // 检查私密问题访问权限
      if (question.isPrivate && question.userId.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: '无权访问该问题',
        });
        return;
      }

      // 增加浏览数
      question.viewCount += 1;
      await question.save();

      res.json({
        success: true,
        data: question,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 回答问题(营养师)
   */
  public async answerQuestion(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { content } = req.body;
      const files = req.files as Express.Multer.File[];

      const question = await NutritionQA.findById(id);
      if (!question) {
        res.status(404).json({
          success: false,
          message: '未找到该问题',
        });
        return;
      }

      if (question.status === '已关闭') {
        res.status(400).json({
          success: false,
          message: '该问题已关闭',
        });
        return;
      }

      const imageUrls = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const imageUrl = await uploadImage(file);
          imageUrls.push(imageUrl);
        }
      }

      question.answers.push({
        nutritionistId: userId,
        content,
        images: imageUrls,
        likes: 0,
        isAccepted: false,
        createdAt: new Date(),
      });

      question.status = '已回答';
      await question.save();

      res.json({
        success: true,
        data: question,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 采纳答案
   */
  public async acceptAnswer(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id, answerId } = req.params;
      const userId = req.user?.id;

      const question = await NutritionQA.findOne({
        _id: id,
        userId,
      });

      if (!question) {
        res.status(404).json({
          success: false,
          message: '未找到该问题',
        });
        return;
      }

      const answer = question.answers.id(answerId);
      if (!answer) {
        res.status(404).json({
          success: false,
          message: '未找到该回答',
        });
        return;
      }

      // 取消其他答案的采纳状态
      question.answers.forEach(a => {
        a.isAccepted = false;
      });

      answer.isAccepted = true;
      await question.save();

      res.json({
        success: true,
        data: question,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 点赞答案
   */
  public async likeAnswer(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id, answerId } = req.params;

      const question = await NutritionQA.findById(id);
      if (!question) {
        res.status(404).json({
          success: false,
          message: '未找到该问题',
        });
        return;
      }

      const answer = question.answers.id(answerId);
      if (!answer) {
        res.status(404).json({
          success: false,
          message: '未找到该回答',
        });
        return;
      }

      answer.likes += 1;
      await question.save();

      res.json({
        success: true,
        data: question,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const nutritionQAController = new NutritionQAController();
