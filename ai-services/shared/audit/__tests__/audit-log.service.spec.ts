import * as mongoose from 'mongoose';
import { AuditLogService } from '../audit-log.service';
import { SecurityConfig } from '../../security/security.config';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuditLogService', () => {
  let service: AuditLogService;

  beforeAll(async () => {
    // 连接测试数据库
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/health-test');
  });

  afterAll(async () => {
    // 清理数据库并断开连接
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditLogService],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);

    // 清理集合
    await mongoose.connection.collection('auditlogs').deleteMany({});
  });

  describe('log', () => {
    it('应该能够记录有效的审计日志', async () => {
      const logData = {
        userId: 'test-user',
        event: 'login',
        category: 'authentication',
        action: 'user login',
        status: 'success' as const,
        details: {
          ip: '192.168.1.1',
          browser: 'Chrome',
        },
        metadata: {
          ip: '192.168.1.1',
          userAgent: 'Chrome/96.0.4664.110',
          sessionId: 'test-session',
          requestId: 'test-request',
        },
      };

      const id = await service.log(logData);
      expect(id).toBeDefined();

      const logs = await service.query({ userId: logData.userId });
      expect(logs.logs).toHaveLength(1);
      expect(logs.logs[0].event).toBe(logData.event);
    });

    it('应该拒绝无效的事件类型', async () => {
      const logData = {
        userId: 'test-user',
        event: 'invalid-event',
        category: 'test',
        action: 'test action',
        status: 'success' as const,
      };

      await expect(service.log(logData)).rejects.toThrow();
    });

    it('应该正确处理敏感数据', async () => {
      const logData = {
        userId: 'test-user',
        event: 'data_modification',
        category: 'user',
        action: 'update password',
        status: 'success' as const,
        details: {
          password: 'secret123',
          email: 'test@example.com',
        },
        changes: [
          {
            field: 'password',
            oldValue: 'old-password',
            newValue: 'new-password',
          },
        ],
      };

      const id = await service.log(logData);
      const logs = await service.query({ userId: logData.userId });
      const log = logs.logs[0];

      expect(log.details.password).toBe('******');
      expect(log.changes[0].oldValue).toBe('******');
      expect(log.changes[0].newValue).toBe('******');
    });
  });

  describe('query', () => {
    beforeEach(async () => {
      // 准备测试数据
      const testLogs = Array(20)
        .fill(null)
        .map((_, index) => ({
          userId: `user-${index % 2}`,
          event: index % 2 === 0 ? 'login' : 'logout',
          category: 'authentication',
          action: index % 2 === 0 ? 'user login' : 'user logout',
          status: index % 3 === 0 ? 'success' : 'failure',
          timestamp: new Date(Date.now() - index * 60000), // 每条记录间隔1分钟
        }));

      for (const log of testLogs) {
        await service.log(log);
      }
    });

    it('应该支持分页查询', async () => {
      const result = await service.query({
        page: 1,
        pageSize: 10,
      });

      expect(result.logs).toHaveLength(10);
      expect(result.total).toBe(20);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('应该支持按用户ID过滤', async () => {
      const result = await service.query({
        userId: 'user-0',
      });

      expect(result.logs.every(log => log.userId === 'user-0')).toBe(true);
    });

    it('应该支持按事件类型过滤', async () => {
      const result = await service.query({
        event: 'login',
      });

      expect(result.logs.every(log => log.event === 'login')).toBe(true);
    });

    it('应该支持按状态过滤', async () => {
      const result = await service.query({
        status: 'success',
      });

      expect(result.logs.every(log => log.status === 'success')).toBe(true);
    });

    it('应该支持时间范围过滤', async () => {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - 5 * 60000); // 5分钟前

      const result = await service.query({
        startTime,
        endTime,
      });

      expect(
        result.logs.every(log => {
          const timestamp = new Date(log.timestamp);
          return timestamp >= startTime && timestamp <= endTime;
        }),
      ).toBe(true);
    });

    it('应该支持排序', async () => {
      const result = await service.query({
        sort: {
          field: 'timestamp',
          order: 'asc',
        },
      });

      const timestamps = result.logs.map(log => new Date(log.timestamp).getTime());
      const isSorted = timestamps.every((val, i) => !i || val >= timestamps[i - 1]);
      expect(isSorted).toBe(true);
    });
  });

  describe('getStats', () => {
    beforeEach(async () => {
      // 准备测试数据
      const testLogs = Array(50)
        .fill(null)
        .map((_, index) => ({
          userId: `user-${index % 5}`,
          event: ['login', 'logout', 'data_access'][index % 3],
          category: ['authentication', 'data', 'system'][index % 3],
          action: 'test action',
          status: ['success', 'failure', 'warning'][index % 3],
          timestamp: new Date(Date.now() - index * 60000),
        }));

      for (const log of testLogs) {
        await service.log(log);
      }
    });

    it('应该返回正确的统计信息', async () => {
      const stats = await service.getStats({});

      expect(stats.totalEvents).toBe(50);
      expect(Object.keys(stats.eventsByCategory)).toHaveLength(3);
      expect(Object.keys(stats.eventsByStatus)).toHaveLength(3);
      expect(stats.topUsers).toHaveLength(5);
      expect(stats.timeDistribution).toBeDefined();
    });

    it('应该支持时间范围过滤', async () => {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - 10 * 60000); // 10分钟前

      const stats = await service.getStats({
        startTime,
        endTime,
      });

      expect(stats.totalEvents).toBeLessThan(50);
    });

    it('应该支持用户过滤', async () => {
      const stats = await service.getStats({
        userId: 'user-0',
      });

      expect(stats.totalEvents).toBe(10); // 50/5个用户
      expect(stats.topUsers).toHaveLength(1);
      expect(stats.topUsers[0].userId).toBe('user-0');
    });
  });

  describe('export', () => {
    beforeEach(async () => {
      // 准备测试数据
      const testLogs = Array(10)
        .fill(null)
        .map((_, index) => ({
          userId: `user-${index}`,
          event: 'login',
          category: 'authentication',
          action: 'user login',
          status: 'success',
          timestamp: new Date(),
        }));

      for (const log of testLogs) {
        await service.log(log);
      }
    });

    it('应该能够导出CSV格式', async () => {
      const buffer = await service.export({ format: 'csv' });
      const csv = buffer.toString('utf8');

      expect(csv).toContain('timestamp,userId,event,category,action,status');
      expect(csv.split('\n').length).toBe(11); // 表头 + 10条记录
    });

    it('应该能够导出JSON格式', async () => {
      const buffer = await service.export({ format: 'json' });
      const json = JSON.parse(buffer.toString('utf8'));

      expect(Array.isArray(json)).toBe(true);
      expect(json).toHaveLength(10);
      expect(json[0]).toHaveProperty('userId');
      expect(json[0]).toHaveProperty('event');
    });

    it('应该支持过滤条件', async () => {
      const buffer = await service.export({
        format: 'json',
        userId: 'user-0',
      });
      const json = JSON.parse(buffer.toString('utf8'));

      expect(json).toHaveLength(1);
      expect(json[0].userId).toBe('user-0');
    });
  });

  describe('清理过期日志', () => {
    it('应该能够清理过期日志', async () => {
      // 准备测试数据
      const oldLogs = Array(5)
        .fill(null)
        .map((_, index) => ({
          userId: `user-${index}`,
          event: 'login',
          category: 'authentication',
          action: 'user login',
          status: 'success',
          timestamp: new Date(
            Date.now() - (SecurityConfig.AUDIT_LOG.retention + 24 * 60 * 60 * 1000),
          ), // 比保留期限多一天
        }));

      const newLogs = Array(5)
        .fill(null)
        .map((_, index) => ({
          userId: `user-${index}`,
          event: 'login',
          category: 'authentication',
          action: 'user login',
          status: 'success',
          timestamp: new Date(), // 当前时间
        }));

      // 插入数据
      for (const log of [...oldLogs, ...newLogs]) {
        await service.log(log);
      }

      // 手动触发清理
      await (service as any).cleanupOldLogs();

      // 验证结果
      const remainingLogs = await service.query({});
      expect(remainingLogs.total).toBe(5); // 只剩下新的日志
    });
  });
});
