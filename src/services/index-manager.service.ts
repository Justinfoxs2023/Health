import { DatabaseService } from './database.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '../utils/logger';

interface IndexConfig {
  /** collection 的描述 */
    collection: string;
  /** indexes 的描述 */
    indexes: {
    fields: { key: string: 1  1  2dsphere };
    options?: {
      unique?: boolean;
      sparse?: boolean;
      expireAfterSeconds?: number;
      partialFilterExpression?: any;
    };
  }[];
}

@Injectable()
export class IndexManagerService implements OnModuleInit {
  private readonly logger = new Logger('IndexManagerService');

  // 定义所有集合的索引配置
  private readonly indexConfigs: IndexConfig[] = [
    // 用户集合索引
    {
      collection: 'users',
      indexes: [
        {
          fields: { email: 1 },
          options: { unique: true },
        },
        {
          fields: { username: 1 },
          options: { unique: true },
        },
        {
          fields: { createdAt: 1 },
        },
      ],
    },
    // 健康数据集合索引
    {
      collection: 'health_records',
      indexes: [
        {
          fields: { userId: 1, recordDate: -1 },
        },
        {
          fields: { recordType: 1, recordDate: -1 },
        },
        {
          fields: { location: '2dsphere' },
        },
      ],
    },
    // 运动数据集合索引
    {
      collection: 'exercise_records',
      indexes: [
        {
          fields: { userId: 1, startTime: -1 },
        },
        {
          fields: { exerciseType: 1, startTime: -1 },
        },
        {
          fields: { location: '2dsphere' },
        },
      ],
    },
    // 饮食记录集合索引
    {
      collection: 'diet_records',
      indexes: [
        {
          fields: { userId: 1, mealTime: -1 },
        },
        {
          fields: { foodType: 1, mealTime: -1 },
        },
      ],
    },
    // 社交内容集合索引
    {
      collection: 'posts',
      indexes: [
        {
          fields: { userId: 1, createdAt: -1 },
        },
        {
          fields: { tags: 1, createdAt: -1 },
        },
        {
          fields: { content: 'text' },
        },
      ],
    },
    // 评论集合索引
    {
      collection: 'comments',
      indexes: [
        {
          fields: { postId: 1, createdAt: -1 },
        },
        {
          fields: { userId: 1, createdAt: -1 },
        },
      ],
    },
    // 通知集合索引
    {
      collection: 'notifications',
      indexes: [
        {
          fields: { userId: 1, createdAt: -1 },
        },
        {
          fields: { type: 1, createdAt: -1 },
        },
        {
          fields: { read: 1, createdAt: -1 },
        },
      ],
    },
    // 专家咨询集合索引
    {
      collection: 'consultations',
      indexes: [
        {
          fields: { userId: 1, scheduledTime: -1 },
        },
        {
          fields: { expertId: 1, scheduledTime: -1 },
        },
        {
          fields: { status: 1, scheduledTime: -1 },
        },
      ],
    },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  async onModuleInit() {
    await this.createIndexes();
  }

  private async createIndexes() {
    for (const config of this.indexConfigs) {
      const collection = this.dbService.getCollection(config.collection);

      for (const indexDef of config.indexes) {
        try {
          await collection.createIndex(indexDef.fields, indexDef.options);
          this.logger.info(`Created index for ${config.collection}:`, indexDef.fields);
        } catch (error) {
          this.logger.error(`Error creating index for ${config.collection}:`, error);
        }
      }
    }
  }

  // 分析集合索引使用情况
  async analyzeIndexUsage(collectionName: string) {
    try {
      const collection = this.dbService.getCollection(collectionName);
      const indexStats = await collection.aggregate([{ $indexStats: {} }]).toArray();

      return indexStats;
    } catch (error) {
      this.logger.error(`Error analyzing index usage for ${collectionName}:`, error);
      throw error;
    }
  }

  // 删除未使用的索引
  async removeUnusedIndexes(collectionName: string, minAccessCount = 0) {
    try {
      const indexStats = await this.analyzeIndexUsage(collectionName);
      const collection = this.dbService.getCollection(collectionName);

      for (const stat of indexStats) {
        if (stat.accesses.ops <= minAccessCount && stat.name !== '_id_') {
          await collection.dropIndex(stat.name);
          this.logger.info(`Dropped unused index ${stat.name} from ${collectionName}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error removing unused indexes for ${collectionName}:`, error);
      throw error;
    }
  }

  // 优化特定查询的索引
  async optimizeQueryIndex(collectionName: string, query: any, sort: any = {}) {
    try {
      const collection = this.dbService.getCollection(collectionName);
      const explain = await collection.find(query).sort(sort).explain('executionStats');

      // 分析查询性能
      const { executionStats } = explain;
      if (executionStats.totalDocsExamined > executionStats.nReturned * 3) {
        // 如果扫描的文档数远大于返回的文档数，建议创建新索引
        const indexFields = { ...query, ...sort };
        await collection.createIndex(indexFields);
        this.logger.info(`Created optimized index for query in ${collectionName}:`, indexFields);
      }
    } catch (error) {
      this.logger.error(`Error optimizing query index for ${collectionName}:`, error);
      throw error;
    }
  }
}
