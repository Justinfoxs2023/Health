import { LogisticsService } from '../services/logistics/logistics.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Transaction } from '../entities/commerce/transaction.entity';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  let logisticsService: LogisticsService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockLogisticsService = {
    createShipment: jest.fn(),
    getShipmentStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
        {
          provide: LogisticsService,
          useValue: mockLogisticsService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    logisticsService = module.get<LogisticsService>(LogisticsService);
  });

  describe('createTransaction', () => {
    it('create a transaction', async () => {
      const mockTransaction = {
        userId: '1',
        type: 'order',
        amount: 100,
        items: [
          {
            id: '1',
            name: 'Test Item',
            quantity: 1,
            price: 100,
          },
        ],
        payment: {
          method: 'alipay',
          status: 'pending',
        },
      };

      mockRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.createTransaction(mockTransaction);
      expect(result).toEqual(mockTransaction);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTransaction);
    });
  });

  describe('processPhysicalDelivery', () => {
    it('create shipment for physical item', async () => {
      const transactionId = '1';
      const mockTransaction = {
        id: transactionId,
        type: 'order',
        items: [
          {
            id: '1',
            type: 'physical',
            quantity: 1,
          },
        ],
        shipping: {
          address: {
            recipient: 'Test User',
            phone: '1234567890',
            address: 'Test Address',
          },
        },
      };

      const mockShipment = {
        trackingId: 'TRACK123',
      };

      mockRepository.findOne.mockResolvedValue(mockTransaction);
      mockLogisticsService.createShipment.mockResolvedValue(mockShipment);

      await service.processPhysicalDelivery(transactionId);

      expect(mockLogisticsService.createShipment).toHaveBeenCalled();
      expect(mockRepository.update).toHaveBeenCalledWith(
        transactionId,
        expect.objectContaining({
          shipping: expect.objectContaining({
            tracking: expect.objectContaining({
              trackingNumber: 'TRACK123',
            }),
          }),
        }),
      );
    });
  });
});
