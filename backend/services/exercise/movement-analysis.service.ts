import { EventEmitter } from 'events';
import { Logger } from '../../utils/logger';
import { AI } from '../../utils/ai';

interface MovementAnalysis {
  id: string;
  userId: string;
  type: 'gait' | 'posture' | 'pattern';
  videoUrl: string;
  analysis: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  timestamp: Date;
}

export class MovementAnalysisService extends EventEmitter {
  private logger: Logger;
  private ai: AI;

  constructor() {
    super();
    this.logger = new Logger('MovementAnalysis');
    this.ai = new AI();
  }

  // 分析运动视频
  async analyzeMovement(userId: string, videoUrl: string, type: string): Promise<MovementAnalysis> {
    try {
      // 1. 预处理视频
      const processedVideo = await this.preprocessVideo(videoUrl);
      
      // 2. AI分析
      const analysis = await this.ai.analyze('movement', {
        video: processedVideo,
        type: type
      });
      
      // 3. 生成报告
      const report = await this.generateReport(analysis);
      
      // 4. 保存分析结果
      await this.saveAnalysis(userId, report);

      return report;
    } catch (error) {
      this.logger.error('动作分析失败:', error);
      throw error;
    }
  }

  // 生成改进建议
  async generateImprovements(analysis: MovementAnalysis): Promise<any> {
    try {
      const improvements = await this.ai.analyze('movement_improvement', {
        analysis: analysis,
        type: analysis.type
      });

      return this.formatImprovements(improvements);
    } catch (error) {
      this.logger.error('生成改进建议失败:', error);
      throw error;
    }
  }
} 