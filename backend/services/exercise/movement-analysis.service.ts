import { AI } from '../../utils/ai';
import { EventEmitter } from 'events';
import { Logger } from '../../utils/logger';

interface IMovementAnalysis {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** type 的描述 */
  type: 'gait' | 'posture' | 'pattern';
  /** videoUrl 的描述 */
  videoUrl: string;
  /** analysis 的描述 */
  analysis: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  /** timestamp 的描述 */
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
  async analyzeMovement(
    userId: string,
    videoUrl: string,
    type: string,
  ): Promise<IMovementAnalysis> {
    try {
      // 1. 预处理视频
      const processedVideo = await this.preprocessVideo(videoUrl);

      // 2. AI分析
      const analysis = await this.ai.analyze('movement', {
        video: processedVideo,
        type: type,
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
  async generateImprovements(analysis: IMovementAnalysis): Promise<any> {
    try {
      const improvements = await this.ai.analyze('movement_improvement', {
        analysis: analysis,
        type: analysis.type,
      });

      return this.formatImprovements(improvements);
    } catch (error) {
      this.logger.error('生成改进建议失败:', error);
      throw error;
    }
  }
}
