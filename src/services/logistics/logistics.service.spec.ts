import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { IShipmentStatus, IShipmentItem } from '../../types/logistics.types';
import { LogisticsOrder, ILogisticsProvider } from '../../entities/logistics.entity';
import { LogisticsService } from './logistics.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';

describe('LogisticsService', () => {
  let service: LogisticsService;
  let orderRepo: Repository<LogisticsOrder>;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockOrderRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogisticsService,
        {
          provide: getRepositoryToken(LogisticsOrder),
          useValue: mockOrderRepo,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<LogisticsService>(LogisticsService);
    orderRepo = module.get<Repository<LogisticsOrder>>(getRepositoryToken(LogisticsOrder));
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('createShipment', () => {
    it('应该创建物流订单', async () => {
      const item: IShipmentItem = {
        id: '1',
        name: '健康监测仪',
        quantity: 1,
        weight: 0.5,
        volume: 0.001,
      };

      const address = {
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        address: 'XX街道XX号',
      };

      mockHttpService.post.mockReturnValue(
        of({
          data: {
            orderId: 'SF123456789',
            trackingNumber: 'SF123456789',
            status: ShipmentStatus.CREATED,
          },
        }),
      );

      const result = await service.createShipment(item, address);

      expect(result.orderId).toBeDefined();
      expect(result.trackingNumber).toBeDefined();
      expect(result.status).toBe(ShipmentStatus.CREATED);
    });
  });

  describe('trackShipment', () => {
    it('应该追踪物流状态', async () => {
      const trackingNumber = 'SF123456789';

      mockHttpService.get.mockReturnValue(
        of({
          data: {
            status: ShipmentStatus.IN_TRANSIT,
            location: '深圳转运中心',
            timestamp: new Date(),
            details: [
              {
                status: ShipmentStatus.CREATED,
                location: '深圳',
                timestamp: new Date(),
              },
            ],
          },
        }),
      );

      const result = await service.trackShipment(trackingNumber);

      expect(result.status).toBe(ShipmentStatus.IN_TRANSIT);
      expect(result.details).toBeDefined();
      expect(result.details).toHaveLength(1);
    });
  });
});
