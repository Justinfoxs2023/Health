import { LevelService } from './level.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserLevel, Specialization } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LevelService', () => {
  let service: LevelService;
  let levelRepository: Repository<UserLevel>;
  let specializationRepository: Repository<Specialization>;

  const mockLevelRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockSpecializationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelService,
        {
          provide: getRepositoryToken(UserLevel),
          useValue: mockLevelRepository,
        },
        {
          provide: getRepositoryToken(Specialization),
          useValue: mockSpecializationRepository,
        },
      ],
    }).compile();

    service = module.get<LevelService>(LevelService);
    levelRepository = module.get<Repository<UserLevel>>(getRepositoryToken(UserLevel));
    specializationRepository = module.get<Repository<Specialization>>(
      getRepositoryToken(Specialization),
    );
  });

  describe('addExperience', () => {
    it('add experience and level up when threshold reached', async () => {
      const userId = '1';
      const exp = 1000;

      const mockLevelSystem = {
        currentLevel: {
          level: 1,
          exp: 500,
          nextLevelExp: 1000,
        },
        experience: 500,
        totalExp: 500,
      };

      const mockNextLevel = {
        level: 2,
        exp: 0,
        nextLevelExp: 2000,
        featureUnlocks: [],
      };

      jest.spyOn(service as any, 'getLevelSystem').mockResolvedValue(mockLevelSystem);
      mockLevelRepository.findOne.mockResolvedValue(mockNextLevel);

      await service.addExperience(userId, exp);

      expect(mockLevelSystem.experience).toBe(0); // Reset after level up
      expect(mockLevelSystem.totalExp).toBe(1500);
      expect(mockLevelSystem.currentLevel.level).toBe(2);
    });
  });

  describe('checkModuleAccess', () => {
    it('check if module is unlocked', async () => {
      const userId = '1';
      const moduleType = 'health_tracking';

      const mockLevelSystem = {
        unlockedModules: ['health_tracking', 'exercise'],
      };

      jest.spyOn(service as any, 'getLevelSystem').mockResolvedValue(mockLevelSystem);

      const result = await service.checkModuleAccess(userId, moduleType);
      expect(result).toBe(true);
    });
  });
});
