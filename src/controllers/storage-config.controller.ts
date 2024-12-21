import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';

import { CacheManager } from '@/services/cache/cache-manager.service';
import { IStorageConfig, ICacheConfig } from '@/types/storage-config';
import { S3StorageService } from '@/services/storage/s3-storage.service';

@Controller()
export class StorageConfigController {
  constructor(
    private readonly storageService: S3StorageService,
    private readonly cacheManager: CacheManager,
  ) {}

  @Get()
  async getConfig(): Promise<{ storage: IStorageConfig; cache: ICacheConfig }> {
    // 从配置服务或数据库获取配置
    return {
      storage: this.storageService.getConfig(),
      cache: this.cacheManager.getConfig(),
    };
  }

  @Put()
  async updateConfig(
    @Body() config: { storage: IStorageConfig; cache: ICacheConfig },
  ): Promise<boolean> {
    // 更新配置
    await this.storageService.updateConfig(config.storage);
    await this.cacheManager.updateConfig(config.cache);
    return true;
  }

  @Post()
  async testConnection(): Promise<boolean> {
    // 测试存储服务连接
    try {
      await this.storageService.exists('test.txt');
      return true;
    } catch (error) {
      return false;
    }
  }
}
