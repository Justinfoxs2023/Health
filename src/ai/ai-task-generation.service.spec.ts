import { AITaskGenerationService } from './ai-task-generation.service';
import { IUserHealthProfile } from '../types/gamification/ai-task.types';
import { Test, TestingModule } from '@nestjs/testing';

describe('AITaskGenerationService', () => {
  let service: AITaskGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AITaskGenerationService],
    }).compile();

    service = module.get<AITaskGenerationService>(AITaskGenerationService);
  });

  describe('generatePersonalizedTasks', () => {
    it('generate personalized tasks based on health profile', async () => {
      const userId = '1';
      const mockProfile: IUserHealthProfile = {
        healthMetrics: {
          height: 170,
          weight: 70,
          bmi: 24.2,
          bloodPressure: {
            systolic: 120,
            diastolic: 80,
          },
          bloodSugar: 5.5,
        },
        fitnessLevel: {
          endurance: 7,
          strength: 6,
          flexibility: 5,
          balance: 8,
        },
        dietaryHabits: {
          preferences: ['vegetarian'],
          restrictions: ['lactose'],
          allergies: [],
          mealPattern: ['3meals'],
        },
      };

      const tasks = await service.generatePersonalizedTasks(userId, mockProfile);

      expect(tasks).toHaveLength(expect.any(Number));
      expect(tasks[0]).toHaveProperty('objectives');
      expect(tasks[0]).toHaveProperty('progressTracking');
      expect(tasks[0]).toHaveProperty('supportFeatures');
    });
  });

  describe('generateHealthManagementPlan', () => {
    it('generate health management plan', async () => {
      const userId = '1';
      const mockProfile: IUserHealthProfile = {
        healthMetrics: {
          height: 170,
          weight: 70,
          bmi: 24.2,
          bloodPressure: {
            systolic: 120,
            diastolic: 80,
          },
          bloodSugar: 5.5,
        },
      };

      const plan = await service.generateHealthManagementPlan(userId, mockProfile);

      expect(plan).toHaveProperty('riskAnalysis');
      expect(plan).toHaveProperty('recommendations');
      expect(plan).toHaveProperty('phaseGoals');
      expect(plan).toHaveProperty('taskSequence');
    });
  });
});
