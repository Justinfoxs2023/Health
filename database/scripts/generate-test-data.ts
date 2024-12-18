import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';

import { config } from '@/config';

/**
 * 测试数据生成器类
 */
class TestDataGenerator {
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(config.mongodb.uri);
  }

  /**
   * 生成测试数据
   */
  async generate() {
    try {
      await this.client.connect();
      const db = this.client.db(config.mongodb.dbName);

      console.log('开始生成测试数据...');

      // 生成用户数据
      await this.generateUsers(db);

      // 生成健康记录
      await this.generateHealthRecords(db);

      // 生成AI分析结果
      await this.generateAIAnalysis(db);

      console.log('测试数据生成完成');
    } catch (error) {
      console.error('Error in generate-test-data.ts:', '生成测试数据失败:', error);
      throw error;
    } finally {
      await this.client.close();
    }
  }

  /**
   * 生成用户测试数据
   */
  private async generateUsers(db: any) {
    const users = [];

    for (let i = 0; i < 100; i++) {
      users.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        status: 'active',
        profile: {
          name: faker.person.fullName(),
          age: faker.number.int({ min: 18, max: 80 }),
          gender: faker.helpers.arrayElement(['male', 'female']),
          height: faker.number.int({ min: 150, max: 190 }),
          weight: faker.number.int({ min: 45, max: 100 }),
        },
        createdAt: faker.date.past(),
      });
    }

    await db.collection('users').insertMany(users);
    console.log(`已生成 ${users.length} 条用户数据`);
  }

  /**
   * 生成健康记录测试数据
   */
  private async generateHealthRecords(db: any) {
    const users = await db.collection('users').find().toArray();
    const records = [];

    for (const user of users) {
      // 生成最近30天的记录
      for (let i = 0; i < 30; i++) {
        records.push({
          userId: user._id,
          type: faker.helpers.arrayElement(['vital_signs', 'exercise', 'diet', 'sleep']),
          data: {
            value: faker.number.float({ min: 60, max: 180 }),
            unit: faker.helpers.arrayElement(['bpm', 'kg', 'steps', 'hours']),
            metadata: {
              location: faker.location.city(),
              device: faker.helpers.arrayElement(['smartwatch', 'phone', 'scale']),
            },
          },
          timestamp: faker.date.recent({ days: 30 }),
        });
      }
    }

    await db.collection('health_records').insertMany(records);
    console.log(`已生成 ${records.length} 条健康记录`);
  }

  /**
   * 生成AI分析结果测试数据
   */
  private async generateAIAnalysis(db: any) {
    const users = await db.collection('users').find().toArray();
    const analysis = [];

    for (const user of users) {
      analysis.push({
        userId: user._id,
        type: faker.helpers.arrayElement([
          'food_recognition',
          'health_assessment',
          'recommendation',
        ]),
        results: {
          predictions: Array(3)
            .fill(null)
            .map(() => faker.lorem.word()),
          confidence: faker.number.float({ min: 0.6, max: 0.99 }),
          recommendations: Array(3)
            .fill(null)
            .map(() => faker.lorem.sentence()),
        },
        modelInfo: {
          modelId: faker.string.uuid(),
          version: '1.0.0',
        },
        createdAt: faker.date.recent(),
      });
    }

    await db.collection('ai_analysis').insertMany(analysis);
    console.log(`已生成 ${analysis.length} 条AI分析结果`);
  }
}

// 执行数据生成
const generator = new TestDataGenerator();
generator.generate();
