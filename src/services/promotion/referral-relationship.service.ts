/**
 * @fileoverview TS 文件 referral-relationship.service.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

@Injectable()
export class ReferralRelationshipService {
  constructor(
    private readonly userService: UserService,
    private readonly commissionService: CommissionService,
    private readonly notificationService: NotificationService,
  ) {}

  // 建立推荐关系
  async establishReferralRelationship(referralData: ReferralData): Promise<ReferralResult> {
    try {
      // 验证推荐关系
      const validationResult = await this.validateReferral({
        referrerId: referralData.referrerId,
        newUserId: referralData.newUserId,
        referralCode: referralData.referralCode,
      });

      // 确定推荐层级
      const referralLevel = await this.determineReferralLevel({
        referrerId: referralData.referrerId,
        uplineChain: await this.getUplineChain(referralData.referrerId),
      });

      // 建立永久绑定关系
      const relationship = await this.createPermanentBinding({
        newUser: referralData.newUserId,
        referrer: referralData.referrerId,
        level: referralLevel,
        uplineChain: validationResult.uplineChain,
      });

      // 更新推荐统计
      await this.updateReferralStats(relationship);

      return {
        success: true,
        relationshipId: relationship.id,
        level: referralLevel,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('建立推荐关系失败', error);
      throw error;
    }
  }

  // 获取推荐关系链
  async getReferralChain(userId: string): Promise<ReferralChain> {
    try {
      const chain = await this.prisma.referralChain.findUnique({
        where: { userId },
        include: {
          uplineReferrers: true,
          directReferrer: true,
        },
      });

      return {
        userId,
        directReferrer: chain.directReferrer,
        level1Referrer: chain.uplineReferrers[0],
        level2Referrer: chain.uplineReferrers[1],
        referralLevel: chain.level,
      };
    } catch (error) {
      this.logger.error('获取推荐链失败', error);
      throw error;
    }
  }
}
