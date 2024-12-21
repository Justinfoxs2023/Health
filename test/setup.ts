import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

export class TestSetup {
  private static mongod: MongoMemoryServer;

  static async initializeTestEnvironment() {
    try {
      // 确保之前的实例被清理
      await this.cleanupTestEnvironment();

      // 创建新的数据库实例
      this.mongod = await MongoMemoryServer.create({
        binary: {
          version: '6.0.4',
        },
      });

      const uri = this.mongod.getUri();
      await mongoose.connect(uri);

      console.log('Test environment initialized successfully');
    } catch (error) {
      console.error('Error in setup.ts:', 'Failed to initialize test environment:', error);
      throw error;
    }
  }

  static async cleanupTestEnvironment() {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      if (this.mongod) {
        await this.mongod.stop();
      }
    } catch (error) {
      console.error('Error in setup.ts:', 'Failed to cleanup test environment:', error);
      throw error;
    }
  }
}
