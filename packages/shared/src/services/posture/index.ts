import { logger } from '../logger';

/** 关键点类型 */
export enum KeyPointType {
  NOSE = 'nose',
  LEFT_EYE = 'leftEye',
  RIGHT_EYE = 'rightEye',
  LEFT_EAR = 'leftEar',
  RIGHT_EAR = 'rightEar',
  LEFT_SHOULDER = 'leftShoulder',
  RIGHT_SHOULDER = 'rightShoulder',
  LEFT_ELBOW = 'leftElbow',
  RIGHT_ELBOW = 'rightElbow',
  LEFT_WRIST = 'leftWrist',
  RIGHT_WRIST = 'rightWrist',
  LEFT_HIP = 'leftHip',
  RIGHT_HIP = 'rightHip',
  LEFT_KNEE = 'leftKnee',
  RIGHT_KNEE = 'rightKnee',
  LEFT_ANKLE = 'leftAnkle',
  RIGHT_ANKLE = 'rightAnkle',
}

/** 关键点数据 */
export interface IKeyPoint {
  /** 类型 */
  type: KeyPointType;
  /** x坐标 */
  x: number;
  /** y坐标 */
  y: number;
  /** 置信度 */
  confidence: number;
}

/** 姿态数据 */
export interface IPostureData {
  /** 时间戳 */
  timestamp: Date;
  /** 关键点数据 */
  keyPoints: IKeyPoint[];
  /** 角度数据 */
  angles: {
    /** 左肘角度 */
    leftElbow?: number;
    /** 右肘角度 */
    rightElbow?: number;
    /** 左膝角度 */
    leftKnee?: number;
    /** 右膝角度 */
    rightKnee?: number;
    /** 左��角度 */
    leftHip?: number;
    /** 右髋角度 */
    rightHip?: number;
  };
  /** 姿态评分 */
  score: number;
}

/** 姿态分析结果 */
export interface IPostureAnalysis {
  /** 姿态数据 */
  data: IPostureData;
  /** 标准差异 */
  deviations: {
    keyPoint: KeyPointType;
    deviation: number;
    suggestion: string;
  }[];
  /** 整体评估 */
  evaluation: {
    /** 总体评分 */
    score: number;
    /** 主要问题 */
    issues: string[];
    /** 改进建议 */
    suggestions: string[];
  };
}

/** 姿态分析服务 */
export class PostureService {
  private static instance: PostureService;

  private constructor() {}

  /** 获取单例 */
  public static getInstance(): PostureService {
    if (!PostureService.instance) {
      PostureService.instance = new PostureService();
    }
    return PostureService.instance;
  }

  /** 分析姿态 */
  public async analyzePosture(
    imageData: ImageData,
    exerciseType: string,
  ): Promise<IPostureAnalysis> {
    try {
      // 检测关键点
      const keyPoints = await this.detectKeyPoints(imageData);

      // 计算角度
      const angles = this.calculateAngles(keyPoints);

      // 评估姿态
      const score = this.evaluatePosture(keyPoints, angles, exerciseType);

      // 构建姿���数据
      const postureData: IPostureData = {
        timestamp: new Date(),
        keyPoints,
        angles,
        score,
      };

      // 分析与标准姿态的差异
      const deviations = this.analyzeDeviations(postureData, exerciseType);

      // 生成评估结果
      const evaluation = this.generateEvaluation(postureData, deviations);

      return {
        data: postureData,
        deviations,
        evaluation,
      };
    } catch (error) {
      logger.error('Failed to analyze posture', { error });
      throw error;
    }
  }

  /** 检测关键点 */
  private async detectKeyPoints(imageData: ImageData): Promise<IKeyPoint[]> {
    try {
      // 调用姿态检测API
      const response = await fetch('/api/posture/detect', {
        method: 'POST',
        body: imageData,
      });

      if (!response.ok) {
        throw new Error('Failed to detect key points');
      }

      return response.json();
    } catch (error) {
      logger.error('Key points detection failed', { error });
      throw error;
    }
  }

  /** 计算角度 */
  private calculateAngles(keyPoints: IKeyPoint[]): IPostureData['angles'] {
    const angles: IPostureData['angles'] = {};

    // 获取关键点
    const getPoint = (type: KeyPointType): IKeyPoint | undefined =>
      keyPoints.find(p => p.type === type);

    // 计算角度
    const calculateAngle = (p1?: IKeyPoint, p2?: IKeyPoint, p3?: IKeyPoint): number | undefined => {
      if (!p1 || !p2 || !p3) return undefined;

      const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
      let angle = Math.abs((radians * 180.0) / Math.PI);

      if (angle > 180.0) {
        angle = 360 - angle;
      }

      return angle;
    };

    // 计算左肘角度
    angles.leftElbow = calculateAngle(
      getPoint(KeyPointType.LEFT_SHOULDER),
      getPoint(KeyPointType.LEFT_ELBOW),
      getPoint(KeyPointType.LEFT_WRIST),
    );

    // 计算右肘角度
    angles.rightElbow = calculateAngle(
      getPoint(KeyPointType.RIGHT_SHOULDER),
      getPoint(KeyPointType.RIGHT_ELBOW),
      getPoint(KeyPointType.RIGHT_WRIST),
    );

    // 计算左膝角度
    angles.leftKnee = calculateAngle(
      getPoint(KeyPointType.LEFT_HIP),
      getPoint(KeyPointType.LEFT_KNEE),
      getPoint(KeyPointType.LEFT_ANKLE),
    );

    // 计算右膝角度
    angles.rightKnee = calculateAngle(
      getPoint(KeyPointType.RIGHT_HIP),
      getPoint(KeyPointType.RIGHT_KNEE),
      getPoint(KeyPointType.RIGHT_ANKLE),
    );

    // 计算左髋角度
    angles.leftHip = calculateAngle(
      getPoint(KeyPointType.LEFT_SHOULDER),
      getPoint(KeyPointType.LEFT_HIP),
      getPoint(KeyPointType.LEFT_KNEE),
    );

    // 计算右髋角度
    angles.rightHip = calculateAngle(
      getPoint(KeyPointType.RIGHT_SHOULDER),
      getPoint(KeyPointType.RIGHT_HIP),
      getPoint(KeyPointType.RIGHT_KNEE),
    );

    return angles;
  }

