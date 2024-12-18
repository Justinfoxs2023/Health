import { FeatureUnlockService } from '../features/feature-unlock.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserGameProfile, FeatureUnlock } from '../../entities/gamification';
import { UserLevelService } from '../levels/user-level.service';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUserProfileRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockFeatureRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('功能解锁与等级系统集成测试', () => {
  let module: TestingModule;
  let featureService: FeatureUnlockService;
  let levelService: UserLevelService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        FeatureUnlockService,
        UserLevelService,
        {
          provide: getRepositoryToken(UserGameProfile),
          useValue: mockUserProfileRepo,
        },
        {
          provide: getRepositoryToken(FeatureUnlock),
          useValue: mockFeatureRepo,
        },
      ],
    }).compile();

    featureService = module.get<FeatureUnlockService>(FeatureUnlockService);
    levelService = module.get<UserLevelService>(UserLevelService);
  });
});
