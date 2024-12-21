import {
  UserGameProfile,
  FeatureUnlock,
  ExpertContent,
  CustomProgram,
  ReviewTask,
  TeamChallenge,
  SocialInteraction,
} from '../entities/gamification';
import {
  UserLevelService,
  FeatureUnlockService,
  ParticipationContextService,
} from '../services/gamification';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseBackupModule } from './database-backup.module';
import { DatabaseHealthService } from './database-health.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserGameProfile,
      FeatureUnlock,
      ExpertContent,
      CustomProgram,
      ReviewTask,
      TeamChallenge,
      SocialInteraction,
    ]),
    DatabaseBackupModule,
  ],
  providers: [
    DatabaseHealthService,
    UserLevelService,
    FeatureUnlockService,
    ParticipationContextService,
  ],
  exports: [
    TypeOrmModule,
    DatabaseHealthService,
    UserLevelService,
    FeatureUnlockService,
    ParticipationContextService,
  ],
})
export class DatabaseModule {}
