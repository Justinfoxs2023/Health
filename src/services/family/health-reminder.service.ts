import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { 
  FamilyMember, 
  MedicationPlan 
} from '../../types/family-health';

@Injectable()
export class HealthReminderService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly familyService: FamilyService,
    private readonly scheduleService: ScheduleService
  ) {}

  // 检查并发送用药提醒
  @Cron(CronExpression.EVERY_MINUTE)
  async checkMedicationReminders() {
    const now = new Date();
    const families = await this.familyService.getAllFamilies();
    
    for (const family of families) {
      for (const member of family.members) {
        await this.checkMemberMedications(member, now);
      }
    }
  }

  private async checkMemberMedications(
    member: FamilyMember,
    now: Date
  ) {
    const medications = member.healthInfo.medications || [];
    
    for (const med of medications) {
      if (this.shouldSendMedicationReminder(med, now)) {
        await this.sendMedicationReminder(member, med);
      }
    }
  }

  private shouldSendMedicationReminder(
    medication: MedicationPlan,
    now: Date
  ): boolean {
    if (!medication.reminders) return false;
    
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;
    return medication.timing.times.includes(currentTime);
  }

  // 发送健康检查提醒
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendHealthCheckReminders() {
    const families = await this.familyService.getAllFamilies();
    
    for (const family of families) {
      for (const member of family.members) {
        await this.checkHealthSchedule(member);
      }
    }
  }

  // 季节性健康提醒
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendSeasonalHealthTips() {
    const season = this.getCurrentSeason();
    const tips = await this.getSeasonalHealthTips(season);
    
    const families = await this.familyService.getAllFamilies();
    
    for (const family of families) {
      await this.sendSeasonalReminders(family, tips);
    }
  }

  // 中医养生提醒
  async sendTCMHealthReminders(member: FamilyMember) {
    if (!member.tcmConstitution) return;
    
    const constitution = member.tcmConstitution;
    const season = this.getCurrentSeason();
    
    const suggestions = await this.getTCMSuggestions(
      constitution.type,
      season
    );
    
    await this.notificationService.sendTCMReminder(
      member,
      suggestions
    );
  }

  // 生成每周健康报告
  @Cron(CronExpression.EVERY_WEEK)
  async generateWeeklyHealthReport() {
    const families = await this.familyService.getAllFamilies();
    
    for (const family of families) {
      const report = await this.createFamilyHealthReport(family);
      await this.notificationService.sendWeeklyReport(
        family,
        report
      );
    }
  }

  private async createFamilyHealthReport(family: any) {
    const report = {
      period: this.getReportPeriod(),
      members: await Promise.all(
        family.members.map(async (member: FamilyMember) => ({
          name: member.name,
          medicationAdherence: await this.calculateMedicationAdherence(member),
          healthMetrics: await this.getHealthMetrics(member),
          recommendations: await this.generateRecommendations(member)
        }))
      ),
      familyActivities: await this.getFamilyHealthActivities(family),
      nextSteps: await this.suggestNextSteps(family)
    };
    
    return report;
  }
} 