import { EventEmitter } from 'events';
import { Logger } from '../../utils/logger';
import { Redis } from '../../utils/redis';
import { AI } from '../../utils/ai';

interface ConstitutionConfig {
  evaluationThreshold: number;
  aiModelVersions: {
    facial: string;
    tongue: string;
    pulse: string;
  };
}

export class ConstitutionService extends EventEmitter {
  private logger: Logger;
  private redis: Redis;
  private ai: AI;
  private config: ConstitutionConfig;

  constructor(config: ConstitutionConfig) {
    super();
    this.logger = new Logger('ConstitutionService');
    this.redis = new Redis();
    this.ai = new AI();
    this.config = config;
  }

  // 体质评估
  async evaluateConstitution(userId: string, data: {
    questionnaire?: any;
    facial?: string;
    tongue?: string;
    pulse?: any;
  }): Promise<any> {
    try {
      const results = await Promise.all([
        data.questionnaire && this.evaluateQuestionnaire(data.questionnaire),
        data.facial && this.analyzeFacial(data.facial),
        data.tongue && this.analyzeTongue(data.tongue),
        data.pulse && this.analyzePulse(data.pulse)
      ]);

      const constitution = this.synthesizeResults(results);
      await this.saveConstitutionResult(userId, constitution);

      return constitution;
    } catch (error) {
      this.logger.error('体质评估失败:', error);
      throw error;
    }
  }

  // 问卷评估
  private async evaluateQuestionnaire(answers: any): Promise<any> {
    // 实现问卷评分算法
    return {
      primaryType: '气虚质',
      secondaryType: '阴虚质',
      scores: {
        '气虚质': 0.8,
        '阴虚质': 0.6
      }
    };
  }

  // 面相分析
  private async analyzeFacial(imageUrl: string): Promise<any> {
    return await this.ai.analyze('facial', imageUrl, {
      modelVersion: this.config.aiModelVersions.facial
    });
  }

  // 舌诊分析
  private async analyzeTongue(imageUrl: string): Promise<any> {
    return await this.ai.analyze('tongue', imageUrl, {
      modelVersion: this.config.aiModelVersions.tongue
    });
  }

  // 脉诊分析
  private async analyzePulse(data: any): Promise<any> {
    return await this.ai.analyze('pulse', data, {
      modelVersion: this.config.aiModelVersions.pulse
    });
  }
} 