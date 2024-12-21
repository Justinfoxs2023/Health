import { IUserGameProfile, ISpecialization } from '../../types/gamification/base.types';
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

  describe('upgradeSpecialization', () => {
    it('应该正确升级专精等级', async () => {
      const userId = '1';
      const specializationId = 'health-expert';

      const mockSpecialization = {
        id: specializationId,
        name: '健康专家',
        level: 3,
        progress: 80,
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

      const result = await service.upgradeSpecialization(userId, specializationId);

      expect(result.newLevel).toBeGreaterThan(mockSpecialization.level);
      expect(result.unlockedBenefits).toBeDefined();
      expect(result.progress).toBe(0); // 升级后进度重置
    });
  });

  describe('calculateBenefits', () => {
    it('应该计算专精带来的收益加成', async () => {
      const userId = '1';
      const activityType = 'health_tracking';

      const mockSpecializations = [
        {
          id: 'health-expert',
          level: 5,
          benefits: [
            {
              type: 'exp_boost',
              value: 1.3,
              unlockLevel: 5,
            },
          ],
        },
      ];

      mockSpecializationRepo.find.mockResolvedValue(mockSpecializations);

      const benefits = await service.calculateBenefits(userId, activityType);

      expect(benefits.expMultiplier).toBeGreaterThan(1);
      expect(benefits.activeBoosts).toBeDefined();
    });
  });
});
