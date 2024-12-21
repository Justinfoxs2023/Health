import { DeepseekService } from '../ai/deepseek.service';
import { Logger } from '../../utils/logger';
import { RekognitionService } from './rekognition.service';

export class SpecializedAnalysisService {
  private logger: Logger;
  private deepseek: DeepseekService;
  private rekognition: RekognitionService;

  constructor() {
    this.logger = new Logger('SpecializedAnalysis');
    this.deepseek = new DeepseekService();
    this.rekognition = new RekognitionService();
  }

  // 康复训练分析
  async analyzeRehabilitationExercise(imageKey: string, condition: string) {
    try {
      const [poseAnalysis, medicalContext] = await Promise.all([
        this.rekognition.analyzeExercisePose(imageKey, 'rehab'),
        this.deepseek.getMedicalContext(condition),
      ]);

      return await this.deepseek.analyzeRehabilitation({
        pose: poseAnalysis,
        condition: medicalContext,
        requirements: {
          type: 'rehabilitation',
          focus: ['安全性', '有效性', '进展'],
        },
      });
    } catch (error) {
      this.logger.error('康复训练分析失败:', error);
      throw error;
    }
  }

  // 运动损伤风险评估
  async assessInjuryRisk(imageKey: string, userProfile: any) {
    try {
      const analysis = await this.rekognition.analyzeExercisePose(imageKey, 'risk');

      return await this.deepseek.assessInjuryRisk({
        pose: analysis,
        userProfile,
        history: await this.getUserExerciseHistory(userProfile.userId),
      });
    } catch (error) {
      this.logger.error('损伤风险评估失败:', error);
      throw error;
    }
  }

  // 专业运动表现分析
  async analyzeAthleticPerformance(imageKey: string, sport: string) {
    try {
      const [poseAnalysis, sportMetrics] = await Promise.all([
        this.rekognition.analyzeExercisePose(imageKey, 'performance'),
        this.getSportSpecificMetrics(sport),
      ]);

      return await this.deepseek.analyzePerformance({
        pose: poseAnalysis,
        sport,
        metrics: sportMetrics,
        standards: await this.getSportStandards(sport),
      });
    } catch (error) {
      this.logger.error('运动表现分析失败:', error);
      throw error;
    }
  }
}
