import { ConfigService } from '../../config/config.service';
import { DatabaseService } from '../../database/database.service';
import { LoggerService } from '../../logger/logger.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../transaction.service';
import { TransactionStatus, TransactionOptions } from '../transaction.interface';

describe('TransactionService', () => {
  let service: TransactionService;
  let loggerService: jest.Mocked<LoggerService>;
  let configService: jest.Mocked<ConfigService>;
  let dbService: jest.Mocked<DatabaseService>;
  let mockMetrics: {
    transactionDuration: jest.Mocked<any>;
    transactionErrors: jest.Mocked<any>;
    activeTransactions: jest.Mocked<any>;
    transactionRetries: jest.Mocked<any>;
    transactionTimeouts: jest.Mocked<any>;
    transactionSizes: jest.Mocked<any>;
  };

  beforeEach(async () => {
    // 创建模拟服务
    loggerService = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any;

    configService = {
      get: jest.fn().mockReturnValue(3),
    } as any;

    dbService = {
      beginTransaction: jest.fn().mockResolvedValue('test-transaction-id'),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockMetrics = {
      transactionDuration: { observe: jest.fn() },
      transactionErrors: { inc: jest.fn() },
      activeTransactions: {
        inc: jest.fn(),
        dec: jest.fn(),
        get: jest.fn().mockReturnValue({ values: [{ value: 1 }] }),
      },
      transactionRetries: { inc: jest.fn() },
      transactionTimeouts: { inc: jest.fn() },
      transactionSizes: { observe: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: LoggerService, useValue: loggerService },
        { provide: ConfigService, useValue: configService },
        { provide: DatabaseService, useValue: dbService },
        { provide: 'transaction_duration_seconds', useValue: mockMetrics.transactionDuration },
        { provide: 'transaction_errors_total', useValue: mockMetrics.transactionErrors },
        { provide: 'active_transactions', useValue: mockMetrics.activeTransactions },
        { provide: 'transaction_retries_total', useValue: mockMetrics.transactionRetries },
        { provide: 'transaction_timeouts_total', useValue: mockMetrics.transactionTimeouts },
        { provide: 'transaction_size_bytes', useValue: mockMetrics.transactionSizes },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);

    // 重置 Date.now 模拟
    jest.spyOn(Date, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('beginTransaction', () => {
    it('应该成功开始事务', async () => {
      const options: TransactionOptions = {
        timeout: 5000,
        isolationLevel: 'READ_COMMITTED',
      };

      const transactionId = await service.beginTransaction('test-transaction', options);

      expect(transactionId).toBe('test-transaction-id');
      expect(dbService.beginTransaction).toHaveBeenCalledWith('READ_COMMITTED');
      expect(mockMetrics.activeTransactions.inc).toHaveBeenCalled();
      expect(loggerService.info).toHaveBeenCalledWith(
        '开始事务: test-transaction',
        expect.any(Object),
      );
    });

    it('应该设置超时处理', async () => {
      jest.useFakeTimers();

      const options: TransactionOptions = { timeout: 1000 };
      const transactionId = await service.beginTransaction('test-transaction', options);

      jest.advanceTimersByTime(1000);

      expect(mockMetrics.transactionTimeouts.inc).toHaveBeenCalled();
      expect(dbService.rollbackTransaction).toHaveBeenCalledWith(transactionId);

      jest.useRealTimers();
    });
  });

  describe('commitTransaction', () => {
    it('应该成功提交事务', async () => {
      await service.beginTransaction('test-transaction');
      await service.commitTransaction('test-transaction-id');

      expect(dbService.commitTransaction).toHaveBeenCalledWith('test-transaction-id');
      expect(mockMetrics.activeTransactions.dec).toHaveBeenCalled();
      expect(mockMetrics.transactionDuration.observe).toHaveBeenCalled();
      expect(mockMetrics.transactionSizes.observe).toHaveBeenCalled();
    });

    it('应该处理提交错误', async () => {
      const error = new Error('提交错误');
      dbService.commitTransaction.mockRejectedValueOnce(error);

      await service.beginTransaction('test-transaction');
      await expect(service.commitTransaction('test-transaction-id')).rejects.toThrow('提交错误');

      expect(mockMetrics.transactionErrors.inc).toHaveBeenCalled();
      expect(loggerService.error).toHaveBeenCalledWith('事务错误', expect.any(Object));
    });
  });

  describe('rollbackTransaction', () => {
    it('应该成功回滚事务', async () => {
      await service.beginTransaction('test-transaction');
      await service.rollbackTransaction('test-transaction-id');

      expect(dbService.rollbackTransaction).toHaveBeenCalledWith('test-transaction-id');
      expect(mockMetrics.activeTransactions.dec).toHaveBeenCalled();
      expect(mockMetrics.transactionErrors.inc).toHaveBeenCalled();
    });

    it('应该处理回滚错误', async () => {
      const error = new Error('回滚错误');
      dbService.rollbackTransaction.mockRejectedValueOnce(error);

      await service.beginTransaction('test-transaction');
      await expect(service.rollbackTransaction('test-transaction-id')).rejects.toThrow('回滚错误');

      expect(mockMetrics.transactionErrors.inc).toHaveBeenCalled();
      expect(loggerService.error).toHaveBeenCalledWith('事务错误', expect.any(Object));
    });
  });

  describe('executeInTransaction', () => {
    it('应该成功执行事务操作', async () => {
      const operation = jest.fn().mockResolvedValue('result');
      const result = await service.executeInTransaction('test-transaction', operation);

      expect(result).toBe('result');
      expect(operation).toHaveBeenCalledWith('test-transaction-id');
      expect(dbService.commitTransaction).toHaveBeenCalled();
    });

    it('应该在操作失败时回滚事务', async () => {
      const error = new Error('操作错���');
      const operation = jest.fn().mockRejectedValue(error);

      await expect(service.executeInTransaction('test-transaction', operation)).rejects.toThrow(
        '操作错误',
      );

      expect(dbService.rollbackTransaction).toHaveBeenCalled();
    });

    it('应该在遇到死锁时重试事务', async () => {
      const deadlockError = new Error('deadlock detected');
      const operation = jest
        .fn()
        .mockRejectedValueOnce(deadlockError)
        .mockResolvedValueOnce('result');

      const result = await service.executeInTransaction('test-transaction', operation);

      expect(result).toBe('result');
      expect(operation).toHaveBeenCalledTimes(2);
      expect(mockMetrics.transactionRetries.inc).toHaveBeenCalled();
    });

    it('应该在达到最大重试次数后抛出错误', async () => {
      const deadlockError = new Error('deadlock detected');
      const operation = jest.fn().mockRejectedValue(deadlockError);
      const options: TransactionOptions = { retryCount: 2 };

      await expect(
        service.executeInTransaction('test-transaction', operation, options),
      ).rejects.toThrow('deadlock detected');

      expect(operation).toHaveBeenCalledTimes(3); // 初始尝试 + 2次重试
      expect(mockMetrics.transactionRetries.inc).toHaveBeenCalledTimes(2);
    });
  });

  describe('getTransactionStatus', () => {
    it('应该返回事务状态', async () => {
      await service.beginTransaction('test-transaction');
      const status = await service.getTransactionStatus('test-transaction-id');
      expect(status).toBe(TransactionStatus.PENDING);
    });

    it('应该在事务不存在时返回FAILED状态', async () => {
      const status = await service.getTransactionStatus('non-existent-id');
      expect(status).toBe(TransactionStatus.FAILED);
    });
  });

  describe('getTransactionMetadata', () => {
    it('应该返回事务元数据', async () => {
      await service.beginTransaction('test-transaction');
      const metadata = await service.getTransactionMetadata('test-transaction-id');

      expect(metadata).toEqual(
        expect.objectContaining({
          id: 'test-transaction-id',
          name: 'test-transaction',
          status: TransactionStatus.PENDING,
        }),
      );
    });

    it('应该在事务不存在时抛出错误', async () => {
      await expect(service.getTransactionMetadata('non-existent-id')).rejects.toThrow('事务不存在');
    });
  });

  describe('getActiveTransactionsCount', () => {
    it('应该返回活跃事务数量', () => {
      const count = service.getActiveTransactionsCount();
      expect(count).toBe(1);
    });
  });
});
