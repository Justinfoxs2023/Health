import { Achievement } from '../entities/achievement.entity';
import { GamificationService } from './gamification.service';
import { IUserGameProfile } from '../types/gamification/base.types';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GamificationService', () => {
  let service: GamificationService;
  let repository: Repository<Achievement>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamificationService,
        {
          provide: getRepositoryToken(Achievement),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GamificationService>(GamificationService);
    repository = module.get<Repository<Achievement>>(getRepositoryToken(Achievement));
  });

  describe('updateProgress', () => {
    it('update user progress and unlock achievements', async () => {
      const userId = '1';
      const mockProfile: IUserGameProfile = {
        userId,
        role: 'user',
        level: 5,
        experience: 1000,
        achievements: [],
        features: [],
        activeTime: 3600,
      };

      const activityData = {
        type: 'exercise',
        duration: 30,
        intensity: 'high',
      };

      mockRepository.find.mockResolvedValue([
        {
          id: '1',
          name: '运动达人',
          type: 'exercise',
          condition: {
            type: 'duration',
            value: 30,
          },
        },
      ]);

      const result = await service.updateProgress(userId, mockProfile, activityData);

      expect(result.experienceGained).toBeGreaterThan(0);
      expect(result.unlockedAchievements).toHaveLength(1);
      expect(result.levelUp).toBeDefined();
    });
  });

  describe('calculateRewards', () => {
    it('calculate rewards based on activity', async () => {
      const activityData = {
        type: 'health_check',
        completionRate: 1,
        difficulty: 'medium',
      };

      const result = await service.calculateRewards(activityData);

      expect(result.experience).toBeGreaterThan(0);
      expect(result.bonusPoints).toBeDefined();
      expect(result.specialRewards).toBeDefined();
    });
  });

  describe('checkMasteryProgress', () => {
    it('check and update mastery progress', async () => {
      const userId = '1';
      const specialization = {
        id: '1',
        name: '健康专家',
        level: 3,
        progress: 75,
        maxLevel: 5,
        benefits: [],
      };

      const activityData = {
        type: 'health_assessment',
        accuracy: 0.9,
        complexity: 'high',
      };

      const result = await service.checkMasteryProgress(userId, specialization, activityData);

      expect(result.newProgress).toBeGreaterThan(75);
      expect(result.unlockedBenefits).toBeDefined();
      expect(result.masteryLevel).toBeDefined();
    });
  });
});
