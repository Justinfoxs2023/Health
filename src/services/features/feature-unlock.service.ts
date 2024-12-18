import {
  UserGameProfile,
  FeatureUnlock,
  ExpertContent,
  CustomProgram,
  ReviewTask,
} from '../../entities/gamification';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { Repository } from 'typeorm';

@Injec
table()
export class FeatureUnlockService {
  constructor(
    @InjectRepository()
    private readonly featureRepo: Repository<FeatureUnlock>,
    @InjectRepository()
    private readonly userProfileRepo: Repository<UserGameProfile>,
    @InjectRepository()
    private readonly expertContentRepo: Repository<ExpertContent>,
    @InjectRepository()
    private readonly customProgramRepo: Repository<CustomProgram>,
    @InjectRepository()
    private readonly reviewTaskRepo: Repository<ReviewTask>,
    private readonly notificationService: NotificationService,
  ) {}

  async checkFeatureAvailability(userId: string, featureId: string) {
    const user = await this.userProfileRepo.findOne({ where: { userId } });
    const feature = await this.featureRepo.findOne({ where: { featureId } });

    return {
      available:
        user.level >= feature.requirements.level &&
        feature.requirements.prerequisites.every(p => user.features.includes(p)),
      requirements: feature.requirements,
      missingPrerequisites: feature.requirements.prerequisites.filter(
        p => !user.features.includes(p),
      ),
    };
  }

  async unlockFeature(userId: string, featureId: string) {
    const user = await this.userProfileRepo.findOne({ where: { userId } });
    user.features.push(featureId);
    await this.userProfileRepo.save(user);

    return {
      success: true,
      unlockedFeature: featureId,
    };
  }

  // 专家内容创作系统
  async createExpertContent(expertId: string, contentType: string, content: any) {
    const expert = await this.userProfileRepo.findOne({
      where: { userId: expertId },
      relations: ['specializations'],
    });

    // 验证专家资质
    if (await this.validateExpertQualification(expert, contentType)) {
      const newContent = await this.expertContentRepo.save({
        expertId,
        type: contentType,
        content,
        verificationStatus: 'pending',
      });

      // 触发内容审核流程
      await this.triggerContentReview(newContent);

      return newContent;
    }
  }

  // ��定义方案系统
  async createCustomProgram(expertId: string, targetUser: string, programSpecs: any) {
    // 验证专家权限
    await this.validateExpertPermissions(expertId);

    const program = await this.customProgramRepo.save({
      expertId,
      targetUser,
      specs: programSpecs,
      status: 'draft',
    });

    // 生成进度追踪点
    await this.generateProgressCheckpoints(program);

    return program;
  }

  private async validateExpertQualification(
    expert: UserGameProfile,
    contentType: string,
  ): Promise<boolean> {
    if (expert.level < 15) return false;

    const requiredSpecs =
      {
        health_guide: ['nutrition', 'fitness'],
        training_program: ['fitness', 'rehabilitation'],
        diet_plan: ['nutrition', 'health_management'],
      }[contentType] || [];

    return requiredSpecs.every(spec =>
      expert.specializations.some(s => s.name === spec && s.level >= 5),
    );
  }

  private async triggerContentReview(content: any) {
    // 创建审核任务
    const reviewTask = await this.reviewTaskRepo.save({
      contentId: content.id,
      type: content.type,
      status: 'pending',
      assignedReviewers: await this.selectReviewers(content),
    });

    // 通知相关审核者
    await this.notificationService.notifyReviewers(reviewTask);
  }

  private async validateExpertPermissions(expertId: string): Promise<boolean> {
    const expert = await this.userProfileRepo.findOne({ where: { userId: expertId } });
    return expert?.level >= 15;
  }

  private async selectReviewers(content: ExpertContent) {
    // 实现审核者选择逻辑
    return [];
  }

  private async generateProgressCheckpoints(program: CustomProgram) {
    // 实现进度检查点生成逻辑
    return [];
  }
}
