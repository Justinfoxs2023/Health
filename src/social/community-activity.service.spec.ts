import { CommunityActivity } from '../entities/community-activity.entity';
import { CommunityActivityService } from './community-activity.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CommunityActivityService', () => {
  let service: CommunityActivityService;
  let repository: Repository<CommunityActivity>;
  let userService: UserService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockUserService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityActivityService,
        {
          provide: getRepositoryToken(CommunityActivity),
          useValue: mockRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<CommunityActivityService>(CommunityActivityService);
    repository = module.get<Repository<CommunityActivity>>(getRepositoryToken(CommunityActivity));
    userService = module.get<UserService>(UserService);
  });

  describe('createActivity', () => {
    it('create a community activity', async () => {
      const activityData = {
        type: 'health_workshop',
        title: 'Healthy Living Workshop',
        description: 'Learn about healthy living habits',
        duration: 7,
      };

      const mockActivity = {
        id: '1',
        ...activityData,
        status: 'upcoming',
        participants: [],
        rewards: {
          participation: 200,
          contribution: 500,
        },
      };

      mockRepository.create.mockReturnValue(mockActivity);
      mockRepository.save.mockResolvedValue(mockActivity);

      const result = await service.createActivity(activityData);

      expect(result).toEqual(mockActivity);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(activityData));
      expect(mockRepository.save).toHaveBeenCalledWith(mockActivity);
    });
  });

  describe('joinActivity', () => {
    it('allow user to join activity if eligible', async () => {
      const userId = '1';
      const activityId = '1';

      const mockUser = {
        id: userId,
        level: 5,
      };

      const mockActivity = {
        id: activityId,
        participants: [],
        requirements: {
          minLevel: 3,
        },
      };

      mockUserService.findById.mockResolvedValue(mockUser);
      mockRepository.findOne.mockResolvedValue(mockActivity);

      await service.joinActivity(userId, activityId);

      expect(mockRepository.update).toHaveBeenCalledWith(
        activityId,
        expect.objectContaining({
          participants: [userId],
        }),
      );
    });
  });
});
