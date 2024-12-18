import { IconService } from '../services/icon.service';
import { Logger } from '../utils/logger';
import { Request, Response } from 'express';

export class IconController {
  private iconService: IconService;
  private logger: Logger;

  constructor() {
    this.iconService = new IconService();
    this.logger = new Logger('IconController');
  }

  /**
   * 获取图标列表
   */
  public async getIcons(req: Request, res: Response) {
    try {
      const { category, tags, page = 1, limit = 20 } = req.query;

      const icons = await this.iconService.getIcons({
        category: category as string,
        tags: tags as string[],
        page: Number(page),
        limit: Number(limit),
      });

      return res.json({
        code: 200,
        data: icons,
      });
    } catch (error) {
      this.logger.error('获取图标列表失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 上传新图标
   */
  public async uploadIcon(req: Request, res: Response) {
    try {
      const { name, category, tags } = req.body;
      const iconFile = req.file;

      if (!iconFile) {
        return res.status(400).json({
          code: 400,
          message: '请上传图标文件',
        });
      }

      const icon = await this.iconService.uploadIcon({
        name,
        category,
        tags,
        file: iconFile,
      });

      return res.status(201).json({
        code: 201,
        data: icon,
        message: '图标上传成功',
      });
    } catch (error) {
      this.logger.error('上传图标失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 更新图标信息
   */
  public async updateIcon(req: Request, res: Response) {
    try {
      const { iconId } = req.params;
      const updateData = req.body;

      const icon = await this.iconService.updateIcon(iconId, updateData);

      return res.json({
        code: 200,
        data: icon,
        message: '图标更新成功',
      });
    } catch (error) {
      this.logger.error('更新图标失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }
}
