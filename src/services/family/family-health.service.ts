import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/services/database/database.service';
import { NotificationService } from '@/services/notification/notification.service';
import { HealthAnalysisService } from '@/services/health/health-analysis.service';

@Injectable()
export class FamilyHealthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly notification: NotificationService,
    private readonly healthAnalysis: HealthAnalysisService
  ) {}

  // 添加家庭成员
  async addFamilyMember(
    userId: string,
    memberInfo: Partial<FamilyMember>
  ): Promise<void> {
    // 发送邀请
    const invitation = await this.createInvitation(userId, memberInfo);
    await this.notification.sendInvitation(memberInfo.userId, invitation);
    
    // 等待接受
    await this.handleInvitationResponse(invitation.id);
  }

  // 更新健康共享设置
  async updateSharingSettings(
    memberId: string,
    settings: Partial<FamilyMember['healthSharingConfig']>
  ): Promise<void> {
    await this.db.updateOne(
      'family_members',
      { id: memberId },
      { $set: { healthSharingConfig: settings } }
    );
    
    // 更新共享状态
    await this.refreshHealthSharing(memberId);
  }

  // 生成家庭健康报告
  async generateFamilyReport(familyId: string): Promise<FamilyHealthReport> {
    const members = await this.getFamilyMembers(familyId);
    const report = {
      familyId,
      timestamp: new Date(),
      members: [],
      familyMetrics: await this.analyzeFamilyHealth(members)
    };

    // 收集每个成员的健康数据
    for (const member of members) {
      if (member.permissions.viewHealth) {
        const memberHealth = await this.healthAnalysis.analyzeMemberHealth(member.userId);
        report.members.push(memberHealth);
      }
    }

    return report;
  }

  // 处理健康告警
  async handleHealthAlert(alert: FamilyHealthAlert): Promise<void> {
    // 确定告警接收者
    const recipients = await this.determineAlertRecipients(
      alert.familyId,
      alert.priority
    );

    // 发送通知
    for (const recipient of recipients) {
      await this.notification.sendHealthAlert(recipient, alert);
    }

    // 记录告警
    await this.logHealthAlert(alert);
  }

  // 搜索潜在家庭成员
  async searchPotentialMembers(
    query: string,
    excludeIds: string[]
  ): Promise<Array<{
    userId: string;
    nickname: string;
    avatar: string;
  }>> {
    return this.db.find(
      'users',
      {
        $or: [
          { nickname: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ],
        userId: { $nin: excludeIds }
      },
      { projection: { userId: 1, nickname: 1, avatar: 1 } }
    );
  }
} 