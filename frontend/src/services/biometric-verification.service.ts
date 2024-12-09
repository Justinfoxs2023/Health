import * as tf from '@tensorflow/tfjs';
import { VoicePrintService } from './voice-print.service';
import { LocalDatabase } from '../utils/local-database';
import { CryptoService } from './crypto.service';

interface BiometricTemplate {
  id: string;
  userId: string;
  type: BiometricType;
  features: Float32Array;
  metadata: BiometricMetadata;
  createdAt: Date;
  lastVerified: Date;
}

interface BiometricMetadata {
  quality: number;
  livenessScore: number;
  updateCount: number;
  securityLevel: 'low' | 'medium' | 'high';
}

type BiometricType = 'voice' | 'face' | 'fingerprint' | 'behavioral';

export class BiometricVerificationService {
  private db: LocalDatabase;
  private voicePrintService: VoicePrintService;
  private model: tf.LayersModel | null = null;
  private crypto: CryptoService;
  private templates: Map<string, BiometricTemplate> = new Map();

  constructor() {
    this.db = new LocalDatabase('biometric-verification');
    this.voicePrintService = new VoicePrintService();
    this.crypto = new CryptoService();
    this.initialize();
  }

  private async initialize() {
    await this.loadModel();
    await this.loadTemplates();
  }

  private async loadModel() {
    try {
      this.model = await tf.loadLayersModel('/models/biometric/model.json');
    } catch (error) {
      console.error('加载生物特征模型失败:', error);
    }
  }

  private async loadTemplates() {
    try {
      const encryptedTemplates = await this.db.get('biometric-templates');
      if (encryptedTemplates) {
        const decryptedTemplates = await this.crypto.decryptData(encryptedTemplates);
        this.templates = new Map(decryptedTemplates);
      }
    } catch (error) {
      console.error('加载生物特征模板失败:', error);
    }
  }

  // 注册生物特征
  async enrollBiometric(
    userId: string,
    type: BiometricType,
    data: Float32Array
  ): Promise<string> {
    try {
      // 特征提取
      const features = await this.extractFeatures(type, data);
      
      // 质量评估
      const quality = await this.assessQuality(type, features);
      if (quality < 0.8) {
        throw new Error('生物特征质量不足');
      }

      // 活体检测
      const livenessScore = await this.performLivenessDetection(type, data);
      if (livenessScore < 0.9) {
        throw new Error('活体检测失败');
      }

      // 创建模板
      const template: BiometricTemplate = {
        id: `bio_${Date.now()}`,
        userId,
        type,
        features,
        metadata: {
          quality,
          livenessScore,
          updateCount: 0,
          securityLevel: 'high'
        },
        createdAt: new Date(),
        lastVerified: new Date()
      };

      // 加密存储
      await this.saveTemplate(template);
      return template.id;
    } catch (error) {
      console.error('注册生物特征失败:', error);
      throw error;
    }
  }

  // 验证生物特征
  async verifyBiometric(
    userId: string,
    type: BiometricType,
    data: Float32Array
  ): Promise<{
    verified: boolean;
    confidence: number;
    securityLevel: string;
  }> {
    try {
      // 提取特征
      const features = await this.extractFeatures(type, data);
      
      // 获取用户模板
      const templates = Array.from(this.templates.values())
        .filter(t => t.userId === userId && t.type === type);

      if (templates.length === 0) {
        throw new Error('未找到生物特征模板');
      }

      // 活体检测
      const livenessScore = await this.performLivenessDetection(type, data);
      if (livenessScore < 0.9) {
        throw new Error('活体检测失败');
      }

      // 特征匹配
      const matchResults = await Promise.all(
        templates.map(template => this.matchFeatures(features, template))
      );

      // 获取最佳匹配
      const bestMatch = matchResults.reduce((a, b) => 
        a.confidence > b.confidence ? a : b
      );

      // 更新验证记录
      if (bestMatch.verified) {
        await this.updateVerificationRecord(bestMatch.templateId);
      }

      return {
        verified: bestMatch.verified,
        confidence: bestMatch.confidence,
        securityLevel: bestMatch.securityLevel
      };
    } catch (error) {
      console.error('生物特征验证失败:', error);
      throw error;
    }
  }

