import { EngagementMetrics } from '../../entities/engagement/engagement-metrics.entity';
import { IUserGameProfile } from '../../types/gamification/base.types';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEngagementService } from './user-engagement.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserEngagementService', () => {
  let service: UserEngagementService;
  let metricsRepo: Repository<EngagementMetrics>;
  let userProfileRepo: Repository<IUserGameProfile>;

  const mockMetricsRepo = {
    find: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockUserProfileRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserEngagementService,
        {
          provide: getRepositoryToken(EngagementMetrics),
          useValue: mockMetricsRepo,
        },
        {
          provide: getRepositoryToken(UserGameProfile),
          useValue: mockUserProfileRepo,
        },
      ],
    }).compile();

    service = module.get<UserEngagementService>(UserEngagementService);
    metricsRepo = module.get<Repository<EngagementMetrics>>(getRepositoryToken(EngagementMetrics));
    userProfileRepo = module.get<Repository<IUserGameProfile>>(getRepositoryToken(UserGameProfile));
  });

  describe('calculateEngagement', () => {
    it('应该计算用户参与度指标', async () => {
      const userId = '1';
      const timeRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      };

      const mockMetrics = {
        activeTime: 3600,
        sessionCount: 20,
        featureUsage: {
          health_tracking: 50,
          goals: 30,
          social: 20,
        },
        completionRates: {
          goals: 0.8,
          challenges: 0.7,
        },
      };

      mockMetricsRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockMetrics),
      });

      const result = await service.calculateEngagement(userId, timeRange);

      expect(result.score).toBeGreaterThan(0);
      expect(result.metrics).toEqual(mockMetrics);
      expect(result.trends).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });
  });

  describe('analyzeRetention', () => {
    it('应该分析用户留存率', async () => {
      const cohort = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      const mockRetentionData = {
        totalUsers: 1000,
        activeUsers: 800,
        retentionRate: 0.8,
        churnRate: 0.2,
        retentionByWeek: [1, 0.9, 0.85, 0.8],
      };

      mockMetricsRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockRetentionData),
      });

      const analysis = await service.analyzeRetention(cohort);

      expect(analysis.retentionRate).toBe(mockRetentionData.retentionRate);
      expect(analysis.churnRate).toBe(mockRetentionData.churnRate);
      expect(analysis.trends).toBeDefined();
      expect(analysis.insights).toBeDefined();
    });
  });
});
