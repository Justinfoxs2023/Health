import { CACHE_MANAGER } from '@nestjs/common';
import { CacheService } from './cache.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: any;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  describe('cacheUserGameData', () => {
    it('cache user game data', async () => {
      const userId = '1';
      const gameData = {
        level: 5,
        exp: 1000,
      };

      await service.cacheUserGameData(userId, gameData);

      expect(cacheManager.set).toHaveBeenCalledWith(
        `user:${userId}:game`,
        JSON.stringify(gameData),
        3600,
      );
    });
  });

  describe('getCachedGameData', () => {
    it('return cached game data', async () => {
      const userId = '1';
      const mockData = {
        level: 5,
        exp: 1000,
      };

      mockCacheManager.get.mockResolvedValue(JSON.stringify(mockData));

      const result = await service.getCachedGameData(userId);
      expect(result).toEqual(mockData);
    });

    it('return null when no cached data', async () => {
      const userId = '1';
      mockCacheManager.get.mockResolvedValue(null);

      const result = await service.getCachedGameData(userId);
      expect(result).toBeNull();
    });
  });
});
