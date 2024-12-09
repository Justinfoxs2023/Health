import { OpenAI } from 'openai';
import { Logger } from '../utils/logger';
import { SurveyResult } from '../models/survey.model';
import { HealthReport } from '../models/health-report.model';

export class AIAnalysisService {
  private openai: OpenAI;
  private logger: Logger;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.logger = new Logger('AIAnalysisService');
  }

  async generateHealthReport(surveyResult: SurveyResult): Promise<HealthReport> {
    try {
      // 构建AI提示
      const prompt = this.buildAnalysisPrompt(surveyResult);
      
      // 调用AI生成报告
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "你是一个专业的健康顾问，负责分析用户的健康调查问卷并生成专业的健康报告。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      // 解析AI响应
      const reportContent = completion.choices[0].message.content;
      
      // 创建健康报告
      const report = await HealthReport.create({
        userId: surveyResult.userId,
        surveyResultId: surveyResult.id,
        content: reportContent,
        recommendations: this.extractRecommendations(reportContent),
        createdAt: new Date()
      });

      return report;
    } catch (error) {
      this.logger.error('生成AI健康报告失败', error);
      throw error;
    }
  }

  private buildAnalysisPrompt(surveyResult: SurveyResult): string {
    // 构建AI分析提示
    return `请基于以下健康调查问卷结果，生成一份专业的健康分析报告：
    
    基础信息：
    年龄：${surveyResult.age}
    身高：${surveyResult.height}cm
    体重：${surveyResult.weight}kg
    
    生活习惯：${JSON.stringify(surveyResult.lifestyleHabits)}
    运动情况：${JSON.stringify(surveyResult.exerciseHabits)}
    饮食习惯：${JSON.stringify(surveyResult.dietaryHabits)}
    
    请从以下几个方面进行分析：
    1. 身体健康状况评估
    2. 生活方式分析
    3. 潜在健康风险
    4. 改善建议
    5. 个性化的运动和饮食计划建议`;
  }

  private extractRecommendations(reportContent: string): string[] {
    // 从报告中提取关键建议
    // 这里可以使用正则表达式或其他方法来提取建议要点
    return [];
  }
} 