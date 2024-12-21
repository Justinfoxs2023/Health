import { Activity } from './schemas/Activity';
import { ActivityController } from './controllers/ActivityController';
import { ActivityService } from './services/ActivityService';
import { CacheService } from './services/CacheService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Favorite } from './schemas/Favorite';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification } from './schemas/Notification';
import { NotificationController } from './controllers/NotificationController';
import { NotificationService } from './services/NotificationService';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Timeline } from './schemas/Timeline';
import { UserInteractionController } from './controllers/UserInteractionController';
import { UserInteractionService } from './services/UserInteractionService';
import { UserRelation } from './schemas/UserRelation';

// 导入模型
// 导入服务
// 导入控制器

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
  controllers: [UserInteractionController, ActivityController, NotificationController],
  providers: [UserInteractionService, ActivityService, NotificationService, CacheService],
  exports: [UserInteractionService, ActivityService, NotificationService, CacheService],
})
export class AppModule {}
