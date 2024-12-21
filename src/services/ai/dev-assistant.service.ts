import { CodeAnalysis, TestCase, Documentation } from '../types/ai';
import { Logger } from '../utils/logger';
import { OpenAI } from 'openai';

export class DevAssistantService {
  private openai: OpenAI;
  private logger: Logger;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.logger = new Logger('DevAssistant');
  }

  // 代码审查
  async reviewCode(code: string): Promise<CodeAnalysis> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的代码审查助手，请分析以下代码并提供改进建议',
          },
          {
            role: 'user',
            content: code,
          },
        ],
      });

      return this.parseCodeAnalysis(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('代码审查失败', error);
      throw error;
    }
  }

  // 生成测试用例
  async generateTests(sourceCode: string): Promise<TestCase[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '请为以下代码生成完整的单元测试用例',
          },
          {
            role: 'user',
            content: sourceCode,
          },
        ],
      });

      return this.parseTestCases(response.choices[0].message.content);
    } catch (error) {
      this.logger.error('生成测试用例失败', error);
      throw error;
    }
  }
}
