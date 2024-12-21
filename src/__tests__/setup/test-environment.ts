import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

export class TestEnvironment {
  private mongod: MongoMemoryServer;

  constructor() {
    this.mongod = new MongoMemoryServer({
      binary: {
        version: '6.0.4',
      },
    });
  }

  async setup() {
    await this.mongod.start();
    const uri = this.mongod.getUri();
    await mongoose.connect(uri);
  }

  async teardown() {
    await mongoose.disconnect();
    await this.mongod.stop();
  }
}

export const testEnv = new TestEnvironment();
