import { ConfigService } from '@nestjs/config';
import { FamilyMember } from '../entities/family-member.entity';
import { Reward } from '../entities/reward.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserGrowth } from '../entities/user-growth.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_NAME', 'health_platform'),
  entities: [UserGrowth, FamilyMember, Reward],
  synchronize: configService.get('NODE_ENV') !== 'production',
});
