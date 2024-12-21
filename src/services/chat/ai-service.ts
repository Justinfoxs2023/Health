import { ConfigService } from '../../services/config.service';
import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../../services/open-ai.service';

@Injectable()
export class AIService {
  constructor(private openAI: OpenAIService, private configService: ConfigService) {}

  // 处理用户消息
  async handleUserMessage(userId: string, message: string): Promise<string> {
    // 情感分析
    const sentiment = await this.analyzeSentiment(message);

    // 根据情感选择回复策略
    if (sentiment.needsComfort) {
      return this.generateComfortResponse(message);
    }

    // 知识库匹配
    const knowledgeMatch = await this.matchKnowledge(message);
    if (knowledgeMatch) {
      return knowledgeMatch;
    }

    // 智能回复
    return this.generateAIResponse(message);
  }

  // 生成AI回复
  private async generateAIResponse(message: string): Promise<string> {
    const completion = await this.openAI.createCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '你是一个健康助手,帮助用户解答健康相关问题' },
        { role: 'user', content: message },
      ],
    });

    return completion.choices[0].message.content;
  }

  // 情感分析
  private async analyzeSentiment(message: string): Promise<{
    emotion: string;
    needsComfort: boolean;
    needsHuman: boolean;
  }> {
    // 实现情���分析逻辑
    return {
      emotion: 'neutral',
      needsComfort: false,
      needsHuman: false,
    };
  }
}
