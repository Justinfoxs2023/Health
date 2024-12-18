import { FeatureUnlockService } from './feature-unlock.service';
import { IUserGameProfile, IFeatureUnlock } from '../../types/gamification/base.types';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FeatureUnlockService', () => {
  let service: FeatureUnlockService;
  let featureRepo: Repository<IFeatureUnlock>;
  let userProfileRepo: Repository<IUserGameProfile>;

  const mockFeatureRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserProfileRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureUnlockService,
        {
          provide: getRepositoryToken(FeatureUnlock),
          useValue: mockFeatureRepo,
        },
        {
          provide: getRepositoryToken(UserGameProfile),
          useValue: mockUserProfileRepo,
        },
      ],
    }).compile();

    service = module.get<FeatureUnlockService>(FeatureUnlockService);
    featureRepo = module.get<Repository<IFeatureUnlock>>(getRepositoryToken(FeatureUnlock));
    userProfileRepo = module.get<Repository<IUserGameProfile>>(getRepositoryToken(UserGameProfile));
  });

  describe('checkFeatureAvailability', () => {
    it('应该检查功能是否可用', async () => {
      const userId = '1';
      const featureId = 'advanced_analytics';

      const mockUser = {
        userId,
        level: 10,
        features: ['basic_analytics'],
      };

      const mockFeature = {
        id: featureId,
        name: '高级分析',
        type: 'analytics',
        featureId: 'advanced_analytics',
        description: '解锁高级健康数据分析功能',
        requirements: {
          level: 8,
          prerequisites: ['basic_analytics'],
        },
      };

      mockUserProfileRepo.findOne.mockResolvedValue(mockUser);
      mockFeatureRepo.findOne.mockResolvedValue(mockFeature);

      const result = await service.checkFeatureAvailability(userId, featureId);

      expect(result.available).toBe(true);
      expect(result.requirements).toBeDefined();
      expect(result.missingPrerequisites).toHaveLength(0);
    });
  });

  describe('unlockFeature', () => {
    it('应该解锁新功能', async () => {
      const userId = '1';
      const featureId = 'advanced_analytics';

      const mockUser = {
        userId,
        level: 10,
        features: ['basic_analytics'],
      };

      mockUserProfileRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.unlockFeature(userId, featureId);

      expect(result.success).toBe(true);
      expect(result.unlockedFeature).toBe(featureId);
      expect(mockUserProfileRepo.save).toHaveBeenCalled();
    });
  });
});
