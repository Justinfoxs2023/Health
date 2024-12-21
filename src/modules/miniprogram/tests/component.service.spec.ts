import {
  rootMongooseTestModule,
  closeMongoConnection,
  testMongooseModules,
  createTestComponent,
} from '@test/utils/test-helpers';
import { Component } from '../schemas/component.schema';
import { ComponentService } from '../services/component.service';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
descr;
ibe('ComponentService', () => {
  let service: ComponentService;
  let model: Model<Component>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), ...testMongooseModules],
      providers: [ComponentService],
    }).compile();

    service = module.get<ComponentService>(ComponentService);
    model = module.get<Model<Component>>(getModelToken(Component.name));
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    await model.deleteMany({});
  });

  describe('registerComponent', () => {
    it('register a new component', async () => {
      const testComponent = createTestComponent();
      await service.registerComponent(testComponent.name, {}, testComponent);

      const savedComponent = await model.findOne({ name: testComponent.name });
      expect(savedComponent).toBeDefined();
      expect(savedComponent.name).toBe(testComponent.name);
    });

    it('throw error if component already exists', async () => {
      const testComponent = createTestComponent();
      await service.registerComponent(testComponent.name, {}, testComponent);

      await expect(
        service.registerComponent(testComponent.name, {}, testComponent),
      ).rejects.toThrow();
    });
  });
});
