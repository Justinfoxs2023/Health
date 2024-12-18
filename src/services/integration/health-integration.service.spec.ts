import { AIService } from '../ai/ai.service';
import { ExerciseService } from '../exercise/exercise.service';
import { HealthIntegrationService } from './health-integration.service';
import { MedicationService } from '../medication/medication.service';
import { NutritionService } from '../nutrition/nutrition.service';
import { RehabilitationService } from '../rehabilitation/rehabilitation.service';
import { StorageService } from '../storage/storage.service';
import { TelemedicineService } from '../telemedicine/telemedicine.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthIntegrationService', () => {
  let service: HealthIntegrationService;
  let exerciseService: ExerciseService;
  let nutritionService: NutritionService;
  let rehabilitationService: RehabilitationService;
  let medicationService: MedicationService;
  let telemedicineService: TelemedicineService;
  let aiService: AIService;

  const mockExerciseService = {
    getUserData: jest.fn(),
  };

  const mockNutritionService = {
    getUserData: jest.fn(),
  };

  const mockRehabilitationService = {
    getUserData: jest.fn(),
  };

  const mockMedicationService = {
    getUserData: jest.fn(),
  };

  const mockTelemedicineService = {
    getUserData: jest.fn(),
  };

  const mockAIService = {
    analyzeHealthData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthIntegrationService,
        {
          provide: ExerciseService,
          useValue: mockExerciseService,
        },
        {
          provide: NutritionService,
          useValue: mockNutritionService,
        },
        {
          provide: RehabilitationService,
          useValue: mockRehabilitationService,
        },
        {
          provide: MedicationService,
          useValue: mockMedicationService,
        },
        {
          provide: TelemedicineService,
          useValue: mockTelemedicineService,
        },
        {
          provide: AIService,
          useValue: mockAIService,
        },
      ],
    }).compile();

    service = module.get<HealthIntegrationService>(HealthIntegrationService);
    exerciseService = module.get<ExerciseService>(ExerciseService);
    nutritionService = module.get<NutritionService>(NutritionService);
    rehabilitationService = module.get<RehabilitationService>(RehabilitationService);
    medicationService = module.get<MedicationService>(MedicationService);
    telemedicineService = module.get<TelemedicineService>(TelemedicineService);
    aiService = module.get<AIService>(AIService);
  });

  describe('performHealthAssessment', () => {
    it('应该执行综合健康评估', async () => {
      const userId = '1';
      const mockData = {
        exercise: { steps: 10000 },
        nutrition: { calories: 2000 },
        rehabilitation: { progress: 0.8 },
        medication: { adherence: 0.95 },
        vitalSigns: { heartRate: 75 },
      };

      mockExerciseService.getUserData.mockResolvedValue(mockData.exercise);
      mockNutritionService.getUserData.mockResolvedValue(mockData.nutrition);
      mockRehabilitationService.getUserData.mockResolvedValue(mockData.rehabilitation);
      mockMedicationService.getUserData.mockResolvedValue(mockData.medication);

      mockAIService.analyzeHealthData.mockResolvedValue({
        status: 'healthy',
        recommendations: [],
      });

      const result = await service.performHealthAssessment(userId);

      expect(result.data).toBeDefined();
      expect(result.analysis).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });
});
