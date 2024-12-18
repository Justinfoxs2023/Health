import { AIService } from '../services/ai/ai.service';
import { HealthAnalysisService } from './health-analysis.service';
import { HealthRecord } from '../entities/health/health-record.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('HealthAnalysisService', () => {
  let service: HealthAnalysisService;
  let repository: Repository<HealthRecord>;
  let aiService: AIService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAIService = {
    analyzeHealthData: jest.fn(),
    generateRecommendations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthAnalysisService,
        {
          provide: getRepositoryToken(HealthRecord),
          useValue: mockRepository,
        },
        {
          provide: AIService,
          useValue: mockAIService,
        },
      ],
    }).compile();

    service = module.get<HealthAnalysisService>(HealthAnalysisService);
    repository = module.get<Repository<HealthRecord>>(getRepositoryToken(HealthRecord));
    aiService = module.get<AIService>(AIService);
  });

  describe('analyzeHealthTrends', () => {
    it('analyze health trends and generate insights', async () => {
      const userId = '1';
      const mockRecords = [
        {
          id: '1',
          userId,
          type: 'vital_signs',
          data: {
            heartRate: 75,
            bloodPressure: {
              systolic: 120,
              diastolic: 80,
            },
          },
          timestamp: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(mockRecords);
      mockAIService.analyzeHealthData.mockResolvedValue({
        trends: [],
        risks: [],
        recommendations: [],
      });

      const result = await service.analyzeHealthTrends(userId);

      expect(result).toHaveProperty('trends');
      expect(result).toHaveProperty('risks');
      expect(result).toHaveProperty('recommendations');
    });
  });

  describe('generateHealthReport', () => {
    it('generate comprehensive health report', async () => {
      const userId = '1';
      const timeRange = { start: new Date(), end: new Date() };

      const mockAnalysis = {
        trends: [],
        risks: [],
        recommendations: [],
      };

      mockAIService.analyzeHealthData.mockResolvedValue(mockAnalysis);
      mockAIService.generateRecommendations.mockResolvedValue([]);

      const report = await service.generateHealthReport(userId, timeRange);

      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('analysis');
      expect(report).toHaveProperty('recommendations');
    });
  });
});
