import { JWTService } from '../auth/jwt.service';
import { monitoringService } from '../monitoring';

jest.mock('../monitoring');

describe('JWTService', () => {
  const mockUserId = '123';
  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    csrfToken: 'mock-csrf-token'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTokens', () => {
    it('应该生成访问令牌和刷新令牌', async () => {
      const tokens = await JWTService.generateTokens(mockUserId);
      
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(tokens).toHaveProperty('csrfToken');
      
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
      expect(typeof tokens.csrfToken).toBe('string');
    });

    it('应该在生成令牌时记录性能指标', async () => {
      const startTime = Date.now();
      await JWTService.generateTokens(mockUserId);
      const endTime = Date.now();

      expect(monitoringService.recordRequestPerformance)
        .toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
      
      const [recordedStart, recordedEnd] = (monitoringService.recordRequestPerformance as jest.Mock).mock.calls[0];
      expect(recordedStart).toBeGreaterThanOrEqual(startTime);
      expect(recordedEnd).toBeLessThanOrEqual(endTime);
    });
  });

  describe('verifyAccessToken', () => {
    it('应该验证有效的访问令牌', () => {
      const payload = JWTService.verifyAccessToken(mockTokens.accessToken, mockTokens.csrfToken);
      
      expect(payload).toHaveProperty('userId', mockUserId);
      expect(payload).toHaveProperty('type', 'access');
      expect(payload).toHaveProperty('csrfToken', mockTokens.csrfToken);
    });

    it('应该拒绝无效的访问令牌', () => {
      expect(() => {
        JWTService.verifyAccessToken('invalid-token', mockTokens.csrfToken);
      }).toThrow();

      expect(monitoringService.recordError).toHaveBeenCalled();
    });

    it('应该拒绝CSRF令牌不匹配的请求', () => {
      expect(() => {
        JWTService.verifyAccessToken(mockTokens.accessToken, 'wrong-csrf-token');
      }).toThrow('CSRF令牌不匹配');

      expect(monitoringService.recordError).toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('应该使用有效的刷新令牌生成新的访问令牌', async () => {
      const newTokens = await JWTService.refreshAccessToken(mockTokens.refreshToken);
      
      expect(newTokens).toHaveProperty('accessToken');
      expect(newTokens).toHaveProperty('refreshToken');
      expect(newTokens).toHaveProperty('csrfToken');
      
      expect(newTokens.accessToken).not.toBe(mockTokens.accessToken);
      expect(newTokens.refreshToken).not.toBe(mockTokens.refreshToken);
    });

    it('应该拒绝无效的刷新令牌', async () => {
      await expect(
        JWTService.refreshAccessToken('invalid-refresh-token')
      ).rejects.toThrow();

      expect(monitoringService.recordError).toHaveBeenCalled();
    });
  });

  describe('revokeRefreshToken', () => {
    it('应该成功撤销刷新令牌', async () => {
      await JWTService.revokeRefreshToken(mockUserId);
      
      // 验证令牌已被撤销
      await expect(
        JWTService.verifyRefreshToken(mockTokens.refreshToken)
      ).rejects.toThrow('刷新令牌已失效');
    });
  });

  describe('cleanupExpiredTokens', () => {
    it('应该清理过期的刷新令牌', async () => {
      await JWTService.cleanupExpiredTokens();
      
      // 验证清理操作已执行
      expect(monitoringService.recordRequestPerformance).toHaveBeenCalled();
    });
  });

  describe('错误���理', () => {
    it('应该正确处理数据库错误', async () => {
      const dbError = new Error('数据库连接失败');
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(dbError);

      await expect(
        JWTService.generateTokens(mockUserId)
      ).rejects.toThrow();

      expect(monitoringService.recordError).toHaveBeenCalledWith(
        dbError,
        expect.any(Object)
      );
    });

    it('应该正确处理网络错误', async () => {
      const networkError = new Error('网络请求失败');
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(networkError);

      await expect(
        JWTService.generateTokens(mockUserId)
      ).rejects.toThrow();

      expect(monitoringService.recordError).toHaveBeenCalledWith(
        networkError,
        expect.any(Object)
      );
    });
  });
}); 