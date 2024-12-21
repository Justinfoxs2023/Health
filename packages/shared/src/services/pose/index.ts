import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { BehaviorSubject } from 'rxjs';

interface IPoint {
  /** x 的描述 */
  x: number;
  /** y 的描述 */
  y: number;
  /** z 的描述 */
  z?: number;
  /** score 的描述 */
  score?: number;
}

interface IKeypoint {
  /** name 的描述 */
  name: string;
  /** point 的描述 */
  point: IPoint;
  /** score 的描述 */
  score: number;
}

interface IPose {
  /** keypoints 的描述 */
  keypoints: IKeypoint[];
  /** score 的描述 */
  score: number;
  /** bbox 的描述 */
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface IPoseAnalysisResult {
  /** poses 的描述 */
  poses: IPose[];
  /** analysis 的描述 */
  analysis: {
    posture: string;
    symmetry: number;
    stability: number;
    recommendations: string[];
  };
  /** timestamp 的描述 */
  timestamp: number;
}

interface IPoseState {
  /** analyzing 的描述 */
  analyzing: boolean;
  /** result 的描述 */
  result: IPoseAnalysisResult | null;
  /** error 的描述 */
  error: Error | null;
  /** lastProcessedFrame 的描述 */
  lastProcessedFrame: number;
  /** processingFPS 的描述 */
  processingFPS: number;
  /** cacheSize 的描述 */
  cacheSize: number;
}

export class PoseService {
  private detector: poseDetection.PoseDetector | null = null;
  private state$ = new BehaviorSubject<IPoseState>({
    analyzing: false,
    result: null,
    error: null,
    lastProcessedFrame: 0,
    processingFPS: 0,
    cacheSize: 0,
  });

  private resultCache = new Map<string, IPoseAnalysisResult>();
  private maxCacheSize = 100;
  private processingQueue: Array<() => Promise<void>> = [];
  private isProcessing = false;
  private lastFrameTime = 0;
  private frameCount = 0;
  private fpsUpdateInterval = 1000; // 1秒更新一次FPS

  constructor() {
    this.initializeDetector();
    this.startFPSMonitoring();
  }

  private async initializeDetector() {
    try {
      const model = poseDetection.SupportedModels.BlazePose;
      const detectorConfig = {
        runtime: 'tfjs',
        enableSmoothing: true,
        modelType: 'full',
      };
      this.detector = await poseDetection.createDetector(model, detectorConfig);
    } catch (error) {
      this.updateError(error as Error);
    }
  }

