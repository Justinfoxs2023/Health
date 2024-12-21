import { ActivityLog, Specialization } from '../../entities/gamification';
import { Repository } from 'typeorm';
import { SpecializationService } from '../specialization/specialization.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserActivityService } from '../activity/user-activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('活动记录与专精进度关联测试', () => {
  let activityService: UserActivityService;
  let specializationService: SpecializationService;
  let activityRepo: Repository<ActivityLog>;
  let specializationRepo: Repository<Specialization>;

  const mockActivityRepo = {
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockSpecializationRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserActivityService,
        SpecializationService,
        {
          provide: getRepositoryToken(ActivityLog),
          useValue: mockActivityRepo,
        },
        {
          provide: getRepositoryToken(Specialization),
          useValue: mockSpecializationRepo,
        },
      ],
    }).compile();

    activityService = module.get<UserActivityService>(UserActivityService);
    specializationService = module.get<SpecializationService>(SpecializationService);
    activityRepo = module.get<Repository<ActivityLog>>(getRepositoryToken(ActivityLog));
    specializationRepo = module.get<Repository<Specialization>>(getRepositoryToken(Specialization));
  });

  describe('活动增加专精进度', () => {
    it('应该在记录活动时增加相关专精进度', async () => {
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

      // 模拟当前专精状态
      mockSpecializationRepo.findOne.mockResolvedValue({
        id: 'health-expert',
        level: 3,
        progress: 60,
        maxLevel: 10,
      });

      // 记录活动
      await activityService.logActivity(userId, activityData);

      // 检查专精进度更新
      const specialization = await specializationService.getSpecialization(userId, 'health-expert');

      expect(specialization.progress).toBeGreaterThan(60);
      expect(mockSpecializationRepo.save).toHaveBeenCalled();
    });
  });
});
