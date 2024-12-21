import { GamificationService } from '../gamification/gamification.service';
import { ProgressTrackingService } from './progress-tracking.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserProgress } from '../entities/user-progress.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProgressTrackingService', () => {
  let service: ProgressTrackingService;
  let repository: Repository<UserProgress>;
  let gamificationService: GamificationService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockGamificationService = {
    updateProgress: jest.fn(),
    calculateRewards: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressTrackingService,
        {
          provide: getRepositoryToken(UserProgress),
          useValue: mockRepository,
        },
        {
          provide: GamificationService,
          useValue: mockGamificationService,
        },
      ],
    }).compile();

    service = module.get<ProgressTrackingService>(ProgressTrackingService);
    repository = module.get<Repository<UserProgress>>(getRepositoryToken(UserProgress));
    gamificationService = module.get<GamificationService>(GamificationService);
  });

  describe('trackActivity', () => {
    it('track user activity and update progress', async () => {
      const userId = '1';
      const activityData = {
        type: 'daily_exercise',
        metrics: {
          duration: 45,
          intensity: 'moderate',
          caloriesBurned: 300,
        },
        timestamp: new Date(),
      };

      mockRepository.findOne.mockResolvedValue({
        userId,
        activities: [],
        streaks: {
          daily: 3,
          weekly: 1,
        },
        milestones: [],
      });

      const result = await service.trackActivity(userId, activityData);

      expect(result.progress).toBeDefined();
      expect(result.streaks).toBeDefined();
      expect(result.rewards).toBeDefined();
    });
  });

  describe('generateProgressReport', () => {
    it('generate detailed progress report', async () => {
      const userId = '1';
      const timeRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      };

      const mockActivities = [
        {
          type: 'exercise',
          metrics: { duration: 30 },
          timestamp: new Date('2024-01-15'),
        },
      ];

      mockRepository.find.mockResolvedValue(mockActivities);

      const report = await service.generateProgressReport(userId, timeRange);

      expect(report.summary).toBeDefined();
      expect(report.achievements).toBeDefined();
      expect(report.trends).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });
  });
});
