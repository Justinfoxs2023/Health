import * as mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common/interfaces';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Component, ComponentSchema } from '@/modules/miniprogram/schemas/component.schema';

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      return {
        uri: mongoUri,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ...options,
      };
    },
  });

export const testMongooseModules = [
  MongooseModule.forFeature([{ name: Component.name, schema: ComponentSchema }]),
];

export const createTestComponent = () => ({
  name: `test-component-${Date.now()}`,
  version: '1.0.0',
  config: {
    props: {},
    styles: {},
    events: [],
  },
  status: 'active',
});

export async function createTestingModule(imports: any[]): Promise<TestingModule> {
  try {
    return Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        ...imports,
      ],
    }).compile();
  } catch (error) {
    console.error('Error in createTestingModule:', error);
    throw error;
  }
}

export async function createTestingApp(module: TestingModule): Promise<INestApplication> {
  try {
    const app = module.createNestApplication();
    await app.init();
    return app;
  } catch (error) {
    console.error('Error in createTestingApp:', error);
    throw error;
  }
}

export const clearDatabase = async () => {
  if (mongoose.connection) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};

export const closeMongoConnection = async () => {
  if (mongod) {
    await mongod.stop();
  }
};
