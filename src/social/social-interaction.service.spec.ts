import { GamificationService } from '../services/gamification.service';
import { Repository } from 'typeorm';
import { SocialInteraction } from '../entities/social/social-interaction.entity';
import { SocialInteractionService } from './social-interaction.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SocialInteractionService', () => {
  let service: SocialInteractionService;
  let repository: Repository<SocialInteraction>;
  let gamificationService: GamificationService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockGamificationService = {
    updateProgress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialInteractionService,
        {
          provide: getRepositoryToken(SocialInteraction),
          useValue: mockRepository,
        },
        {
          provide: GamificationService,
          useValue: mockGamificationService,
        },
      ],
    }).compile();

    service = module.get<SocialInteractionService>(SocialInteractionService);
    repository = module.get<Repository<SocialInteraction>>(getRepositoryToken(SocialInteraction));
    gamificationService = module.get<GamificationService>(GamificationService);
  });

  describe('createPost', () => {
    it('create a social post and update gamification progress', async () => {
      const userId = '1';
      const postData = {
        type: 'post',
        content: {
          text: 'Test post',
          media: [],
        },
        visibility: {
          scope: 'public',
        },
      };

      const mockPost = {
        id: '1',
        userId,
        ...postData,
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0,
        },
        createdAt: new Date(),
      };

      mockRepository.save.mockResolvedValue(mockPost);

      const result = await service.createPost(userId, postData);

      expect(result).toEqual(mockPost);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          ...postData,
        }),
      );
      expect(mockGamificationService.updateProgress).toHaveBeenCalledWith(userId, 'social_post', 1);
    });
  });

  describe('getPostsByUser', () => {
    it('return user posts with engagement stats', async () => {
      const userId = '1';
      const mockPosts = [
        {
          id: '1',
          type: 'post',
          content: { text: 'Test post' },
          engagement: {
            likes: 5,
            comments: 3,
            shares: 1,
          },
        },
      ];

      mockRepository.find.mockResolvedValue(mockPosts);

      const result = await service.getPostsByUser(userId);

      expect(result).toEqual(mockPosts);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    });
  });
});
