import { DistributedCacheService } from './distributed-cache.service';
import { LocalCacheService } from './local-cache.service';
import { Module } from '@nestjs/common';
import { MultiLevelCacheService } from './multi-level-cache.service';

@Module({
  providers: [LocalCacheService, DistributedCacheService, MultiLevelCacheService],
  exports: [MultiLevelCacheService],
})
export class CacheModule {}
