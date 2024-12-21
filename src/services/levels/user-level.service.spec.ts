import { IUserGameProfile, ILevelProgress } from '../../types/gamification/base.types';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserLevelService } from './user-level.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserLevelService', () => {
  let service: UserLevelService;
  let userProfileRepo: Repository<IUserGameProfile>;
  let levelProgressRepo: Repository<ILevelProgress>;

  const mockUserProfileRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockLevelProgressRepo = {
    find: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLevelService,
        {
          provide: getRepositoryToken(UserGameProfile),
          useValue: mockUserProfileRepo,
        },
        {
          provide: getRepositoryToken(LevelProgress),
          useValue: mockLevelProgressRepo,
        },
      ],
    }).compile();

    service = module.get<UserLevelService>(UserLevelService);
    userProfileRepo = module.get<Repository<IUserGameProfile>>(getRepositoryToken(UserGameProfile));
    levelProgressRepo = module.get<Repository<ILevelProgress>>(getRepositoryToken(LevelProgress));
  });

  describe('gainExperience', () => {
    it('应该正确增加经验值并升级', async () => {
      const userId = '1';
      const expGained = 1000;

      const mockProfile = {
        userId,
        level: 5,
        experience: 4000,
        features: [],
      };

      mockUserProfileRepo.findOne.mockResolvedValue(mockProfile);

      const result = await service.gainExperience(userId, expGained);

      expect(result.newLevel).toBeGreaterThan(5);
      expect(result.totalExp).toBe(5000);
      expect(result.levelUp).toBe(true);
      expect(result.unlockedFeatures).toBeDefined();
    });
  });

  describe('calculateLevel', () => {
    it('应该正确计算用户等级', async () => {
      const experience = 10000;

      const result = service.calculateLevel(experience);

      expect(result.level).toBeGreaterThan(1);
      expect(result.nextLevelExp).toBeGreaterThan(experience);
      expect(result.progress).toBeGreaterThanOrEqual(0);
      expect(result.progress).toBeLessThanOrEqual(100);
    });
  });
});
