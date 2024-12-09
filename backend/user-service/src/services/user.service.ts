import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { User, CreateUserDTO } from '../types/interfaces/user.interface';
import { UserRepository } from '../repositories/user.repository';
import { Logger } from '../types/logger';
import { Role } from '../types/enums/role.enum';
import { hashPassword } from '../utils/crypto';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async createUser(dto: CreateUserDTO): Promise<User> {
    try {
      const hashedPassword = await hashPassword(dto.password);
      const user = await this.userRepository.create({
        ...dto,
        password: hashedPassword,
        roles: [Role.USER]
      });

      this.logger.info(`用户创建成功: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error('创建用户失败', error);
      throw error;
    }
  }
} 