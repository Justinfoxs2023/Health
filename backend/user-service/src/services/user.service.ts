import { ILogger } from '../types/logger';
import { IUser, ICreateUserDTO } from '../types/interfaces/user.interface';
import { Role } from '../types/enums/role.enum';
import { TYPES } from '../di/types';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword } from '../utils/crypto';
import { injectable, inject } from 'inversify';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
  ) {}

  async createUser(dto: ICreateUserDTO): Promise<IUser> {
    try {
      const hashedPassword = await hashPassword(dto.password);
      const user = await this.userRepository.create({
        ...dto,
        password: hashedPassword,
        roles: [Role.USER],
      });

      this.logger.info(`用户创建成功: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error('创建用户失败', error);
      throw error;
    }
  }
}
