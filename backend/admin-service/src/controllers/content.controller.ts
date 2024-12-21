import { ContentService } from '../services/content.service';
import { Logger } from '../utils/logger';
import { Request, Response } from 'express';

export class ContentController {
  private contentService: ContentService;
  private logger: Logger;

  constructor() {
    this.contentService = new ContentService();
    this.logger = new Logger('ContentController');
  }

  /**
   * 获取内容列表
   */
  async getContents(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, type, status } = req.query;

      const contents = await this.contentService.getContents({
        page: Number(page),
        limit: Number(limit),
        type: type as string,
        status: status as string,
      });

      return res.json({
        code: 200,
        data: contents,
      });
    } catch (error) {
      this.logger.error('获取内容列表失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 审核内容
   */
  async reviewContent(req: Request, res: Response) {
    try {
      const { contentId } = req.params;
      const { status, remarks } = req.body;
      const adminId = req.user.id;

      await this.contentService.reviewContent({
        contentId,
        status,
        remarks,
        reviewerId: adminId,
      });

      return res.json({
        code: 200,
        message: '内容审核成功',
      });
    } catch (error) {
      this.logger.error('内容审核失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 发布内容
   */
  async publishContent(req: Request, res: Response) {
    try {
      const { contentId } = req.params;
      const { publishTime } = req.body;
      const adminId = req.user.id;

      await this.contentService.publishContent({
        contentId,
        publishTime: publishTime ? new Date(publishTime) : new Date(),
        publisherId: adminId,
      });

      return res.json({
        code: 200,
        message: '内容发布成功',
      });
    } catch (error) {
      this.logger.error('内容发布失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 内容统计
   */
  async getContentStats(req: Request, res: Response) {
    try {
      const stats = await this.contentService.getContentStatistics();

      return res.json({
        code: 200,
        data: stats,
      });
    } catch (error) {
      this.logger.error('获取内容统计失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }
}
