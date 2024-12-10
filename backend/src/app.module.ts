import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 导入模型
import { UserRelation } from './schemas/UserRelation';
import { Favorite } from './schemas/Favorite';
import { Timeline } from './schemas/Timeline';
import { Activity } from './schemas/Activity';
import { Notification } from './schemas/Notification';

// 导入服务
import { UserInteractionService } from './services/UserInteractionService';
import { ActivityService } from './services/ActivityService';
import { NotificationService } from './services/NotificationService';
import { CacheService } from './services/CacheService';

// 导入控制器
import { UserInteractionController } from './controllers/UserInteractionController';
import { ActivityController } from './controllers/ActivityController';
import { NotificationController } from './controllers/NotificationController';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        config: {
          url: configService.get<string>('REDIS_URI'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: UserRelation.name, schema: UserRelation },
      { name: Favorite.name, schema: Favorite },
      { name: Timeline.name, schema: Timeline },
      { name: Activity.name, schema: Activity },
      { name: Notification.name, schema: Notification },
    ]),
  ],
  controllers: [
    UserInteractionController,
    ActivityController,
    NotificationController,
  ],
  providers: [
    UserInteractionService,
    ActivityService,
    NotificationService,
    CacheService,
  ],
  exports: [
    UserInteractionService,
    ActivityService,
    NotificationService,
    CacheService,
  ],
})
export class AppModule {} 