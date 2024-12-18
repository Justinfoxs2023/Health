import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { LogisticsOrder, ILogisticsProvider } from '../entities/logistics.entity';
import { LogisticsService } from './logistics.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';

describe('LogisticsService', () => {
  let service: LogisticsService;
  let orderRepository: Repository<LogisticsOrder>;
  let providerRepository: Repository<ILogisticsProvider>;
  let httpService: HttpService;

  const mockOrderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockProviderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockHttpService = {
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
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(LogisticsProvider),
          useValue: mockProviderRepository,
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
    orderRepository = module.get<Repository<LogisticsOrder>>(getRepositoryToken(LogisticsOrder));
    providerRepository = module.get<Repository<ILogisticsProvider>>(
      getRepositoryToken(LogisticsProvider),
    );
    httpService = module.get<HttpService>(HttpService);
  });

  describe('createShipment', () => {
    it('create a logistics order', async () => {
      const mockItem = {
        id: '1',
        name: 'Test Item',
        quantity: 1,
        weight: 1,
        volume: 1,
      };

      const mockProvider = {
        id: '1',
        name: 'Test Provider',
        services: [{ code: 'standard' }],
      };

      const mockOrder = {
        id: '1',
        providerId: '1',
        serviceCode: 'standard',
        items: [mockItem],
      };

      mockProviderRepository.findOne.mockResolvedValue(mockProvider);
      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);

      const result = await service.createShipment(mockItem, '1');
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getShipmentStatus', () => {
    it('return shipment status', async () => {
      const mockOrder = {
        providerId: '1',
        trackingNumber: 'TRACK123',
      };

      const mockProvider = {
        trackingUrlTemplate: 'http://example.com/{tracking_number}',
      };

      const mockTrackingData = {
        status: 'delivered',
        location: 'Test Location',
      };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockProviderRepository.findOne.mockResolvedValue(mockProvider);
      mockHttpService.get.mockReturnValue(of({ data: mockTrackingData }));

      const result = await service.getShipmentStatus('TRACK123');
      expect(result.status).toBe('delivered');
    });
  });
});
