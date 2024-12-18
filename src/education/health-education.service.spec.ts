import { AIService } from '../ai/ai.service';
import { EducationCategory, ContentLevel } from './types/education.types';
import { HealthEducationService } from './health-education.service';
import { StorageService } from '../storage/storage.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthEducationService', () => {
  let service: HealthEducationService;
  let storageService: StorageService;
  let aiService: AIService;

  const mockStorageService = {
    getData: jest.fn(),
    saveData: jest.fn(),
  };

  const mockAIService = {
    generateRecommendations: jest.fn(),
    analyzeProgress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthEducationService,
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
        {
          provide: AIService,
          useValue: mockAIService,
        },
      ],
    }).compile();

    service = module.get<HealthEducationService>(HealthEducationService);
    storageService = module.get<StorageService>(StorageService);
    aiService = module.get<AIService>(AIService);
  });

  describe('getRecommendedContent', () => {
    it('return recommended content based on preferences', async () => {
      const userId = '1';
      const preferences = {
        categories: [EducationCategory.HEALTH_BASICS],
        level: ContentLevel.BEGINNER,
        duration: 30,
      };

      const mockContent = [
        {
          id: '1',
          title: '健康基础知识',
          category: EducationCategory.HEALTH_BASICS,
          level: ContentLevel.BEGINNER,
          duration: 25,
        },
      ];

      mockStorageService.getData.mockResolvedValue(mockContent);
      mockAIService.generateRecommendations.mockResolvedValue(mockContent);

      const result = await service.getRecommendedContent(userId, preferences);

      expect(result).toEqual(mockContent);
      expect(mockAIService.generateRecommendations).toHaveBeenCalledWith(
        expect.any(Object),
        preferences,
      );
    });
  });

  describe('updateProgress', () => {
    it('update learning progress', async () => {
      const userId = '1';
      const contentId = '1';
      const progress = {
        completed: true,
        score: 85,
        timeSpent: 1800,
      };

      await service.updateProgress(userId, contentId, progress);

      expect(mockStorageService.saveData).toHaveBeenCalledWith(
        expect.stringContaining(userId),
        expect.objectContaining(progress),
      );
    });
  });
});
