import { Test, TestingModule } from '@nestjs/testing';
import { UnifiedHealthAssessmentService } from './unified-health-assessment.service';
import { CacheManager } from '@shared/utils/cache-manager';
import { DataProcessor } from '@shared/utils/data-processor';
import { AIModelManager } from '@shared/models/ai-model-manager';
import { HealthData, AssessmentResult } from '@shared/types/health.types';

describe('UnifiedHealthAssessmentService', () => {
  let service: UnifiedHealthAssessmentService;
  let cacheManager: jest.Mocked<CacheManager>;
  let dataProcessor: jest.Mocked<DataProcessor>;
  let modelManager: jest.Mocked<AIModelManager>;

  const mockHealthData: HealthData = {
    userId: 'test-user',
    physicalData: {
      height: 175,
      weight: 70,
      bloodPressure: {
        systolic: 120,
        diastolic: 80
      },
      heartRate: 75,
      bodyTemperature: 36.5,
      bloodOxygen: 98
    },
    mentalData: {
      stressLevel: 3,
      moodScore: 8,
      sleepQuality: 7
    },
    nutritionData: {
      calorieIntake: 2000,
      proteinIntake: 75,
      carbIntake: 250,
      fatIntake: 65,
      waterIntake: 2000,
      meals: []
    },
    lifestyleData: {
      sleepHours: 7,
      activityLevel: 3,
      smokingStatus: false,
      alcoholConsumption: 0,
      workHours: 8
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnifiedHealthAssessmentService,
        {
          provide: CacheManager,
          useValue: {
            get: jest.fn(),
            set: jest.fn()
          }
        },
        {
          provide: DataProcessor,
          useValue: {
            preprocessHealthData: jest.fn()
          }
        },
        {
          provide: AIModelManager,
          useValue: {
            loadModel: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<UnifiedHealthAssessmentService>(UnifiedHealthAssessmentService);
    cacheManager = module.get(CacheManager);
    dataProcessor = module.get(DataProcessor);
    modelManager = module.get(AIModelManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('assessHealth', () => {
    it('should return cached result if available', async () => {
      const mockCachedResult: AssessmentResult = {
        userId: 'test-user',
        overallScore: 0.85,
        categoryScores: {
          physical: 0.9,
          mental: 0.8,
          nutrition: 0.85,
          lifestyle: 0.85
        },
        recommendations: ['保持良好的运动习惯'],
        timestamp: new Date()
      };

      cacheManager.get.mockResolvedValue(mockCachedResult);

      const result = await service.assessHealth(mockHealthData);
      expect(result).toEqual(mockCachedResult);
      expect(cacheManager.get).toHaveBeenCalledWith(`health_assessment_${mockHealthData.userId}`);
    });

    it('should process health data and return assessment result', async () => {
      const mockProcessedData = [0.8, 0.7, 0.9, 0.85];
      const mockPredictions = [0.85, 0.8, 0.75, 0.9];
      const mockModel = {
        predict: jest.fn().mockResolvedValue(mockPredictions)
      };

      cacheManager.get.mockResolvedValue(null);
      dataProcessor.preprocessHealthData.mockResolvedValue(mockProcessedData);
      modelManager.loadModel.mockResolvedValue(mockModel);

      const result = await service.assessHealth(mockHealthData);

      expect(result).toMatchObject({
        userId: mockHealthData.userId,
        overallScore: expect.any(Number),
        categoryScores: {
          physical: expect.any(Number),
          mental: expect.any(Number),
          nutrition: expect.any(Number),
          lifestyle: expect.any(Number)
        },
        recommendations: expect.any(Array),
        timestamp: expect.any(Date)
      });

      expect(dataProcessor.preprocessHealthData).toHaveBeenCalledWith(mockHealthData);
      expect(modelManager.loadModel).toHaveBeenCalledWith('health_assessment');
      expect(cacheManager.set).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      const mockError = new Error('Processing failed');
      dataProcessor.preprocessHealthData.mockRejectedValue(mockError);

      await expect(service.assessHealth(mockHealthData)).rejects.toThrow(mockError);
    });
  });

  describe('calculateOverallScore', () => {
    it('should calculate average score correctly', () => {
      const predictions = [0.8, 0.9, 0.7, 0.85];
      const expectedScore = 0.8125; // (0.8 + 0.9 + 0.7 + 0.85) / 4

      const result = service['calculateOverallScore'](predictions);
      expect(result).toBe(expectedScore);
    });
  });

  describe('calculateCategoryScores', () => {
    it('should map predictions to category scores correctly', () => {
      const predictions = [0.8, 0.9, 0.7, 0.85];
      const expectedScores = {
        physical: 0.8,
        mental: 0.9,
        nutrition: 0.7,
        lifestyle: 0.85
      };

      const result = service['calculateCategoryScores'](predictions);
      expect(result).toEqual(expectedScores);
    });
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations for low scores', () => {
      const predictions = [0.5, 0.8, 0.4, 0.9];
      const result = service['generateRecommendations'](predictions);
      
      expect(result).toContain('建议增加每日运动时间，保持规律运动习惯');
      expect(result).toContain('建议注意饮食均衡，增加蔬果摄入');
      expect(result).not.toContain('建议保持良好的作息规律，适当进行放松和冥想');
      expect(result).not.toContain('建议培养健康的生活方式，保持作息规律');
    });

    it('should not generate recommendations for high scores', () => {
      const predictions = [0.8, 0.9, 0.7, 0.85];
      const result = service['generateRecommendations'](predictions);
      expect(result).toHaveLength(0);
    });
  });
}); 