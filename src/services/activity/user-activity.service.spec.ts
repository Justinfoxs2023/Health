import { ActivityLog } from '../../entities/activity/activity-log.entity';
import { IUserGameProfile } from '../../types/gamification/base.types';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserActivityService } from './user-activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserActivityService', () => {
  let service: UserActivityService;
  let activityRepo: Repository<ActivityLog>;
  let userProfileRepo: Repository<IUserGameProfile>;

  const mockActivityRepo = {
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
        UserActivityService,
        {
          provide: getRepositoryToken(ActivityLog),
          useValue: mockActivityRepo,
        },
        {
          provide: getRepositoryToken(UserGameProfile),
          useValue: mockUserProfileRepo,
        },
      ],
    }).compile();

    service = module.get<UserActivityService>(UserActivityService);
    activityRepo = module.get<Repository<ActivityLog>>(getRepositoryToken(ActivityLog));
    userProfileRepo = module.get<Repository<IUserGameProfile>>(getRepositoryToken(UserGameProfile));
  });

  describe('logActivity', () => {
    it('应该记录用户活动', async () => {
      const userId = '1';
      const activityData = {
        type: 'health_tracking',
        action: 'record_vital_signs',
        metadata: {
          heartRate: 75,
          bloodPressure: {
            systolic: 120,
            diastolic: 80,
          },
        },
      };

      mockActivityRepo.save.mockResolvedValue({
        id: '1',
        userId,
        ...activityData,
        timestamp: new Date(),
      });

      const result = await service.logActivity(userId, activityData);

      expect(result.id).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.type).toBe(activityData.type);
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getActivityStats', () => {
    it('应该获取活动统计数据', async () => {
      const userId = '1';
      const timeRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      };

      const mockStats = {
        totalActivities: 100,
        activityTypes: {
          health_tracking: 50,
          exercise: 30,
          nutrition: 20,
        },
        dailyAverage: 3.2,
        mostActiveDay: '2024-01-15',
      };

      mockActivityRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockStats),
      });

      const stats = await service.getActivityStats(userId, timeRange);

      expect(stats.totalActivities).toBe(mockStats.totalActivities);
      expect(stats.activityTypes).toEqual(mockStats.activityTypes);
      expect(stats.dailyAverage).toBe(mockStats.dailyAverage);
      expect(stats.mostActiveDay).toBe(mockStats.mostActiveDay);
    });
  });
});
