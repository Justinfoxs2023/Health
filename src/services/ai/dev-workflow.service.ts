import { DevAssistantService } from './dev-assistant.service';
import { Logger } from '../utils/logger';
import { CodeAnalysis, TestCase, Documentation } from '../types/ai';

export class DevWorkflowService {
  private devAssistant: DevAssistantService;
  private logger: Logger;

  constructor() {
    this.devAssistant = new DevAssistantService();
    this.logger = new Logger('DevWorkflow');
  }

  // 代码提交前检查
  async preCommitCheck(changes: string[]): Promise<boolean> {
    try {
      // 1. 代码质量检查
      const analysis = await this.devAssistant.reviewCode(changes.join('\n'));
      
      // 2. 生成测试用例
      const tests = await this.devAssistant.generateTests(changes.join('\n'));
      
      // 3. 运行测试
      const testResults = await this.runTests(tests);
      
      // 4. 更新文档
      await this.updateDocs(changes);

      return this.validateResults(analysis, testResults);
    } catch (error) {
      this.logger.error('Pre-commit check failed', error);
      return false;
    }
  }

  // 代码审查辅助
  async assistCodeReview(pullRequest: string): Promise<CodeReviewComment[]> {
    try {
      const analysis = await this.devAssistant.reviewCode(pullRequest);
      return this.generateReviewComments(analysis);
    } catch (error) {
      this.logger.error('Code review assistance failed', error);
      throw error;
    }
  }

  // 持续集成支持
  async supportCI(buildContext: BuildContext): Promise<CIReport> {
    try {
      // 1. 分析构建上下文
      const analysis = await this.analyzeBuildContext(buildContext);
      
      // 2. 生成优化建议
      const suggestions = await this.generateBuildSuggestions(analysis);
      
      // 3. 自动修复常见问题
      const fixes = await this.autoFixCommonIssues(analysis);

      return {
        analysis,
        suggestions,
        fixes,
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error('CI support failed', error);
      throw error;
    }
  }
} 