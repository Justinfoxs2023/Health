import { ConfigModule } from '@nestjs/config';
import { LoggerService } from '../services/common/logger.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '../services/common/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaService, LoggerService],
  exports: [PrismaService, LoggerService],
})
export class BaseModule {}