  // 启动FPS监控
  private startFPSMonitoring() {
    setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - this.lastFrameTime;
      if (elapsed >= this.fpsUpdateInterval) {
        const fps = (this.frameCount * 1000) / elapsed;
        this.state$.next({
          ...this.state$.value,
          processingFPS: Math.round(fps),
        });
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }
    }, this.fpsUpdateInterval);
  }

  // 获取服务状态
  getState() {
    return this.state$.asObservable();
  }

  // 分析姿态
  async analyzePose(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
    if (!this.detector) {
      throw new Error('姿态检测器未初始化');
    }

    // 生成缓存键
    const cacheKey = this.generateCacheKey(image);
    const cachedResult = this.resultCache.get(cacheKey);
    if (cachedResult && Date.now() - cachedResult.timestamp < 1000) {
      return cachedResult;
    }

    // 添加到处理队列
    return new Promise<IPoseAnalysisResult>((resolve, reject) => {
      this.processingQueue.push(async () => {
        try {
          const result = await this.processPose(image);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  // 处理队列
  private async processQueue() {
    if (this.processingQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.processingQueue.shift();
    if (task) {
      await task();
      this.frameCount++;
      this.processQueue();
    }
  }

  // 处理单个姿态分析任务
  private async processPose(
    image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  ): Promise<IPoseAnalysisResult> {
    this.state$.next({
      ...this.state$.value,
      analyzing: true,
    });

    try {
      const poses = await this.detector!.estimatePoses(image, {
        flipHorizontal: false,
        maxPoses: 1,
        scoreThreshold: 0.5,
      });

      if (poses.length === 0) {
        throw new Error('未检测到姿态');
      }

      const analysis = await this.analyzePoseData(poses[0]);
      const result: IPoseAnalysisResult = {
        poses: poses.map(pose => ({
          keypoints: pose.keypoints.map(kp => ({
            name: kp.name,
            point: {
              x: kp.x,
              y: kp.y,
              z: kp.z,
              score: kp.score,
            },
            score: kp.score,
          })),
          score: pose.score || 0,
          bbox: pose.box
            ? {
                x: pose.box.xMin,
                y: pose.box.yMin,
                width: pose.box.width,
                height: pose.box.height,
              }
            : undefined,
        })),
        analysis,
        timestamp: Date.now(),
      };

      // 更新缓存
      this.updateCache(this.generateCacheKey(image), result);

      this.state$.next({
        ...this.state$.value,
        analyzing: false,
        result,
        error: null,
        lastProcessedFrame: Date.now(),
      });

      return result;
    } catch (error) {
      this.updateError(error as Error);
      throw error;
    }
  }

  // 生成缓存键
  private generateCacheKey(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法创建canvas上下文');

    canvas.width = 32; // 缩小尺寸以减少计算量
    canvas.height = 32;
    ctx.drawImage(image, 0, 0, 32, 32);
    return canvas.toDataURL('image/jpeg', 0.1);
  }

  // 更新缓存
  private updateCache(key: string, result: IPoseAnalysisResult) {
    if (this.resultCache.size >= this.maxCacheSize) {
      const oldestKey = this.resultCache.keys().next().value;
      this.resultCache.delete(oldestKey);
    }
    this.resultCache.set(key, result);
    this.state$.next({
      ...this.state$.value,
      cacheSize: this.resultCache.size,
    });
  }

  // 清理缓存
  clearCache() {
    this.resultCache.clear();
    this.state$.next({
      ...this.state$.value,
      cacheSize: 0,
    });
  }

  // 设置最大缓存大小
  setMaxCacheSize(size: number) {
    this.maxCacheSize = size;
    while (this.resultCache.size > size) {
      const oldestKey = this.resultCache.keys().next().value;
      this.resultCache.delete(oldestKey);
    }
    this.state$.next({
      ...this.state$.value,
      cacheSize: this.resultCache.size,
    });
  }

  // 更新错误状态
  private updateError(error: Error) {
    this.state$.next({
      ...this.state$.value,
      analyzing: false,
      error,
    });
  }

  // 分析姿态数据
  private analyzePoseData(pose: poseDetection.Pose): {
    posture: string;
    symmetry: number;
    stability: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let posture = '正常';
    let symmetry = 1;
    let stability = 1;

    // 分析头部位置
    const nose = pose.keypoints.find(kp => kp.name === 'nose');
    const leftEye = pose.keypoints.find(kp => kp.name === 'left_eye');
    const rightEye = pose.keypoints.find(kp => kp.name === 'right_eye');

    if (nose && leftEye && rightEye) {
      const headTilt = Math.abs(leftEye.y - rightEye.y);
      if (headTilt > 20) {
        posture = '头部倾斜';
        recommendations.push('保持头部正直，避免长时间歪头');
        symmetry *= 0.8;
      }
    }

    // 分析肩膀位置
    const leftShoulder = pose.keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = pose.keypoints.find(kp => kp.name === 'right_shoulder');

    if (leftShoulder && rightShoulder) {
      const shoulderTilt = Math.abs(leftShoulder.y - rightShoulder.y);
      if (shoulderTilt > 30) {
        posture = '肩膀不平';
        recommendations.push('注意保持肩膀水平，可能需要调整工作台高度');
        symmetry *= 0.7;
      }
    }

    // 分析脊柱弯曲
    const shoulders = pose.keypoints.filter(kp => kp.name.includes('shoulder'));
    const hips = pose.keypoints.filter(kp => kp.name.includes('hip'));

    if (shoulders.length === 2 && hips.length === 2) {
      const shoulderMidpoint = {
        x: (shoulders[0].x + shoulders[1].x) / 2,
        y: (shoulders[0].y + shoulders[1].y) / 2,
      };
      const hipMidpoint = {
        x: (hips[0].x + hips[1].x) / 2,
        y: (hips[0].y + hips[1].y) / 2,
      };

      const spinalTilt = Math.abs(shoulderMidpoint.x - hipMidpoint.x);
      if (spinalTilt > 40) {
        posture = '脊柱弯曲';
        recommendations.push('保持脊柱挺直，避免久坐弯腰');
        stability *= 0.6;
      }
    }

    // 分析重心
    const ankles = pose.keypoints.filter(kp => kp.name.includes('ankle'));
    if (ankles.length === 2) {
      const centerOfMass = {
        x: (ankles[0].x + ankles[1].x) / 2,
        y: (ankles[0].y + ankles[1].y) / 2,
      };

      const balanceOffset = Math.abs(
        centerOfMass.x - (pose.box?.xMin || 0) - (pose.box?.width || 0) / 2,
      );
      if (balanceOffset > 50) {
        posture = '重心偏移';
        recommendations.push('注意保持重心平衡，双脚平稳着地');
        stability *= 0.8;
      }
    }

    // 添加通用建议
    if (symmetry < 0.8 || stability < 0.8) {
      recommendations.push(
        '建议进行定期的姿态矫正练习',
        '可以考虑寻求专业的物理治疗师帮助',
        '工作时注意定期休息和活动',
      );
    }

    return {
      posture,
      symmetry,
      stability,
      recommendations: [...new Set(recommendations)],
    };
  }

  // 绘制姿态关键点
  async drawPose(
    canvas: HTMLCanvasElement,
    pose: IPose,
    options: {
      pointColor?: string;
      lineColor?: string;
      pointSize?: number;
      lineWidth?: number;
    } = {},
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { pointColor = '#ff0000', lineColor = '#00ff00', pointSize = 5, lineWidth = 2 } = options;

    // 绘制关键点
    ctx.fillStyle = pointColor;
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.point.x, keypoint.point.y, pointSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // 绘制骨架连接线
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    // 定义需要连接的关键点对
    const connections = [
      ['left_eye', 'right_eye'],
      ['left_eye', 'left_ear'],
      ['right_eye', 'right_ear'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['right_shoulder', 'right_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'],
      ['right_knee', 'right_ankle'],
    ];

    connections.forEach(([from, to]) => {
      const fromPoint = pose.keypoints.find(kp => kp.name === from);
      const toPoint = pose.keypoints.find(kp => kp.name === to);

      if (fromPoint && toPoint && fromPoint.score > 0.3 && toPoint.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(fromPoint.point.x, fromPoint.point.y);
        ctx.lineTo(toPoint.point.x, toPoint.point.y);
        ctx.stroke();
      }
    });
  }

  // 获取姿态改进建议
  async getPoseImprovements(result: IPoseAnalysisResult) {
    const { analysis } = result;
    const improvements = [...analysis.recommendations];

    if (analysis.symmetry < 0.7) {
      improvements.push('建议进行对称性训练', '可以尝试瑜伽或普拉提来改善身体平衡');
    }

    if (analysis.stability < 0.7) {
      improvements.push('建议加强核心力量训练', '可以进行平衡训练来提高稳定性');
    }

    return improvements;
  }

  // 清理资源
  async dispose() {
    if (this.detector) {
      await this.detector.dispose();
      this.detector = null;
    }
  }
}

export const poseService = new PoseService();
