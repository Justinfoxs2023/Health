@Injectable()
export class SocialMotivationService {
  constructor(
    private readonly social: SocialNetworkService,
    private readonly gamification: GamificationService
  ) {}

  // 健康挑战
  async createHealthChallenge(challenge: ChallengeConfig): Promise<Challenge> {
    const participants = await this.social.inviteParticipants(challenge.invitees);
    const rules = await this.gamification.generateChallengeRules(challenge.type);
    
    return {
      id: uuid(),
      participants,
      rules,
      startDate: challenge.startDate,
      duration: challenge.duration,
      rewards: await this.gamification.defineRewards(challenge.type)
    };
  }

  // 成就系统
  async updateAchievements(userId: string, activity: Activity): Promise<Achievement[]> {
    const progress = await this.gamification.trackProgress(userId, activity);
    const newAchievements = await this.gamification.checkAchievements(progress);
    
    if (newAchievements.length > 0) {
      await this.social.shareAchievements(userId, newAchievements);
    }
    
    return newAchievements;
  }
} 