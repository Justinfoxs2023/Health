import { ParticipationContextService } from './participation-context.service';
import { ParticipationType, IParticipationContext } from '../../types/gamification/base.types';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserGameProfile } from '../../entities/gamification';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ParticipationContextService', () => {
  let service: ParticipationContextService;
  let userProfileRepo: Repository<UserGameProfile>;

  const mockUserProfileRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipationContextService,
        {
          provide: getRepositoryToken(UserGameProfile),
          useValue: mockUserProfileRepo,
        },
      ],
    }).compile();

    service = module.get<ParticipationContextService>(ParticipationContextService);
    userProfileRepo = module.get<Repository<UserGameProfile>>(getRepositoryToken(UserGameProfile));
  });

  describe('个人参与场景', () => {
    it('应该创建个人参与上下文', async () => {
      const userId = '1';
      const preferences = {
        privacyLevel: 'private' as const,
        notificationSettings: {
          achievements: true,
          levelUp: true,
          challenges: false,
        },
        displaySettings: {
          showRank: false,
          showAchievements: true,
          showProgress: true,
        },
      };

      const context = await service.createPersonalContext(userId, preferences);

      expect(context.type).toBe('personal');
      expect(context.scope.personal).toBeDefined();
      expect(context.scope.personal?.userId).toBe(userId);
      expect(context.scope.personal?.preferences).toEqual(preferences);
    });
  });

  describe('家庭参与场景', () => {
    it('应该创建家庭参与上下文', async () => {
      const familyId = 'family1';
      const userId = '1';
      const role = 'guardian' as const;
      const members = ['2', '3'];

      const context = await service.createFamilyContext(familyId, userId, role, members);

      expect(context.type).toBe('family');
      expect(context.scope.family).toBeDefined();
      expect(context.scope.family?.familyId).toBe(familyId);
      expect(context.scope.family?.role).toBe(role);
      expect(context.scope.family?.members).toEqual(members);
    });

    it('应该验证家庭成员权限', async () => {
      const familyId = 'family1';
      const guardianId = '1';
      const dependentId = '2';

      const canManage = await service.checkFamilyPermission(
        familyId,
        guardianId,
        'manage_dependent',
        dependentId,
      );

      expect(canManage).toBe(true);
    });
  });

  describe('社群参与场景', () => {
    it('应该创建社群参与上下文', async () => {
      const groupId = 'group1';
      const userId = '1';
      const role = 'admin' as const;

      const context = await service.createSocialContext(groupId, userId, role);

      expect(context.type).toBe('social');
      expect(context.scope.social).toBeDefined();
      expect(context.scope.social?.groupId).toBe(groupId);
      expect(context.scope.social?.role).toBe(role);
    });

    it('应该验证群组成员权限', async () => {
      const groupId = 'group1';
      const adminId = '1';
      const memberId = '2';

      const canModerate = await service.checkGroupPermission(groupId, adminId, 'moderate_content');

      expect(canModerate).toBe(true);
    });
  });

  describe('参与场景切换', () => {
    it('应该能够切换参与场景', async () => {
      const userId = '1';
      const fromContext: IParticipationContext = {
        type: 'personal',
        scope: {
          personal: {
            userId,
            preferences: {
              privacyLevel: 'private',
              notificationSettings: {
                achievements: true,
                levelUp: true,
                challenges: false,
              },
              displaySettings: {
                showRank: false,
                showAchievements: true,
                showProgress: true,
              },
            },
          },
        },
      };

      const toContext: IParticipationContext = {
        type: 'family',
        scope: {
          family: {
            familyId: 'family1',
            role: 'guardian',
            members: ['2', '3'],
          },
        },
      };

      const result = await service.switchContext(userId, fromContext, toContext);

      expect(result.success).toBe(true);
      expect(result.newContext).toEqual(toContext);
    });
  });
});
