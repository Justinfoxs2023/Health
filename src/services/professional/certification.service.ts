import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { ICertificationData } from './interfaces';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { ThirdPartyIntegrationManager } from '../integration/ThirdPartyIntegrationManager';

@Injectable()
export class CertificationService {
  private readonly certificationRules: Record<string, {
    requiredCertificates: string[];
    requiredYears: number;
    verificationSteps: string[];
  }>;

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
    private readonly integrationManager: ThirdPartyIntegrationManager
  ) {
    this.certificationRules = {
      doctor: {
        requiredCertificates: ['医师执业证书', '医师资格证书'],
        requiredYears: 3,
        verificationSteps: ['资料审核', '证书验证', '执业记录核查', '专业评估']
      },
      specialist: {
        requiredCertificates: ['医师执业证书', '医师资格证书', '专科医师证书'],
        requiredYears: 5,
        verificationSteps: ['资料审核', '证书验证', '执业记录核查', '专业评估', '专家评审']
      },
      therapist: {
        requiredCertificates: ['治疗师资格证书'],
        requiredYears: 2,
        verificationSteps: ['资料审核', '证书验证', '执业记录核查']
      }
    };
  }

  async submitCertification(data: ICertificationData): Promise<any> {
    try {
      // 验证认证数据
      this.validateCertificationData(certificationData);

      // 检查是否已提交认证
      const existingCertification = await this.databaseService.findOne('certifications', { userId });
      if (existingCertification && ['pending', 'approved'].includes(existingCertification.status)) {
        throw new Error('已存在认证申请或已认证通过');
      }

      // 上传证件图片
      const certificateUrls = await this.uploadCertificates(certificationData.certificates);

      // 创建认证记录
      const certification = await this.databaseService.create('certifications', {
        userId,
        ...certificationData,
        certificates: certificateUrls,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // 开始自动验证流程
      await this.startAutomaticVerification(certification);

      // 发送认证提交事件
      await this.eventBus.emit('certification.submitted', { certification });

      return certification;
    } catch (error) {
      this.logger.error('提交认证申请失败', error);
      throw error;
    }
  }

  private validateCertificationData(data: ICertificationData): void {
    const rules = this.certificationRules[data.profession];
    if (!rules) {
      throw new Error('不支持的职业类型');
    }

    // 检查必要证书
    const certificateTypes = data.certificates.map(cert => cert.type);
    for (const required of rules.requiredCertificates) {
      if (!certificateTypes.includes(required)) {
        throw new Error(`缺少必要证书: ${required}`);
      }
    }

    // 检查执业年限
    const oldestCert = data.certificates.reduce((oldest, cert) =>
      cert.issueDate < oldest ? cert.issueDate : oldest,
      new Date()
    );
    const years = (new Date().getTime() - oldestCert.getTime()) / (365 * 24 * 60 * 60 * 1000);
    if (years < rules.requiredYears) {
      throw new Error(`执业年限不足${rules.requiredYears}年`);
    }
  }

  private async startAutomaticVerification(certification: ICertificationData): Promise<void> {
    try {
      // 1. 证书真实性验证
      await this.verifyCertificates(certification);

      // 2. 执业记录核查
      await this.verifyPracticeHistory(certification);

      // 3. 信用记录核查
      await this.verifyCreditHistory(certification);

      // 更新验证进度
      await this.updateVerificationProgress(certification._id, 'automatic_verification_completed');
    } catch (error) {
      this.logger.error('自动��证失败', error);
      await this.updateVerificationProgress(certification._id, 'automatic_verification_failed', error.message);
    }
  }

  private async verifyCertificates(certification: ICertificationData): Promise<void> {
    for (const cert of certification.certificates) {
      // 调用第三方验证服务
      const verificationResult = await this.integrationManager.invoke('certificate_verification', 'verify', {
        type: cert.type,
        number: cert.number,
        name: certification.name,
        idNumber: certification.idNumber
      });

      if (!verificationResult.valid) {
        throw new Error(`证书验证失败: ${cert.type}`);
      }
    }
  }

  private async verifyPracticeHistory(certification: ICertificationData): Promise<void> {
    // 调用执业记录查询服务
    const practiceHistory = await this.integrationManager.invoke('practice_verification', 'query', {
      name: certification.name,
      idNumber: certification.idNumber,
      profession: certification.profession
    });

    if (practiceHistory.hasViolation) {
      throw new Error('存在执业违规记录');
    }
  }

  private async verifyCreditHistory(certification: ICertificationData): Promise<void> {
    // 调用信用记录查询服务
    const creditHistory = await this.integrationManager.invoke('credit_verification', 'query', {
      name: certification.name,
      idNumber: certification.idNumber
    });

    if (creditHistory.score < 600) {
      throw new Error('信用记录不符合要求');
    }
  }

  async reviewCertification(certificationId: string, reviewerId: string, data: {
    status: 'approved' | 'rejected';
    comments: string;
    level?: string;
  }): Promise<void> {
    try {
      // 更新认证状态
      const updatedCertification = await this.databaseService.update(
        'certifications',
        { _id: certificationId },
        {
          status: reviewResult.status,
          reviewReason: reviewResult.reason,
          reviewedAt: new Date(),
          level: data.level,
          $push: {
            reviewComments: {
              reviewer: reviewerId,
              content: data.comments,
              timestamp: new Date()
            }
          },
          updatedAt: new Date()
        }
      );

      // 如果认证通过，更新用户专家状态
      if (reviewResult.status === 'approved') {
        await this.updateUserExpertStatus(certification.userId, certification.expertType);
      }

      // 发送认证审核事件
      await this.eventBus.emit('certification.reviewed', {
        certification,
        reviewer: reviewerId,
        status: data.status
      });
    } catch (error) {
      this.logger.error('审核认证申请失败', error);
      throw error;
    }
  }

  private async createExpertProfile(certification: ICertificationData): Promise<void> {
    await this.databaseService.update(
      'experts',
      { userId: certification.expertId },
      {
        name: certification.name,
        profession: certification.profession,
        title: certification.title,
        hospital: certification.hospital,
        department: certification.department,
        certificationId: certification._id,
        level: certification.level,
        status: 'active',
        updatedAt: new Date()
      },
      { upsert: true }
    );
  }

  private async updateVerificationProgress(
    certificationId: string,
    stage: string,
    error?: string
  ): Promise<void> {
    await this.databaseService.update(
      'certifications',
      { _id: certificationId },
      {
        $push: {
          verificationProgress: {
            stage,
            status: error ? 'failed' : 'completed',
            error,
            timestamp: new Date()
          }
        },
        updatedAt: new Date()
      }
    );
  }

  async getUserCertification(userId: string): Promise<any> {
    try {
      return await this.databaseService.findOne('certifications', { userId });
    } catch (error) {
      this.logger.error('获取用户认证记录失败', error);
      throw error;
    }
  }

  async updateCertificates(expertId: string, certificates: Array<{
    type: string;
    number: string;
    issueDate: Date;
    validUntil: Date;
    image: string;
  }>): Promise<void> {
    try {
      // 验证新证书
      for (const cert of certificates) {
        await this.verifyCertificates({
          expertId,
          certificates: [cert]
        } as ICertificationData);
      }

      // 更新证书信息
      await this.databaseService.update(
        'certifications',
        { expertId },
        {
          certificates,
          updatedAt: new Date()
        }
      );

      const skip = (page - 1) * limit;
      const [total, certifications] = await Promise.all([
        this.databaseService.count('certifications', conditions),
        this.databaseService.find('certifications', conditions, { skip, limit })
      ]);

      return { total, certifications };
    } catch (error) {
      this.logger.error('更新证书失败', error);
      throw error;
    }
  }

  async evaluateExpertLevel(expertId: string): Promise<string> {
    try {
      // 获取专家信息
      const expert = await this.databaseService.findOne('experts', { userId: expertId });
      if (!expert) {
        throw new Error('专家不存在');
      }

    if (!Array.isArray(data.certificates) || data.certificates.length === 0) {
      throw new Error('请上传证件照片');
    }

    // 验证专家类型
    const validExpertTypes = this.configService.get('certification.expertTypes');
    if (!validExpertTypes.includes(data.expertType)) {
      throw new Error('无效的专家类型');
    }
  }

  private async uploadCertificates(certificates: any[]): Promise<string[]> {
    try {
      const uploadPromises = certificates.map(certificate =>
        this.storageService.uploadFile('certificates', certificate)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      this.logger.error('上传证件照片失败', error);
      throw error;
    }
  }

  private async updateUserExpertStatus(userId: string, expertType: string): Promise<void> {
    try {
      await this.databaseService.update(
        'users',
        { _id: userId },
        {
          isExpert: true,
          expertType,
          updatedAt: new Date()
        }
      );
    } catch (error) {
      this.logger.error('更新用户专家状态失败', error);
      throw error;
    }
  }

  private calculateExpertScore(expert: any, ratings: any[], consultations: any[]): number {
    // 基础分数 (根据资质)
    let score = 60;

    // 执业年限加分
    const yearsOfPractice = this.calculateYearsOfPractice(expert);
    score += Math.min(yearsOfPractice * 2, 20); // 最多20分

    // 评价分数
    if (ratings.length > 0) {
      const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      score += avgRating * 10; // 最多50分
    }

    // 问诊量加分
    const consultationCount = consultations.length;
    score += Math.min(consultationCount * 0.1, 20); // 最多20分

    return Math.min(score, 100); // 总分不超过100
  }

  private calculateYearsOfPractice(expert: any): number {
    const oldestCert = expert.certificates.reduce((oldest, cert) =>
      cert.issueDate < oldest ? cert.issueDate : oldest,
      new Date()
    );
    return (new Date().getTime() - oldestCert.getTime()) / (365 * 24 * 60 * 60 * 1000);
  }

  private determineExpertLevel(score: number): string {
    if (score >= 90) return 'platinum';
    if (score >= 80) return 'gold';
    if (score >= 70) return 'silver';
    return 'bronze';
  }
}
}
