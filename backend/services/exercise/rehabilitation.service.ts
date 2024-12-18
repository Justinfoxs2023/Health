import { AI } from '../../utils/ai';
import { EventEmitter } from 'events';
import { Logger } from '../../utils/logger';

interface IRehabProgram {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** injury 的描述 */
  injury: {
    type: string;
    severity: 'mild' | 'moderate' | 'severe';
    location: string;
    onset: Date;
  };
  /** phase 的描述 */
  phase: 'acute' | 'rehabilitation' | 'return_to_activity';
  /** exercises 的描述 */
  exercises: RehabExercise[];
  /** restrictions 的描述 */
  restrictions: string[];
  /** progress 的描述 */
  progress: ProgressRecord[];
}

export class RehabilitationService extends EventEmitter {
  private logger: Logger;
  private ai: AI;

  constructor() {
    super();
    this.logger = new Logger('Rehabilitation');
    this.ai = new AI();
  }

  // 创建康复计划
  async createRehabProgram(userId: string, injury: any): Promise<IRehabProgram> {
    try {
      // 1. 评估伤情
      const assessment = await this.assessInjury(injury);

      // 2. 确定康复阶段
      const phase = this.determinePhase(assessment);

      // 3. 生成康复计划
      const program = await this.generateProgram(assessment, phase);

      // 4. 添加监测指标
      const finalProgram = await this.addMonitoring(program);

      // 5. 保存计划
      await this.saveProgram(userId, finalProgram);

      return finalProgram;
    } catch (error) {
      this.logger.error('创建康复计划失败:', error);
      throw error;
    }
  }

  // 更新康复进度
  async updateProgress(programId: string, progress: any): Promise<IRehabProgram> {
    try {
      // 1. 获取当前计划
      const program = await this.getProgram(programId);

      // 2. 评估恢复情况
      const recovery = await this.assessRecovery(progress);

      // 3. 调整计划
      const updatedProgram = await this.adjustProgram(program, recovery);

      // 4. 保存更新
      await this.saveProgram(program.userId, updatedProgram);

      return updatedProgram;
    } catch (error) {
      this.logger.error('更新康复进度失败:', error);
      throw error;
    }
  }

  // 生成康复指导
  async generateGuidance(program: IRehabProgram): Promise<any> {
    try {
      const guidance = await this.ai.analyze('rehabilitation', {
        program,
        phase: program.phase,
        progress: program.progress,
      });

      return this.formatGuidance(guidance);
    } catch (error) {
      this.logger.error('生成康复指导失败:', error);
      throw error;
    }
  }
}
