import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-node';
import { ConfigurationManager } from '../config/ConfigurationManager';
import { Logger } from '../logger/Logger';
import { WebSocketService } from '../communication/WebSocketService';
import { injectable, inject } from 'inversify';

export interface IPoseData {
  /** keypoints 的描述 */
    keypoints: Array{
    name: string;
    position: {
      x: number;
      y: number;
      z: number;
    };
    score: number;
  }>;
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  score: number;
}

export interface IPoseAnalysis {
  /** correctness 的描述 */
    correctness: number;
  /** keyPointAnalysis 的描述 */
    keyPointAnalysis: Array{
    name: string;
    status: correct  warning  error;
    deviation: number;
    suggestion: string;
  }>;
  overallFeedback: string[];
  suggestedCorrections: Array<{
    priority: 'high' | 'medium' | 'low';
    description: string;
    visualGuide?: string;
  }>;
}

@injectable()
export class PoseEstimationService {
  private detector?: poseDetection.PoseDetector;
  private readonly modelConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    enableSmoothing: true,
    minPoseScore: 0.25,
  };

  constructor(
    @inject() private logger: Logger,
    @inject() private configManager: ConfigurationManager,
    @inject() private webSocketService: WebSocketService,
  ) {
    this.initialize();
  }

  /**
   * 初始化服务
   */
  private async initialize(): Promise<void> {
    try {
      // 加载姿态检测模型
      await this.loadModel();

      // 设置WebSocket处理器
      this.setupWebSocketHandlers();

      this.logger.info('姿态估计服务初始化成功');
    } catch (error) {
      this.logger.error('姿态估计服务初始化失败', error);
      throw error;
    }
  }

  /**
   * 估计姿态
   */
  public async estimatePose(
    imageData: Buffer | string,
    options?: {
      requireLandmarks?: boolean;
      confidence?: number;
    },
  ): Promise<{
    pose: IPoseData;
    landmarks?: Array<{
      x: number;
      y: number;
      z?: number;
      visibility?: number;
    }>;
    confidence: number;
  }> {
    try {
      if (!this.detector) {
        throw new Error('姿态检测器未初始化');
      }

      // 转换图像数据
      const tensor = await this.preprocessImage(imageData);

      // ���测姿态
      const poses = await this.detector.estimatePoses(tensor);

      if (!poses.length) {
        throw new Error('未检测到姿态');
      }

      // 处理结果
      const pose = this.processPoseResult(poses[0]);

      // 生成关键点
      const landmarks = options?.requireLandmarks ? this.generateLandmarks(pose) : undefined;

      return {
        pose,
        landmarks,
        confidence: pose.score,
      };
    } catch (error) {
      this.logger.error('估计姿态失败', error);
      throw error;
    }
  }

  /**
   * 分析姿态
   */
  public async analyzePose(
    pose: IPoseData,
    referenceData?: {
      pose: IPoseData;
      tolerances?: Record<string, number>;
    },
  ): Promise<IPoseAnalysis> {
    try {
      // 计算关键点分析
      const keyPointAnalysis = await this.analyzeKeyPoints(
        pose,
        referenceData?.pose,
        referenceData?.tolerances,
      );

      // 计算整体正确性
      const correctness = this.calculateCorrectness(keyPointAnalysis);

      // 生成反馈
      const feedback = this.generateFeedback(keyPointAnalysis);

      // 生成纠正建议
      const corrections = this.generateCorrections(keyPointAnalysis);

      return {
        correctness,
        keyPointAnalysis,
        overallFeedback: feedback,
        suggestedCorrections: corrections,
      };
    } catch (error) {
      this.logger.error('分析姿态失败', error);
      throw error;
    }
  }

  /**
   * 开始实时姿态估计
   */
  public async startRealtimePoseEstimation(
    sessionId: string,
    options?: {
      interval?: number;
      confidence?: number;
      referenceData?: {
        pose: IPoseData;
        tolerances?: Record<string, number>;
      };
    },
  ): Promise<void> {
    try {
      // 创建WebSocket房间
      await this.webSocketService.createRoom(sessionId, [sessionId]);

      // 设置实时处理
      this.setupRealtimeProcessing(sessionId, options);

      this.logger.info(`实时姿态估计会话 ${sessionId} 已启动`);
    } catch (error) {
      this.logger.error('启动实时姿态估计失败', error);
      throw error;
    }
  }

  /**
   * 停止实时姿态估计
   */
  public async stopRealtimePoseEstimation(sessionId: string): Promise<void> {
    try {
      // 关闭WebSocket房间
      await this.webSocketService.closeRoom(sessionId);

      this.logger.info(`实时姿态估计会话 ${sessionId} 已停止`);
    } catch (error) {
      this.logger.error('停止实时姿态估计失败', error);
      throw error;
    }
  }

  /**
   * 加载模型
   */
  private async loadModel(): Promise<void> {
    try {
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        this.modelConfig,
      );
    } catch (error) {
      this.logger.error('加载姿态检测模型失败', error);
      throw error;
    }
  }

  /**
   * 设置WebSocket处理器
   */
  private setupWebSocketHandlers(): void {
    this.webSocketService.on(
      'pose.frame',
      async (data: { sessionId: string; imageData: string }) => {
        try {
          // 处理实时帧
          const result = await this.processRealtimeFrame(data.sessionId, data.imageData);

          // 发送结果
          this.webSocketService.sendToRoom(data.sessionId, 'pose.result', result);
        } catch (error) {
          this.logger.error('处理实时帧失败', error);
        }
      },
    );
  }

  /**
   * 预处理图像
   */
  private async preprocessImage(imageData: Buffer | string): Promise<tf.Tensor3D> {
    try {
      // 实现图像预处理逻辑
      return tf.tensor3d([]);
    } catch (error) {
      this.logger.error('预处理图像失败', error);
      throw error;
    }
  }

  /**
   * 处理姿态结果
   */
  private processPoseResult(rawPose: poseDetection.Pose): IPoseData {
    try {
      return {
        keypoints: rawPose.keypoints.map(kp => ({
          name: kp.name || '',
          position: {
            x: kp.x,
            y: kp.y,
            z: kp.z,
          },
          score: kp.score || 0,
        })),
        bbox: rawPose.box,
        score: rawPose.score || 0,
      };
    } catch (error) {
      this.logger.error('处理姿态结果失败', error);
      throw error;
    }
  }

  /**
   * 生成关键点
   */
  private generateLandmarks(pose: IPoseData): Array<{
    x: number;
    y: number;
    z?: number;
    visibility?: number;
  }> {
    try {
      return pose.keypoints.map(kp => ({
        x: kp.position.x,
        y: kp.position.y,
        z: kp.position.z,
        visibility: kp.score,
      }));
    } catch (error) {
      this.logger.error('生成关键点失败', error);
      throw error;
    }
  }

  /**
   * 分析关键点
   */
  private async analyzeKeyPoints(
    pose: IPoseData,
    reference?: IPoseData,
    tolerances?: Record<string, number>,
  ): Promise<IPoseAnalysis['keyPointAnalysis']> {
    try {
      return pose.keypoints.map(kp => {
        const refPoint = reference?.keypoints.find(ref => ref.name === kp.name);

        if (!refPoint) {
          return {
            name: kp.name,
            status: 'correct',
            deviation: 0,
          };
        }

        const deviation = this.calculateDeviation(kp.position, refPoint.position);

        const tolerance = tolerances?.[kp.name] || 0.1;

        return {
          name: kp.name,
          status: this.getDeviationStatus(deviation, tolerance),
          deviation,
          suggestion: this.generatePointSuggestion(kp.name, deviation, tolerance),
        };
      });
    } catch (error) {
      this.logger.error('分析关键点失败', error);
      throw error;
    }
  }

  /**
   * 计算正确性
   */
  private calculateCorrectness(analysis: IPoseAnalysis['keyPointAnalysis']): number {
    try {
      const weights = {
        correct: 1,
        warning: 0.5,
        error: 0,
      };

      const totalScore = analysis.reduce((sum, point) => sum + weights[point.status], 0);

      return totalScore / analysis.length;
    } catch (error) {
      this.logger.error('计算正确性失败', error);
      throw error;
    }
  }

  /**
   * 生成反馈
   */
  private generateFeedback(analysis: IPoseAnalysis['keyPointAnalysis']): string[] {
    try {
      const feedback: string[] = [];

      // 添加整体评价
      const correctCount = analysis.filter(p => p.status === 'correct').length;
      const percentage = (correctCount / analysis.length) * 100;

      if (percentage >= 90) {
        feedback.push('姿势非常标准，继续保持！');
      } else if (percentage >= 70) {
        feedback.push('姿势基本正确，需要小幅调整。');
      } else {
        feedback.push('姿势需要较大调整，请注意以下要点：');
      }

      // 添加具体问题
      const issues = analysis
        .filter(p => p.status !== 'correct')
        .map(p => p.suggestion)
        .filter(Boolean);

      feedback.push(...issues);

      return feedback;
    } catch (error) {
      this.logger.error('生成反馈失败', error);
      throw error;
    }
  }

  /**
   * 生成纠正建议
   */
  private generateCorrections(
    analysis: IPoseAnalysis['keyPointAnalysis'],
  ): IPoseAnalysis['suggestedCorrections'] {
    try {
      const corrections: IPoseAnalysis['suggestedCorrections'] = [];

      // 处理错误的关键点
      const errors = analysis.filter(p => p.status === 'error');
      for (const error of errors) {
        corrections.push({
          priority: 'high',
          description: `调整${error.name}的位置`,
          visualGuide: this.generateVisualGuide(error),
        });
      }

      // 处理警告的关键点
      const warnings = analysis.filter(p => p.status === 'warning');
      for (const warning of warnings) {
        corrections.push({
          priority: 'medium',
          description: `微调${warning.name}的位置`,
          visualGuide: this.generateVisualGuide(warning),
        });
      }

      return corrections;
    } catch (error) {
      this.logger.error('生成纠正建议失败', error);
      throw error;
    }
  }

  /**
   * 设置实时处理
   */
  private setupRealtimeProcessing(
    sessionId: string,
    options?: {
      interval?: number;
      confidence?: number;
      referenceData?: {
        pose: IPoseData;
        tolerances?: Record<string, number>;
      };
    },
  ): void {
    const interval = options?.interval || 100;
    const confidence = options?.confidence || 0.5;

    setInterval(async () => {
      try {
        // 获取最新帧
        const frame = await this.webSocketService.getLatestFrame(sessionId);
        if (!frame) return;

        // 估计姿态
        const result = await this.estimatePose(frame, {
          confidence,
        });

        // 分析姿态
        if (result.confidence >= confidence) {
          const analysis = await this.analyzePose(result.pose, options?.referenceData);

          // 发送结果
          this.webSocketService.sendToRoom(sessionId, 'pose.analysis', {
            pose: result,
            analysis,
          });
        }
      } catch (error) {
        this.logger.error('实时处理失败', error);
      }
    }, interval);
  }

  /**
   * 处理实时帧
   */
  private async processRealtimeFrame(
    sessionId: string,
    imageData: string,
  ): Promise<{
    pose: IPoseData;
    analysis?: IPoseAnalysis;
  }> {
    try {
      const result = await this.estimatePose(imageData);

      // 获取参考数据
      const referenceData = await this.getReferenceData(sessionId);

      // 分析姿态
      const analysis = referenceData
        ? await this.analyzePose(result.pose, referenceData)
        : undefined;

      return {
        pose: result.pose,
        analysis,
      };
    } catch (error) {
      this.logger.error('处理实时帧失败', error);
      throw error;
    }
  }

  /**
   * 计算偏差
   */
  private calculateDeviation(
    point: { x: number; y: number; z?: number },
    reference: { x: number; y: number; z?: number },
  ): number {
    try {
      const dx = point.x - reference.x;
      const dy = point.y - reference.y;
      const dz = (point.z || 0) - (reference.z || 0);

      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    } catch (error) {
      this.logger.error('计算偏差失败', error);
      throw error;
    }
  }

  /**
   * 获取偏差状态
   */
  private getDeviationStatus(
    deviation: number,
    tolerance: number,
  ): 'correct' | 'warning' | 'error' {
    if (deviation <= tolerance) {
      return 'correct';
    } else if (deviation <= tolerance * 2) {
      return 'warning';
    } else {
      return 'error';
    }
  }

  /**
   * 生成关键点建议
   */
  private generatePointSuggestion(
    pointName: string,
    deviation: number,
    tolerance: number,
  ): string | undefined {
    try {
      if (deviation <= tolerance) {
        return undefined;
      }

      const severity = deviation <= tolerance * 2 ? '稍微' : '明显';
      return `${pointName}位置${severity}偏离，请调整`;
    } catch (error) {
      this.logger.error('生成关键点建议失败', error);
      throw error;
    }
  }

  /**
   * 生成视觉指南
   */
  private generateVisualGuide(point: IPoseAnalysis['keyPointAnalysis'][0]): string | undefined {
    try {
      // 实现视觉指南生成逻辑
      return undefined;
    } catch (error) {
      this.logger.error('生成视觉指南失败', error);
      throw error;
    }
  }

  /**
   * 获取参考数据
   */
  private async getReferenceData(sessionId: string): Promise<
    | {
        pose: IPoseData;
        tolerances?: Record<string, number>;
      }
    | undefined
  > {
    try {
      // 实现参考数据获取逻辑
      return undefined;
    } catch (error) {
      this.logger.error('获取参考数据失败', error);
      throw error;
    }
  }
}
