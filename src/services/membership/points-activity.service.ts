export class PointsActivityService {
  private readonly activityRepo: ActivityRepository;
  private readonly pointsService: PointsService;
  private readonly notificationService: NotificationService;
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('PointsActivity');
  }

  // 处理健康数据上传积分
  async processHealthDataPoints(userId: string, data: HealthDataUpload): Promise<PointsResult> {
    try {
      const pointsRules = {
        blood_pressure: 10,
        blood_sugar: 10,
        weight: 5,
        exercise: 20
      };

      // 验证数据有效性
      await this.validateHealthData(data);
      
      // 计算获得积分
      const earnedPoints = await this.calculateHealthDataPoints(data, pointsRules);
      
      // 记录积分活动
      const activity = await this.recordActivity({
        userId,
        type: 'health_data_upload',
        data,
        points: earnedPoints
      });

      return {
        success: true,
        points: earnedPoints,
        activity,
        newBalance: await this.pointsService.getPointsBalance(userId)
      };
    } catch (error) {
      this.logger.error('处理健康数据积分失败', error);
      throw error;
    }
  }

  // 处理健康习惯积分
  async processHealthyHabitPoints(userId: string, habit: HealthyHabit): Promise<PointsResult> {
    try {
      const habitPoints = {
        step_goals: 15,
        sleep_goals: 10,
        water_intake: 5
      };

      // 验证习惯完成情况
      await this.validateHabitCompletion(userId, habit);
      
      // 计算习惯积分
      const earnedPoints = habitPoints[habit.type] || 0;
      
      // 记录积分活动
      const activity = await this.recordActivity({
        userId,
        type: 'healthy_habit',
        data: habit,
        points: earnedPoints
      });

      // 检查连续完成奖励
      const streakBonus = await this.checkHabitStreak(userId, habit.type);

      return {
        success: true,
        points: earnedPoints + streakBonus,
        activity,
        streakBonus,
        newBalance: await this.pointsService.getPointsBalance(userId)
      };
    } catch (error) {
      this.logger.error('处理健康习惯积分失败', error);
      throw error;
    }
  }

  // 处理社交互动积分
  async processSocialInteractionPoints(userId: string, interaction: SocialInteraction): Promise<PointsResult> {
    try {
      const interactionPoints = {
        share_experience: 20,
        answer_questions: 30,
        write_article: 100
      };

      // 验证互动质量
      await this.validateInteractionQuality(interaction);
      
      // 计算基础积分
      let earnedPoints = interactionPoints[interaction.type] || 0;
      
      // 计算质量加成
      const qualityBonus = await this.calculateQualityBonus(interaction);
      earnedPoints += qualityBonus;

      // 记录积分活动
      const activity = await this.recordActivity({
        userId,
        type: 'social_interaction',
        data: interaction,
        points: earnedPoints
      });

      return {
        success: true,
        points: earnedPoints,
        activity,
        qualityBonus,
        newBalance: await this.pointsService.getPointsBalance(userId)
      };
    } catch (error) {
      this.logger.error('处理社交互动积分失败', error);
      throw error;
    }
  }

  // 处理成就奖励积分
  async processAchievementPoints(userId: string, achievement: Achievement): Promise<PointsResult> {
    try {
      const achievementPoints = {
        weekly_goals: 200,
        monthly_challenges: 500,
        health_improvements: 1000
      };

      // 验证成就完成
      await this.validateAchievementCompletion(userId, achievement);
      
      // 计算奖励积分
      const earnedPoints = achievementPoints[achievement.type] || 0;
      
      // 记录积分活动
      const activity = await this.recordActivity({
        userId,
        type: 'achievement_reward',
        data: achievement,
        points: earnedPoints
      });

      // 发送成就通知
      await this.notificationService.sendAchievementNotification(userId, {
        achievement,
        points: earnedPoints
      });

      return {
        success: true,
        points: earnedPoints,
        activity,
        achievement,
        newBalance: await this.pointsService.getPointsBalance(userId)
      };
    } catch (error) {
      this.logger.error('处理成就奖励积分失败', error);
      throw error;
    }
  }
} 