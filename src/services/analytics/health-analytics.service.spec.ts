import { AIService } from '../ai/ai.service';
import { ExerciseService } from '../exercise/exercise.service';
import { HealthAnalyticsService } from './health-analytics.service';
import { IntelligentAlertService } from '../alert/intelligent-alert.service';
import { MedicationService } from '../medication/medication.service';
import { NutritionService } from '../nutrition/nutrition.service';
import { StorageService } from '../storage/storage.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthAnalyticsService', () => {
  let service: HealthAnalyticsService;
  let storageService: StorageService;
  let aiService: AIService;
  let exerciseService: ExerciseService;
  let nutritionService: NutritionService;
  let medicationService: MedicationService;
  let alertService: IntelligentAlertService;

  const mockStorageService = {
    getData: jest.fn(),
    saveData: jest.fn(),
  };

  const mockAIService = {
    analyzeHealthData: jest.fn(),
    generateRecommendations: jest.fn(),
  };

  const mockExerciseService = {
    getUserData: jest.fn(),
  };

  const mockNutritionService = {
    getUserData: jest.fn(),
  };

  const mockMedicationService = {
    getUserData: jest.fn(),
  };

  const mockAlertService = {
    sendAlert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthAnalyticsService,
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
        {
          provide: AIService,
          useValue: mockAIService,
        },
        {
          provide: ExerciseService,
          useValue: mockExerciseService,
        },
        {
          provide: NutritionService,
          useValue: mockNutritionService,
        },
        {
          provide: MedicationService,
          useValue: mockMedicationService,
        },
        {
          provide: IntelligentAlertService,
          useValue: mockAlertService,
        },
      ],
    }).compile();

    service = module.get<HealthAnalyticsService>(HealthAnalyticsService);
    storageService = module.get<StorageService>(StorageService);
    aiService = module.get<AIService>(AIService);
    exerciseService = module.get<ExerciseService>(ExerciseService);
    nutritionService = module.get<NutritionService>(NutritionService);
    medicationService = module.get<MedicationService>(MedicationService);
    alertService = module.get<IntelligentAlertService>(IntelligentAlertService);
  });

  describe('analyzeHealthData', () => {
    it('应该分析健康数据并生成洞察', async () => {
      const userId = '1';
      const mockData = {
        exercise: { steps: 10000 },
        nutrition: { calories: 2000 },
        medication: { adherence: 0.95 },
      };

      mockExerciseService.getUserData.mockResolvedValue(mockData.exercise);
      mockNutritionService.getUserData.mockResolvedValue(mockData.nutrition);
      mockMedicationService.getUserData.mockResolvedValue(mockData.medication);

      mockAIService.analyzeHealthData.mockResolvedValue({
        correlations: [],
        predictions: [],
        recommendations: [],
      });

      const result = await service.analyzeHealthData(userId);

      expect(result.overview).toBeDefined();
      expect(result.correlations).toBeDefined();
      expect(result.predictions).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });
  });

  describe('generateHealthReport', () => {
    it('应该生成健康报告', async () => {
      const userId = '1';
      const period = 'weekly';

      const mockAnalysis = {
        overview: { healthScore: 85 },
        correlations: [],
        predictions: [],
        recommendations: [],
      };

      mockAIService.analyzeHealthData.mockResolvedValue(mockAnalysis);

      const report = await service.generateHealthReport(userId, period);

      expect(report.period).toBe(period);
      expect(report.summary).toBeDefined();
      expect(report.details).toBeDefined();
      expect(report.analysis).toBeDefined();
    });
  });
});
