import { DevWorkflowService } from '../services/ai/dev-workflow.service';
import { Logger } from '../utils/logger';
import { Request, Response } from 'express';

export class DevAssistantController {
  private workflowService: DevWorkflowService;
  private logger: Logger;

  constructor() {
    this.workflowService = new DevWorkflowService();
    this.logger = new Logger('DevAssistantController');
  }

  // 代码审查
  async reviewCode(req: Request, res: Response) {
    try {
      const { code } = req.body;
      const comments = await this.workflowService.assistCodeReview(code);

      return res.json({
        code: 200,
        data: comments,
        message: '代码审查完成',
      });
    } catch (error) {
      this.logger.error('代码审查失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  // 测试生成
  async generateTests(req: Request, res: Response) {
    try {
      const { sourceCode } = req.body;
      const tests = await this.workflowService.generateTests(sourceCode);

      return res.json({
        code: 200,
        data: tests,
        message: '测试用例生成成功',
      });
    } catch (error) {
      this.logger.error('生成测试用例失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }
}
