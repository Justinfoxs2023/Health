import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../services/common/prisma.service';
import { LoggerService } from '../services/common/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaService, LoggerService],
  exports: [PrismaService, LoggerService]
})
export class BaseModule {} 