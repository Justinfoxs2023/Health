import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common/interfaces';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { rootMongooseTestModule, closeMongoConnection } from './utils/test-helpers';

describe('ComponentController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        rootMongooseTestModule(),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await closeMongoConnection();
  });

  describe('/components', () => {
    const testComponent = {
      name: 'test-component',
      version: '1.0.0',
      config: {
        props: {},
        styles: {},
        events: [],
      },
    };

    it('(POST) should create component', () => {
      return request(app.getHttpServer()).post('/components').send(testComponent).expect(201);
    });

    it('(GET) should return all components', () => {
      return request(app.getHttpServer())
        .get('/components')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('(GET) should return active components', async () => {
      const response = await request(app.getHttpServer())
        .get('/components')
        .query({ status: 'active' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.every(comp => comp.status === 'active')).toBeTruthy();
    });
  });
});
