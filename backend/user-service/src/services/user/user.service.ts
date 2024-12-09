@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Redis) private redis: RedisClient,
    @inject(TYPES.UserRepository) private userRepo: UserRepository
  ) {}

  async findById(id: string): Promise<User> {
    // 实现用户查询逻辑
  }

  async updateProfile(id: string, data: UpdateProfileDTO): Promise<User> {
    // 实现资料更新逻辑
  }
} 