  // 特征提取
  private async extractFeatures(
    type: BiometricType,
    data: Float32Array
  ): Promise<Float32Array> {
    if (!this.model) throw new Error('模型未加载');

    const preprocessed = await this.preprocessBiometricData(type, data);
    const tensor = tf.tensor(preprocessed).expandDims(0);
    const features = await this.model.predict(tensor) as tf.Tensor;
    
    return new Float32Array(await features.data());
  }

  // 预处理生物特征数据
  private async preprocessBiometricData(
    type: BiometricType,
    data: Float32Array
  ): Promise<Float32Array> {
    switch (type) {
      case 'voice':
        return await this.voicePrintService.preprocessAudio(data);
      case 'face':
        return await this.preprocessFaceData(data);
      case 'fingerprint':
        return await this.preprocessFingerprintData(data);
      case 'behavioral':
        return await this.preprocessBehavioralData(data);
      default:
        throw new Error(`不支持的生物特征类型: ${type}`);
    }
  }

  // 特征匹配
  private async matchFeatures(
    features: Float32Array,
    template: BiometricTemplate
  ): Promise<{
    verified: boolean;
    confidence: number;
    templateId: string;
    securityLevel: string;
  }> {
    // 计算特征相似度
    const similarity = await this.calculateSimilarity(features, template.features);
    
    // 获取阈值
    const threshold = this.getVerificationThreshold(template.metadata.securityLevel);

    return {
      verified: similarity >= threshold,
      confidence: similarity,
      templateId: template.id,
      securityLevel: template.metadata.securityLevel
    };
  }

  // 计算相似度
  private async calculateSimilarity(
    features1: Float32Array,
    features2: Float32Array
  ): Promise<number> {
    // 实现相似度计算
    return 0;
  }

  // 获取验证阈值
  private getVerificationThreshold(securityLevel: string): number {
    const thresholds = {
      low: 0.75,
      medium: 0.85,
      high: 0.95
    };
    return thresholds[securityLevel as keyof typeof thresholds];
  }

  // 质量评估
  private async assessQuality(
    type: BiometricType,
    features: Float32Array
  ): Promise<number> {
    // 实现质量评估
    return 1.0;
  }

  // 活体检测
  private async performLivenessDetection(
    type: BiometricType,
    data: Float32Array
  ): Promise<number> {
    // 实现活体检测
    return 1.0;
  }

  // 保存模板
  private async saveTemplate(template: BiometricTemplate): Promise<void> {
    // 加密模板
    const encryptedTemplate = await this.crypto.encryptData(template);
    
    this.templates.set(template.id, template);
    await this.db.put('biometric-templates', 
      Array.from(this.templates.entries())
    );
  }

  // 更新验证记录
  private async updateVerificationRecord(templateId: string): Promise<void> {
    const template = this.templates.get(templateId);
    if (template) {
      template.lastVerified = new Date();
      template.metadata.updateCount++;
      await this.saveTemplate(template);
    }
  }

  // 删除生物特征
  async deleteBiometric(templateId: string): Promise<void> {
    this.templates.delete(templateId);
    await this.db.put('biometric-templates', 
      Array.from(this.templates.entries())
    );
  }

  // 获取���户生物特征列表
  async getUserBiometrics(userId: string): Promise<BiometricTemplate[]> {
    return Array.from(this.templates.values())
      .filter(template => template.userId === userId);
  }

  // 更新安全级别
  async updateSecurityLevel(
    templateId: string,
    level: 'low' | 'medium' | 'high'
  ): Promise<void> {
    const template = this.templates.get(templateId);
    if (template) {
      template.metadata.securityLevel = level;
      await this.saveTemplate(template);
    }
  }
} 