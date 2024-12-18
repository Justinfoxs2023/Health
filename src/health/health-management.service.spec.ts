import { AITaskGenerationService } from '../ai/ai-task-generation.service';
import { HealthManagementService } from './health-management.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TradingService } from '../marketplace/trading.service';

describe('HealthManagementService', () => {
  let service: HealthManagementService;
  let aiTaskService: AITaskGenerationService;
  let tradingService: TradingService;

  const mockAITaskService = {
    generateHealthManagementPlan: jest.fn(),
  };

  const mockTradingService = {
    getHealthProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthManagementService,
        {
          provide: AITaskGenerationService,
          useValue: mockAITaskService,
        },
        {
          provide: TradingService,
          useValue: mockTradingService,
        },
      ],
    }).compile();

    service = module.get<HealthManagementService>(HealthManagementService);
    aiTaskService = module.get<AITaskGenerationService>(AITaskGenerationService);
    tradingService = module.get<TradingService>(TradingService);
  });

  describe('evaluateHealthStatus', () => {
    it('evaluate health status and generate plan', async () => {
      const userId = '1';
      const mockHealthProfile = {
        healthConditions: ['hypertension'],
      };

      const mockManagementPlan = {
        recommendations: ['reduce salt intake'],
        tasks: ['daily blood pressure monitoring'],
      };

      const mockProducts = [{ id: '1', name: 'Blood Pressure Monitor' }];

      jest.spyOn(service as any, 'getUserHealthProfile').mockResolvedValue(mockHealthProfile);

      mockAITaskService.generateHealthManagementPlan.mockResolvedValue(mockManagementPlan);

      mockTradingService.getHealthProducts.mockResolvedValue(mockProducts);

      const result = await service.evaluateHealthStatus(userId);

      expect(result).toEqual({
        healthProfile: mockHealthProfile,
        managementPlan: mockManagementPlan,
        recommendations: mockProducts,
        riskAssessment: expect.any(Object),
        lifestyleAnalysis: expect.any(Object),
      });
    });
  });

  describe('generateRecommendations', () => {
    it('generate personalized recommendations', async () => {
      const userId = '1';
      const mockProfile = {
        healthConditions: ['hypertension'],
        lifestyle: {
          exercise: 'moderate',
          diet: 'balanced',
        },
      };

      jest.spyOn(service as any, 'getUserHealthProfile').mockResolvedValue(mockProfile);

      const result = await service.generateRecommendations(userId);

      expect(result).toEqual(expect.any(Object));
      expect(result.recommendations).toBeDefined();
      expect(result.priority).toBeDefined();
    });
  });
});
