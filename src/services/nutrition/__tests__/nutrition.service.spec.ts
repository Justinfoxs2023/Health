import { CacheService } from '../../cache/redis.service';
import { ConfigService } from '@nestjs/config';
import { FoodItem } from '../types';
import { LoggerService } from '../../logger/logger.service';
import { MonitoringService } from '../../monitoring/metrics.service';
import { NutritionService } from '../nutrition.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('NutritionService', () => {
  let service: NutritionService;
  let config: ConfigService;
  let logger: LoggerService;
  let cache: CacheService;
  let monitoring: MonitoringService;

  const mockFoodItems: FoodItem[] = [
    {
      id: '1',
      name: '苹果',
      category: '水果',
      quantity: 1,
      unit: '个',
      calories: 95,
      nutrients: {
        protein: 0.5,
        fat: 0.3,
        carbs: 25,
        fiber: 4.4,
        sugar: 19,
        sodium: 2,
        cholesterol: 0,
        vitamins: {
          A: 98,
          C: 8.4,
          D: 0,
          E: 0.33,
          K: 4,
          B1: 0.017,
          B2: 0.026,
          B6: 0.041,
          B12: 0,
        },
        minerals: {
          calcium: 11,
          iron: 0.12,
          magnesium: 9,
          potassium: 195,
          zinc: 0.04,
        },
      },
      glycemicIndex: 36,
      allergens: [],
      ingredients: ['苹果'],
      source: 'USDA',
      verificationStatus: 'verified',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutritionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'nutrition.cacheTimeout':
                  return 3600;
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            clear: jest.fn(),
          },
        },
        {
          provide: MonitoringService,
          useValue: {
            recordOperationDuration: jest.fn(),
            incrementErrorCount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NutritionService>(NutritionService);
    config = module.get<ConfigService>(ConfigService);
    logger = module.get<LoggerService>(LoggerService);
    cache = module.get<CacheService>(CacheService);
    monitoring = module.get<MonitoringService>(MonitoringService);
  });

  it('be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyzeMeal', () => {
    const userId = 'test-user';

    it('analyze meal correctly', async () => {
      // Mock cache miss
      jest.spyOn(cache, 'get').mockResolvedValue(null);

      const result = await service.analyzeMeal(userId, mockFoodItems);

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.foodItems).toEqual(mockFoodItems);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.mealType).toBeDefined();
      expect(result.totalNutrients).toBeDefined();
      expect(result.nutritionScore).toBeDefined();
      expect(result.balanceAnalysis).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.warnings).toBeDefined();
    });

    it('use cached result when available', async () => {
      const cachedResult = {
        userId,
        timestamp: new Date(),
        foodItems: mockFoodItems,
        mealType: 'lunch',
        totalNutrients: {},
        nutritionScore: 85,
        balanceAnalysis: {},
        recommendations: [],
        warnings: [],
      };

      jest.spyOn(cache, 'get').mockResolvedValue(JSON.stringify(cachedResult));

      const result = await service.analyzeMeal(userId, mockFoodItems);

      expect(result).toEqual(cachedResult);
      expect(cache.get).toHaveBeenCalled();
    });

    it('handle empty food items', async () => {
      await expect(service.analyzeMeal(userId, [])).rejects.toThrow('Food items cannot be empty');
    });
  });

  describe('createDietPlan', () => {
    const userId = 'test-user';
    const type = 'weight-loss';
    const preferences = {
      restrictions: {
        allergens: ['peanuts'],
        ingredients: ['seafood'],
      },
    };

    it('create diet plan correctly', async () => {
      const result = await service.createDietPlan(userId, type, preferences);

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.type).toBe(type);
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
      expect(result.targetCalories).toBeDefined();
      expect(result.macroRatios).toBeDefined();
      expect(result.restrictions).toEqual(preferences.restrictions);
      expect(result.meals).toBeDefined();
      expect(result.weeklyPlan).toBeDefined();
      expect(result.progress).toBeDefined();
    });
  });

  describe('recognizeFood', () => {
    const imageData = {
      url: 'test-image.jpg',
      width: 800,
      height: 600,
      format: 'jpeg',
    };

    it('recognize food from image correctly', async () => {
      const result = await service.recognizeFood(imageData);

      expect(result).toBeDefined();
      expect(result.image).toEqual(imageData);
      expect(result.recognizedItems).toBeDefined();
      expect(result.nutritionEstimate).toBeDefined();
      expect(result.processingTime).toBeDefined();
      expect(result.recognitionMethod).toBe('ai');
      expect(result.verificationStatus).toBe('verified');
    });
  });

  describe('generateRecommendations', () => {
    const userId = 'test-user';

    it('generate nutrition recommendations correctly', async () => {
      const result = await service.generateRecommendations(userId);

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.type).toBeDefined();
      expect(result.context).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.mealSuggestions).toBeDefined();
    });
  });
});
