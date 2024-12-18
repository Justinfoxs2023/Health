import { ILogger } from '../../types/logger';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from '../user.service';
import { ValidationError } from '../../utils/errors';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let logger: jest.Mocked<ILogger>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    userService = new UserService(logger, userRepository);
  });

  describe('createUser', () => {
    it('create user successfully', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'password123',
        username: 'testuser',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue({
        id: '1',
        ...dto,
        role: 'USER',
      });

      const result = await userService.createUser(dto);

      expect(result).toBeDefined();
      expect(result.email).toBe(dto.email);
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('throw error if email exists', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'password123',
        username: 'testuser',
      };

      userRepository.findByEmail.mockResolvedValue({ id: '1' } as any);

      await expect(userService.createUser(dto)).rejects.toThrow(ValidationError);
    });
  });
});
