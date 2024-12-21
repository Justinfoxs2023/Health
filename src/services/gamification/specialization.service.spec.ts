import { ISpecialization, IUserGameProfile } from '../../types/gamification/base.types';
import { Repository } from 'typeorm';
import { SpecializationService } from './specialization.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SpecializationService', () => {
  let service: SpecializationService;
  let specializationRepo: Repository<ISpecialization>;
  let userProfileRepo: Repository<IUserGameProfile>;

  const mockSpecializationRepo = {
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
        SpecializationService,
        {
          provide: getRepositoryToken(Specialization),
          useValue: mockSpecializationRepo,
        },
        {
          provide: getRepositoryToken(UserGameProfile),
          useValue: mockUserProfileRepo,
        },
      ],
    }).compile();

    service = module.get<SpecializationService>(SpecializationService);
    specializationRepo = module.get<Repository<ISpecialization>>(
      getRepositoryToken(Specialization),
    );
    userProfileRepo = module.get<Repository<IUserGameProfile>>(getRepositoryToken(UserGameProfile));
  });

  describe('unlockSpecialization', () => {
    it('应该成功解锁专精', async () => {
      const userId = '1';
      const specializationId = 'health-master';

      const mockProfile = {
        userId,
        level: 10,
        experience: 5000,
        achievements: [],
      };

      const mockSpecialization = {
        id: specializationId,
        name: '健康大师',
        level: 1,
        progress: 0,
        maxLevel: 10,
        benefits: [
          {
            type: 'exp_boost',
            value: 1.2,
            unlockLevel: 3,
          },
        ],
      };

      mockUserProfileRepo.findOne.mockResolvedValue(mockProfile);
      mockSpecializationRepo.findOne.mockResolvedValue(mockSpecialization);

      const result = await service.unlockSpecialization(userId, specializationId);

      expect(result.success).toBe(true);
      expect(result.specialization).toBeDefined();
      expect(result.unlockedBenefits).toHaveLength(0);
    });
  });

  describe('updateSpecializationProgress', () => {
    it('应该正确更新专精进度', async () => {
      const userId = '1';
      const specializationId = 'health-master';
      const activityData = {
        type: 'health_tracking',
        duration: 60,
        complexity: 'medium',
      };

      const mockSpecialization = {
        id: specializationId,
        level: 3,
        progress: 50,
        maxLevel: 10,
        benefits: [
          {
            type: 'exp_boost',
            value: 1.2,
            unlockLevel: 3,
          },
        ],
      };

      mockSpecializationRepo.findOne.mockResolvedValue(mockSpecialization);

      const result = await service.updateSpecializationProgress(
        userId,
        specializationId,
        activityData,
      );

      expect(result.newProgress).toBeGreaterThan(50);
      expect(result.levelUp).toBeDefined();
      expect(result.unlockedBenefits).toBeDefined();
    });
  });
});
