import { Achievement } from '../../entities/gamification/achievement.entity';
import { IUserGameProfile } from '../../types/gamification/base.types';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievementsService } from './user-achievements.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserAchievementsService', () => {
  let service: UserAchievementsService;
  let achievementRepo: Repository<Achievement>;
  let userProfileRepo: Repository<IUserGameProfile>;

  const mockAchievementRepo = {
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
        UserAchievementsService,
        {
          provide: getRepositoryToken(Achievement),
          useValue: mockAchievementRepo,
        },
        {
          provide: getRepositoryToken(UserGameProfile),
          useValue: mockUserProfileRepo,
        },
      ],
    }).compile();

    service = module.get<UserAchievementsService>(UserAchievementsService);
    achievementRepo = module.get<Repository<Achievement>>(getRepositoryToken(Achievement));
    userProfileRepo = module.get<Repository<IUserGameProfile>>(getRepositoryToken(UserGameProfile));
  });

  describe('checkAchievements', () => {
    it('应该检查并解锁新成就', async () => {
      const userId = '1';
      const activityData = {
        type: 'health_tracking',
        count: 100,
        duration: 30,
        streak: 7,
      };

      const mockAchievements = [
        {
          id: 'daily-tracker',
          name: '坚持打卡',
          type: 'tracking',
          requirements: {
            count: 100,
            streak: 7,
          },
          rewards: {
            exp: 500,
            features: ['advanced_tracking'],
          },
        },
      ];

      mockAchievementRepo.find.mockResolvedValue(mockAchievements);
      mockUserProfileRepo.findOne.mockResolvedValue({
        userId,
        achievements: [],
        experience: 1000,
      });

      const result = await service.checkAchievements(userId, activityData);

      expect(result.unlockedAchievements).toHaveLength(1);
      expect(result.expGained).toBe(500);
      expect(result.newFeatures).toContain('advanced_tracking');
    });
  });

  describe('getProgress', () => {
    it('应该获取成就进度', async () => {
      const userId = '1';
      const achievementId = 'daily-tracker';

      const mockProgress = {
        current: 80,
        required: 100,
        percentage: 80,
      };

      mockAchievementRepo.findOne.mockResolvedValue({
        id: achievementId,
        requirements: {
          count: 100,
        },
      });

      const result = await service.getProgress(userId, achievementId);

      expect(result.current).toBeDefined();
      expect(result.required).toBeDefined();
      expect(result.percentage).toBeDefined();
    });
  });
});
