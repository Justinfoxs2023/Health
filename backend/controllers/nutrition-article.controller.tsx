import { IAuthRequest } from '../types/models';
import { NutritionArticle } from '../models/nutrition-article.model';
import { Response } from 'express';
import { uploadImage } from '../utils/upload';

export class NutritionArticleController {
  /**
   * 创建文章
   */
  public async createArticle(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const articleData = req.body;
      const file = req.file;

      if (file) {
        const imageUrl = await uploadImage(file);
        articleData.coverImage = imageUrl;
      }

      const article = new NutritionArticle({
        ...articleData,
        author: userId,
      });

      await article.save();

      res.status(201).json({
        success: true,
        data: article,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 获取文章列表
   */
  public async getArticles(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { category, status = '已发布', search, page = 1, limit = 10 } = req.query;

      const query: any = { status };

      if (category) {
        query.category = category;
      }

      if (search) {
        query.$text = { $search: search as string };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const articles = await NutritionArticle.find(query)
        .populate('author', 'name avatar nutritionistProfile')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await NutritionArticle.countDocuments(query);

      res.json({
        success: true,
        data: articles,
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
   * 获取文章详情
   */
  public async getArticleDetails(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const article = await NutritionArticle.findById(id).populate(
        'author',
        'name avatar nutritionistProfile',
      );

      if (!article) {
        res.status(404).json({
          success: false,
          message: '未找到该文章',
        });
        return;
      }

      // 增加阅读数
      article.readCount += 1;
      await article.save();

      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 更新文章
   */
  public async updateArticle(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updates = req.body;
      const file = req.file;

      const article = await NutritionArticle.findOne({
        _id: id,
        author: userId,
      });

      if (!article) {
        res.status(404).json({
          success: false,
          message: '未找到该文章',
        });
        return;
      }

      if (file) {
        const imageUrl = await uploadImage(file);
        updates.coverImage = imageUrl;
      }

      Object.assign(article, updates);
      await article.save();

      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 更新文章状态(管理员)
   */
  public async updateArticleStatus(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const article = await NutritionArticle.findById(id);
      if (!article) {
        res.status(404).json({
          success: false,
          message: '未找到该文章',
        });
        return;
      }

      article.status = status;
      if (status === '已发布') {
        article.publishedAt = new Date();
      }
      await article.save();

      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const nutritionArticleController = new NutritionArticleController();
