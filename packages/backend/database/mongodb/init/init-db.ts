import { Logger } from '../../../src/utils/logger';
import { MongoClient, Db, IndexDirection, CreateIndexesOptions } from 'mongodb';

interface IndexConfig {
  /** collection 的描述 */
  collection: string;
  /** indexes 的描述 */
  indexes: Array<{
    key: { [key: string]: IndexDirection };
    options?: CreateIndexesOptions;
  }>;
}

const logger = new Logger('DatabaseInit');

export async function initializeDatabase(): Promise<void> {
  try {
    const client = await MongoClient.connect(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
    );

    const db = client.db(process.env.DB_NAME);

    // 初始化集合和索引
    await initializeCollections(db);
    await createIndexes(db);

    logger.info('数据库初始化完成');
    await client.close();
  } catch (error) {
    logger.error('数据库初始化失败:', error);
    throw error;
  }
}

async function initializeCollections(db: Db): Promise<void> {
  try {
    // 创建集合和验证规则
    const collections = [
      {
        name: 'users',
        validator: {
          /* ... */
        },
      },
      {
        name: 'health_records',
        validator: {
          /* ... */
        },
      },
      // ... 其他集合定义
    ];

    for (const collection of collections) {
      await db.createCollection(collection.name, {
        validator: collection.validator,
      });
    }
  } catch (error) {
    console.error('Error in initializeCollections:', error);
    throw error;
  }
}

async function createIndexes(db: Db): Promise<void> {
  try {
    const indexes: IndexConfig[] = [
      {
        collection: 'users',
        indexes: [
          {
            key: { email: 1 },
            options: { unique: true },
          },
          {
            key: { username: 1 },
            options: { unique: true },
          },
        ],
      },
      // ... 其他索引配置
    ];

    for (const index of indexes) {
      const collection = db.collection(index.collection);
      await Promise.all(
        index.indexes.map(idx => collection.createIndex(idx.key, idx.options || {})),
      );
    }
  } catch (error) {
    console.error('Error in createIndexes:', error);
    throw error;
  }
}
