import { Component } from '../schemas/component.schema';
import { ComponentService } from '../services/component.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { rootMongooseTestModule, closeMongoConnection } from '@test/utils/test-helpers';

describe('ComponentService Performance Tests', () => {
  let service: ComponentService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule()],
      providers: [
        ComponentService,
        {
          provide: getModelToken(Component.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ComponentService>(ComponentService);
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('handle bulk component registration efficiently', async () => {
    const startTime = Date.now();
    const components = Array(100)
      .fill(null)
      .map((_, index) => ({
        name: `test-component-${index}`,
        version: '1.0.0',
        config: {
          props: {},
          styles: {},
          events: [],
        },
      }));

    for (const component of components) {
      await service.registerComponent(component.name, {}, component);
    }

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    // 性能基准：批量注册100个组件应该在5秒内完成
    expect(executionTime).toBeLessThan(5000);
  });

  it('retrieve components with acceptable latency', async () => {
    const startTime = Date.now();

    await service.getAllComponents();

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    // 性能基准：获取所有组件列表应该在1秒内完成
    expect(executionTime).toBeLessThan(1000);
  });

  it('handle concurrent requests efficiently', async () => {
    const startTime = Date.now();
    const concurrentRequests = 10;

    const promises = Array(concurrentRequests)
      .fill(null)
      .map(() => service.getAllComponents());

    await Promise.all(promises);

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    // 性能基准：10个并发请求应该在2秒内完成
    expect(executionTime).toBeLessThan(2000);
  });
});
