import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Logger } from '../logger.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger
  ) {}

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId }
    });
  }

  // 其他用户相关方法...
} 