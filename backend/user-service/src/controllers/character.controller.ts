import { ILogger } from '../types/logger';
import { NameGeneratorService } from '../services/name-generator.service';
import { Request, Response } from 'express';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class CharacterController {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.NameGenerator) private nameGenerator: NameGeneratorService,
  ) {}

  // 生成随机名字
  async generateName(req: Request, res: Response) {
    try {
      const name = await this.nameGenerator.generateRandomName();
      return res.json({
        code: 200,
        data: { name },
      });
    } catch (error) {
      this.logger.error('生成名字失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  // 保存角色名字
  async saveName(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const userId = req.user.id;

      // 验证名字格式
      if (!name || name.length < 2 || name.length > 12) {
        return res.status(400).json({
          code: 400,
          message: '名字长度必须在2-12个字符之间',
        });
      }

      await this.nameGenerator.saveCharacterName(userId, name);

      return res.json({
        code: 200,
        message: '保存成功',
      });
    } catch (error) {
      this.logger.error('保存名字失败', error);
      return res.status(500).json({
        code: 500,
        message: error.message || '服务器错误',
      });
    }
  }

  // 检查名字可用性
  async checkName(req: Request, res: Response) {
    try {
      const { name } = req.query;
      const available = await this.nameGenerator.checkNameAvailability(name as string);

      return res.json({
        code: 200,
        data: { available },
      });
    } catch (error) {
      this.logger.error('检查名字失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }
}
