import mongoose from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

let mongod: MongoMemoryServer;

// 全局测试配置
beforeAll(async () => {
  // 创建内存数据库实例
  mongod = await MongoMemoryServer.create({
    binary: {
      version: '6.0.4',
    },
  });
  const uri = mongod.getUri();

  // 连接到测试数据库
  await mongoose.connect(uri);
});

// 清理测试数据
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// 断开连接并关闭
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// 全局测试工具函数
global.createTestId = () => new mongoose.Types.ObjectId().toString();
