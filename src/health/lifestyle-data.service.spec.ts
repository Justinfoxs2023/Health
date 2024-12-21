import { LifestyleData } from '../entities/lifestyle-data.entity';
import { LifestyleDataService } from './lifestyle-data.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LifestyleDataService', () => {
  let service: LifestyleDataService;
  let repository: Repository<LifestyleData>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LifestyleDataService,
        {
          provide: getRepositoryToken(LifestyleData),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LifestyleDataService>(LifestyleDataService);
    repository = module.get<Repository<LifestyleData>>(getRepositoryToken(LifestyleData));
  });

  describe('recordLifestyleData', () => {
    it('record lifestyle data', async () => {
      const userId = '1';
      const lifestyleData = {
        sleepHours: 8,
        activityLevel: 7,
        activities: [
          {
            type: 'walking',
            duration: 30,
            intensity: 3,
            caloriesBurned: 150,
          },
        ],
        stressLevel: 3,
        moodScore: 8,
      };

      mockRepository.save.mockResolvedValue({ id: '1', userId, ...lifestyleData });

      const result = await service.recordLifestyleData(userId, lifestyleData);

      expect(result).toHaveProperty('id');
      expect(result.userId).toBe(userId);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ userId, ...lifestyleData }),
      );
    });
  });

  describe('getLifestyleAnalytics', () => {
    it('return lifestyle analytics', async () => {
      const userId = '1';
      const mockData = [
        {
          id: '1',
          userId,
          sleepHours: 8,
          activityLevel: 7,
          activities: [],
          createdAt: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(mockData);

      const result = await service.getLifestyleAnalytics(userId);

      expect(result).toHaveProperty('sleepPattern');
      expect(result).toHaveProperty('activityTrend');
      expect(result).toHaveProperty('wellnessScore');
    });
  });
});
