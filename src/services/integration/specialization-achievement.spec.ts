import { Repository } from 'typeorm';
import { Specialization, Achievement } from '../../entities/gamification';
import { SpecializationService } from '../specialization/specialization.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievementsService } from '../achievements/user-achievements.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('专精与成就系统联动测试', () => {
  let specializationService: SpecializationService;
  let achievementsService: UserAchievementsService;
  let specializationRepo: Repository<Specialization>;
  let achievementRepo: Repository<Achievement>;

  const mockSpecializationRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockAchievementRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecializationService,
        UserAchievementsService,
        {
          provide: getRepositoryToken(Specialization),
          useValue: mockSpecializationRepo,
        },
        {
          provide: getRepositoryToken(Achievement),
          useValue: mockAchievementRepo,
        },
      ],
    }).compile();

    specializationService = module.get<SpecializationService>(SpecializationService);
    achievementsService = module.get<UserAchievementsService>(UserAchievementsService);
    specializationRepo = module.get<Repository<Specialization>>(getRepositoryToken(Specialization));
    achievementRepo = module.get<Repository<Achievement>>(getRepositoryToken(Achievement));
  });

  describe('专精升级触发成就', () => {
    it('应该在专精升级时解锁相关成就', async () => {
      const userId = '1';
      const specializationId = 'health-expert';

      // 模拟专精升级
      mockSpecializationRepo.findOne.mockResolvedValue({
        id: specializationId,
        level: 4,
        progress: 100,
        maxLevel: 10,
      });

      // 模拟相关成就
      mockAchievementRepo.find.mockResolvedValue([
        {
          id: 'mastery-milestone',
          type: 'specialization',
          requirements: {
            specializationId,
            level: 5,
          },
        },
      ]);

      // 执行专精升级
      const upgradeResult = await specializationService.upgradeSpecialization(
        userId,
        specializationId,
      );

      // 检查成就解锁
      const achievements = await achievementsService.checkAchievements(userId, {
        type: 'specialization_upgrade',
        specializationId,
        newLevel: upgradeResult.newLevel,
      });

      expect(achievements.unlockedAchievements).toHaveLength(1);
      expect(achievements.unlockedAchievements[0].id).toBe('mastery-milestone');
    });
  });
});
