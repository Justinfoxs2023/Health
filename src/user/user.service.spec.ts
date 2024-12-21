import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user/user.entity';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findById', () => {
    it('return a user', async () => {
      const mockUser = {
        id: '1',
        username: 'test',
        email: 'test@example.com',
        role: 'user',
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('1');
      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow('User with ID 1 not found');
    });
  });

  describe('getUserLevel', () => {
    it('return user level', async () => {
      const mockUser = {
        id: '1',
        level: 5,
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserLevel('1');
      expect(result).toBe(5);
    });
  });
});
