import { GoalProgress } from '../../entities/goals/goal-progress.entity';
import { HealthGoal } from '../../entities/goals/health-goal.entity';
import { HealthGoalsService } from './health-goals.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('HealthGoalsService', () => {
  let service: HealthGoalsService;
  let goalRepo: Repository<HealthGoal>;
  let progressRepo: Repository<GoalProgress>;

  const mockGoalRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockProgressRepo = {
    find: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthGoalsService,
        {
          provide: getRepositoryToken(HealthGoal),
          useValue: mockGoalRepo,
        },
        {
          provide: getRepositoryToken(GoalProgress),
          useValue: mockProgressRepo,
        },
      ],
    }).compile();

    service = module.get<HealthGoalsService>(HealthGoalsService);
    goalRepo = module.get<Repository<HealthGoal>>(getRepositoryToken(HealthGoal));
    progressRepo = module.get<Repository<GoalProgress>>(getRepositoryToken(GoalProgress));
  });

  describe('createHealthGoal', () => {
    it('应该成功创建健康目标', async () => {
      const userId = '1';
      const goalData = {
        type: 'weight_loss',
        target: 65,
        deadline: new Date('2024-06-30'),
        milestones: [
          { target: 68, deadline: new Date('2024-03-31') },
          { target: 66, deadline: new Date('2024-05-31') },
        ],
      };

      mockGoalRepo.save.mockResolvedValue({ id: '1', ...goalData });

      const result = await service.createHealthGoal(userId, goalData);

      expect(result.id).toBeDefined();
      expect(result.type).toBe(goalData.type);
      expect(result.milestones).toHaveLength(2);
    });
  });

  describe('trackGoalProgress', () => {
    it('应该正确追踪目标进度', async () => {
      const userId = '1';
      const goalId = '1';
      const progressData = {
        currentValue: 67.5,
        timestamp: new Date(),
        notes: '坚持运动和健康饮食',
      };

      const mockGoal = {
        id: goalId,
        type: 'weight_loss',
        target: 65,
        currentValue: 70,
        deadline: new Date('2024-06-30'),
      };

      mockGoalRepo.findOne.mockResolvedValue(mockGoal);
      mockProgressRepo.save.mockResolvedValue({ id: '1', ...progressData });

      const result = await service.trackGoalProgress(userId, goalId, progressData);

      expect(result.progress).toBeDefined();
      expect(result.achievementRate).toBeGreaterThan(0);
      expect(result.nextMilestone).toBeDefined();
    });
  });
});
