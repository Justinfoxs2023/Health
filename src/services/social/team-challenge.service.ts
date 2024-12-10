export class TeamChallengeService {
  private readonly teamRepo: TeamRepository;
  private readonly challengeRepo: ChallengeRepository;
  private readonly rewardService: RewardService;
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('TeamChallenge');
  }

  // 创建团队挑战
  async createTeamChallenge(data: CreateTeamChallengeDTO): Promise<TeamChallenge> {
    try {
      // 验证团队
      await this.validateTeams(data.teams);
      
      const challenge = await this.challengeRepo.create({
        ...data,
        status: 'recruiting',
        startTime: new Date(),
        endTime: addDays(new Date(), data.duration),
        teamScores: this.initializeTeamScores(data.teams),
        rewards: await this.setupTeamRewards(data.type, data.difficulty)
      });

      // 创建团队排行榜
      await this.createTeamLeaderboard(challenge.id);
      
      // 发送挑战通知
      await this.notifyTeamMembers(challenge);

      return challenge;
    } catch (error) {
      this.logger.error('创建团队挑战失败', error);
      throw error;
    }
  }

  // 更新团队进度
  async updateTeamProgress(challengeId: string, teamId: string, progress: TeamProgress): Promise<void> {
    try {
      // 更新团队分数
      await this.updateTeamScore(challengeId, teamId, progress);
      
      // 检查团队成就
      await this.checkTeamAchievements(challengeId, teamId);
      
      // 更新排行榜
      await this.updateTeamLeaderboard(challengeId);
      
      // 检查挑战完成状态
      await this.checkChallengeCompletion(challengeId);
    } catch (error) {
      this.logger.error('更新团队进度失败', error);
      throw error;
    }
  }

  // 分配团队奖励
  private async distributeTeamRewards(challengeId: string): Promise<void> {
    try {
      const challenge = await this.challengeRepo.findById(challengeId);
      const leaderboard = await this.getTeamLeaderboard(challengeId);

      // 分配团队奖励
      for (const team of leaderboard) {
        const rewards = this.calculateTeamRewards(team, challenge.rewards);
        await this.rewardService.distributeTeamRewards(team.id, rewards);
      }

      // 更新挑战状态
      await this.challengeRepo.update(challengeId, { status: 'completed' });
    } catch (error) {
      this.logger.error('分配团队奖励失败', error);
      throw error;
    }
  }
} 