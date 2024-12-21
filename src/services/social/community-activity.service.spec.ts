import { CommunityActivity } from '../../entities/community-activity.entity';
import { CommunityActivityService } from './community-activity.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CommunityActivityService', () => {
  let service: CommunityActivityService;
  let activityRepo: Repository<CommunityActivity>;
  let userService: UserService;

  const mockActivityRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
    updateActivityStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityActivityService,
        {
          provide: getRepositoryToken(CommunityActivity),
          useValue: mockActivityRepo,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<CommunityActivityService>(CommunityActivityService);
    activityRepo = module.get<Repository<CommunityActivity>>(getRepositoryToken(CommunityActivity));
    userService = module.get<UserService>(UserService);
  });

  describe('createActivity', () => {
    it('应该创建社区活动', async () => {
      const userId = '1';
      const activityData = {
        type: 'health_sharing',
        title: '分享我的健康日记',
        content: '今天完成了5公里跑步...',
        tags: ['运动', '跑步'],
      };

      mockActivityRepo.save.mockResolvedValue({
        id: '1',
        userId,
        ...activityData,
        createdAt: new Date(),
      });

      const result = await service.createActivity(userId, activityData);

      expect(result.id).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.type).toBe(activityData.type);
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
        totalActivities: 50,
        engagementRate: 0.8,
        popularTags: ['运动', '饮食', '睡眠'],
        topContributions: [
          { id: '1', likes: 100 },
          { id: '2', likes: 80 },
        ],
      };

      mockActivityRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockStats),
      });

      const stats = await service.getActivityStats(userId, timeRange);

      expect(stats.totalActivities).toBe(mockStats.totalActivities);
      expect(stats.engagementRate).toBe(mockStats.engagementRate);
      expect(stats.popularTags).toEqual(mockStats.popularTags);
    });
  });
});
