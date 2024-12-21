import { InteractiveChallengeService } from './interactive-challenge.service';
import { Repository } from 'typeorm';
import { SocialNetwork } from '../../entities/social/social-network.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserProfile } from '../../entities/user/user-profile.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('InteractiveChallengeService', () => {
  let service: InteractiveChallengeService;
  let socialNetworkRepo: Repository<SocialNetwork>;
  let userProfileRepo: Repository<UserProfile>;

  const mockSocialNetworkRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUserProfileRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractiveChallengeService,
        {
          provide: getRepositoryToken(SocialNetwork),
          useValue: mockSocialNetworkRepo,
        },
        {
          provide: getRepositoryToken(UserProfile),
          useValue: mockUserProfileRepo,
        },
      ],
    }).compile();

    service = module.get<InteractiveChallengeService>(InteractiveChallengeService);
    socialNetworkRepo = module.get<Repository<SocialNetwork>>(getRepositoryToken(SocialNetwork));
    userProfileRepo = module.get<Repository<UserProfile>>(getRepositoryToken(UserProfile));
  });

  describe('manageSocialChallenges', () => {
    it('应该成功管理社交挑战', async () => {
      const userId = '1';
      const mockSocialNetwork = {
        userId,
        connections: [],
        activities: [],
        challenges: [],
      };

      mockSocialNetworkRepo.findOne.mockResolvedValue(mockSocialNetwork);

      const result = await service.manageSocialChallenges(userId);

      expect(result.socialTasks).toBeDefined();
      expect(result.interactionGoals).toBeDefined();
      expect(result.socialActivities).toBeDefined();
      expect(result.networkGrowth).toBeDefined();
      expect(result.communityImpact).toBeDefined();
    });
  });

  describe('manageAchievementConditions', () => {
    it('应该成功管理成就解锁条件', async () => {
      const userId = '1';
      const mockProfile = {
        userId,
        level: 5,
        achievements: [],
        preferences: {},
      };

      mockUserProfileRepo.findOne.mockResolvedValue(mockProfile);

      const result = await service.manageAchievementConditions(userId);

      expect(result.unlockConditions).toBeDefined();
      expect(result.progressionPath).toBeDefined();
      expect(result.difficultyLevels).toBeDefined();
      expect(result.milestones).toBeDefined();
      expect(result.adaptiveRequirements).toBeDefined();
    });

    it('应该处理用户配置文件不存在的情况', async () => {
      const userId = '1';
      mockUserProfileRepo.findOne.mockResolvedValue(null);

      await expect(service.manageAchievementConditions(userId)).rejects.toThrow(
        '用户配置文件不存在',
      );
    });
  });

  describe('createSocialTasks', () => {
    it('应该基于社交网络创建任务', async () => {
      const mockNetwork = {
        connections: [{ id: '1' }, { id: '2' }],
        activities: [],
      };

      const tasks = await service.createSocialTasks(mockNetwork);

      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeGreaterThan(0);
      tasks.forEach(task => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('type');
        expect(task).toHaveProperty('description');
        expect(task).toHaveProperty('requirements');
      });
    });
  });
});