  /** 评估姿态 */
  private evaluatePosture(
    keyPoints: IKeyPoint[],
    angles: IPostureData['angles'],
    exerciseType: string,
  ): number {
    let score = 100;

    // 检查关键点置信度
    keyPoints.forEach(point => {
      if (point.confidence < 0.5) {
        score -= 5;
      }
    });

    // 检查对称性
    if (angles.leftElbow && angles.rightElbow) {
      const elbowDiff = Math.abs(angles.leftElbow - angles.rightElbow);
      if (elbowDiff > 15) {
        score -= 10;
      }
    }

    if (angles.leftKnee && angles.rightKnee) {
      const kneeDiff = Math.abs(angles.leftKnee - angles.rightKnee);
      if (kneeDiff > 15) {
        score -= 10;
      }
    }

    // 根据运动类型检查特定角度
    switch (exerciseType) {
      case 'squat':
        if (angles.leftKnee && angles.leftKnee < 90) {
          score -= 15;
        }
        break;
      case 'pushup':
        if (angles.leftElbow && angles.leftElbow < 90) {
          score -= 15;
        }
        break;
      // ... 其他运动类型的检查
    }

    return Math.max(0, Math.min(100, score));
  }

  /** 分析差异 */
  private analyzeDeviations(
    postureData: IPostureData,
    exerciseType: string,
  ): IPostureAnalysis['deviations'] {
    const deviations: IPostureAnalysis['deviations'] = [];

    // 获取标准姿态数据
    const standardPosture = this.getStandardPosture(exerciseType);

    // 比较关键点位置
    postureData.keyPoints.forEach(point => {
      const standardPoint = standardPosture.keyPoints.find(p => p.type === point.type);
      if (standardPoint) {
        const deviation = Math.sqrt(
          Math.pow(point.x - standardPoint.x, 2) + Math.pow(point.y - standardPoint.y, 2),
        );

        if (deviation > 0.1) {
          deviations.push({
            keyPoint: point.type,
            deviation,
            suggestion: this.generateSuggestion(point.type, deviation, exerciseType),
          });
        }
      }
    });

    return deviations;
  }

  /** 获取标准姿态 */
  private getStandardPosture(exerciseType: string): IPostureData {
    // 从数据库或配置中获取标准姿态数据
    // 这里使用模拟数据
    return {
      timestamp: new Date(),
      keyPoints: [],
      angles: {},
      score: 100,
    };
  }

  /** 生成建议 */
  private generateSuggestion(
    keyPoint: KeyPointType,
    deviation: number,
    exerciseType: string,
  ): string {
    // 根据关键点类型和偏差生成具体建议
    switch (keyPoint) {
      case KeyPointType.LEFT_KNEE:
      case KeyPointType.RIGHT_KNEE:
        return deviation > 0.2
          ? '膝盖弯曲角度过大，请保持适当的弯曲度'
          : '请注意膝盖的位置，保持稳定';
      case KeyPointType.LEFT_ELBOW:
      case KeyPointType.RIGHT_ELBOW:
        return deviation > 0.2 ? '手臂弯曲角度不足，请加大弯曲幅度' : '请保持手臂稳定性';
      // ... 其他关键点的建议
      default:
        return '请保持标准姿态';
    }
  }

  /** 生成评估结果 */
  private generateEvaluation(
    postureData: IPostureData,
    deviations: IPostureAnalysis['deviations'],
  ): IPostureAnalysis['evaluation'] {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // 分析主要问题
    if (deviations.length > 0) {
      issues.push('存在姿态偏差');
      suggestions.push('建议参考标准动作视频进行练习');
    }

    // 分析对称性
    if (
      postureData.angles.leftElbow &&
      postureData.angles.rightElbow &&
      Math.abs(postureData.angles.leftElbow - postureData.angles.rightElbow) > 15
    ) {
      issues.push('左右手臂动作不对称');
      suggestions.push('注意保持左右手臂动作的一致性');
    }

    if (
      postureData.angles.leftKnee &&
      postureData.angles.rightKnee &&
      Math.abs(postureData.angles.leftKnee - postureData.angles.rightKnee) > 15
    ) {
      issues.push('左右腿动作不对称');
      suggestions.push('注意保持左右腿动作的一致性');
    }

    // 根据评分给出总体建议
    if (postureData.score < 60) {
      suggestions.push('建议在镜子前练习或请教专业教练');
    } else if (postureData.score < 80) {
      suggestions.push('动作基本正确，需要继续改进细节');
    }

    return {
      score: postureData.score,
      issues,
      suggestions,
    };
  }
}

export const postureService = PostureService.getInstance();
