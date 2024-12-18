import * as tf from '@tensorflow/tfjs';
import { ILocalDatabase } from '../utils/local-database';

interface IVoicePrint {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** features 的描述 */
  features: Float32Array;
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
  /** metadata 的描述 */
  metadata: {
    quality: number;
    confidence: number;
    environment: string;
  };
}

export class VoicePrintService {
  private db: ILocalDatabase;
  private model: tf.LayersModel | null = null;
  private voicePrints: Map<string, IVoicePrint> = new Map();
  private audioContext: AudioContext;
  private analyzer: AnalyserNode;

  constructor() {
    this.db = new LocalDatabase('voice-print');
    this.audioContext = new AudioContext();
    this.analyzer = this.audioContext.createAnalyser();
    this.initialize();
  }

  private async initialize() {
    await this.loadModel();
    await this.loadVoicePrints();
  }

  // 加载声纹识别模型
  private async loadModel() {
    try {
      this.model = await tf.loadLayersModel('/models/voice-print/model.json');
    } catch (error) {
      console.error('Error in voice-print.service.ts:', '加载声纹识别模型失败:', error);
    }
  }

  // 加载声纹数据
  private async loadVoicePrints() {
    try {
      const storedPrints = await this.db.get('voice-prints');
      if (storedPrints) {
        this.voicePrints = new Map(storedPrints);
      }
    } catch (error) {
      console.error('Error in voice-print.service.ts:', '加载声纹数据失败:', error);
    }
  }

  // 注册声纹
  async registerVoicePrint(userId: string, audioData: Float32Array): Promise<string> {
    try {
      // 提取声纹特征
      const features = await this.extractFeatures(audioData);

      // 质量评估
      const quality = await this.assessQuality(features);
      if (quality < 0.8) {
        throw new Error('声纹质量不足，请重新录制');
      }

      // 创建声纹记录
      const voicePrint: IVoicePrint = {
        id: `vp_${Date.now()}`,
        userId,
        features,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          quality,
          confidence: 1.0,
          environment: await this.detectEnvironment(),
        },
      };

      // 保存声纹
      await this.saveVoicePrint(voicePrint);
      return voicePrint.id;
    } catch (error) {
      console.error('Error in voice-print.service.ts:', '注册声纹失败:', error);
      throw error;
    }
  }

  // 声纹验证
  async verifyVoicePrint(
    userId: string,
    audioData: Float32Array,
  ): Promise<{
    matched: boolean;
    confidence: number;
    matchedPrintId?: string;
  }> {
    try {
      const features = await this.extractFeatures(audioData);
      const userPrints = Array.from(this.voicePrints.values()).filter(
        print => print.userId === userId,
      );

      if (userPrints.length === 0) {
        throw new Error('未找到用户声纹记录');
      }

      // 计算相似度并找到最佳匹配
      const similarities = await Promise.all(
        userPrints.map(print => this.calculateSimilarity(features, print.features)),
      );

      const maxSimilarity = Math.max(...similarities);
      const matchIndex = similarities.indexOf(maxSimilarity);
      const threshold = 0.85;

      return {
        matched: maxSimilarity >= threshold,
        confidence: maxSimilarity,
        matchedPrintId: maxSimilarity >= threshold ? userPrints[matchIndex].id : undefined,
      };
    } catch (error) {
      console.error('Error in voice-print.service.ts:', '声纹验证失败:', error);
      throw error;
    }
  }

  // 更新声纹
  async updateVoicePrint(printId: string, audioData: Float32Array): Promise<void> {
    const existingPrint = this.voicePrints.get(printId);
    if (!existingPrint) {
      throw new Error('未找到声纹记录');
    }

    const features = await this.extractFeatures(audioData);
    const quality = await this.assessQuality(features);

    // 只有当新样本质量更好时才更新
    if (quality > existingPrint.metadata.quality) {
      const updatedPrint: IVoicePrint = {
        ...existingPrint,
        features,
        updatedAt: new Date(),
        metadata: {
          ...existingPrint.metadata,
          quality,
        },
      };

      await this.saveVoicePrint(updatedPrint);
    }
  }

  // 提取声纹特征
  private async extractFeatures(audioData: Float32Array): Promise<Float32Array> {
    if (!this.model) throw new Error('模型未加载');

    // 预处理音频
    const processedData = await this.preprocessAudio(audioData);

    // 使用模型提取特征
    const tensor = tf.tensor(processedData).expandDims(0);
    const features = (await this.model.predict(tensor)) as tf.Tensor;

    return new Float32Array(await features.data());
  }

  // 音频预处理
  private async preprocessAudio(audioData: Float32Array): Promise<Float32Array> {
    // 应用预加重滤波
    const preemphasized = this.applyPreemphasis(audioData);

    // 分帧和加窗
    const frames = this.frameSignal(preemphasized);

    // 提取声学特征
    return this.extractAcousticFeatures(frames);
  }

  // 预加重滤波
  private applyPreemphasis(signal: Float32Array, coefficient = 0.97): Float32Array {
    const result = new Float32Array(signal.length);
    result[0] = signal[0];
    for (let i = 1; i < signal.length; i++) {
      result[i] = signal[i] - coefficient * signal[i - 1];
    }
    return result;
  }

  // 分帧
  private frameSignal(signal: Float32Array): Float32Array[] {
    const frameLength = 512;
    const frameStep = 256;
    const frames: Float32Array[] = [];

    for (let i = 0; i < signal.length - frameLength; i += frameStep) {
      const frame = signal.slice(i, i + frameLength);
      frames.push(this.applyWindow(frame));
    }

    return frames;
  }

  // 加窗
  private applyWindow(frame: Float32Array): Float32Array {
    const result = new Float32Array(frame.length);
    for (let i = 0; i < frame.length; i++) {
      // Hamming窗
      const window = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (frame.length - 1));
      result[i] = frame[i] * window;
    }
    return result;
  }

  // 提取声学特征
  private extractAcousticFeatures(frames: Float32Array[]): Float32Array {
    // 实现MFCC特征提取
    return new Float32Array();
  }

  // 计算相似度
  private async calculateSimilarity(
    features1: Float32Array,
    features2: Float32Array,
  ): Promise<number> {
    // 计算余弦相似度
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < features1.length; i++) {
      dotProduct += features1[i] * features2[i];
      norm1 += features1[i] * features1[i];
      norm2 += features2[i] * features2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // 质量评估
  private async assessQuality(features: Float32Array): Promise<number> {
    // 实现质量评估逻辑
    return 1.0;
  }

  // 检测环境
  private async detectEnvironment(): Promise<string> {
    // 实现环境检测逻辑
    return 'quiet';
  }

  // 保存声纹
  private async saveVoicePrint(voicePrint: IVoicePrint): Promise<void> {
    this.voicePrints.set(voicePrint.id, voicePrint);
    await this.db.put('voice-prints', Array.from(this.voicePrints.entries()));
  }

  // 获取用户声纹列表
  async getUserVoicePrints(userId: string): Promise<IVoicePrint[]> {
    return Array.from(this.voicePrints.values()).filter(print => print.userId === userId);
  }

  // 删除声纹
  async deleteVoicePrint(printId: string): Promise<void> {
    this.voicePrints.delete(printId);
    await this.db.put('voice-prints', Array.from(this.voicePrints.entries()));
  }
}
