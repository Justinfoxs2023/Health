import { SecurityConfig } from '../security.config';
import { SecurityService } from '../security.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityService],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  describe('加密和解密', () => {
    it('应该能够加密和解密数据', async () => {
      const data = '敏感数据';
      const key = 'test-key';

      const encrypted = await service.encrypt(data, key);
      expect(encrypted.encrypted).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.tag).toBeDefined();

      const decrypted = await service.decrypt(
        encrypted.encrypted,
        key,
        encrypted.iv,
        encrypted.tag,
      );
      expect(decrypted).toBe(data);
    });

    it('应该在密钥错误时抛出异常', async () => {
      const data = '敏感数据';
      const key = 'test-key';
      const wrongKey = 'wrong-key';

      const encrypted = await service.encrypt(data, key);
      await expect(
        service.decrypt(encrypted.encrypted, wrongKey, encrypted.iv, encrypted.tag),
      ).rejects.toThrow();
    });
  });

  describe('密码哈希', () => {
    it('应该能够哈希和验证密码', async () => {
      const password = 'Test@123456';
      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);

      const isValid = await service.verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('应该能够检测到错误的密码', async () => {
      const password = 'Test@123456';
      const wrongPassword = 'Wrong@123456';
      const hash = await service.hashPassword(password);

      const isValid = await service.verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT令牌', () => {
    it('应该能够生成和验证访问令牌', () => {
      const payload = { userId: '123', role: 'user' };
      const token = service.generateAccessToken(payload);

      expect(token).toBeDefined();

      const decoded = service.verifyAccessToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.role).toBe(payload.role);
    });

    it('应该���够生成和验证刷新令牌', () => {
      const payload = { userId: '123' };
      const token = service.generateRefreshToken(payload);

      expect(token).toBeDefined();

      const decoded = service.verifyRefreshToken(token);
      expect(decoded.userId).toBe(payload.userId);
    });

    it('应该在令牌无效时抛出异常', () => {
      const invalidToken = 'invalid.token.here';
      expect(() => service.verifyAccessToken(invalidToken)).toThrow();
      expect(() => service.verifyRefreshToken(invalidToken)).toThrow();
    });
  });

  describe('密码强度验证', () => {
    it('应该接受有效的密码', () => {
      const password = 'Test@123456';
      const result = service.validatePasswordStrength(password);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该拒绝弱密码', () => {
      const weakPasswords = [
        'short', // 太短
        'nouppercase123', // 没有大写字母
        'NOLOWERCASE123', // 没有小写字母
        'NoSpecialChar123', // 没有特殊字符
        'No@Numbers', // 没有数字
        'Test@111111111', // 重复字符
      ];

      weakPasswords.forEach(password => {
        const result = service.validatePasswordStrength(password);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('数据脱敏', () => {
    it('应该能够脱敏敏感数据', () => {
      const data = {
        name: '张三',
        phoneNumber: '13812345678',
        email: 'zhangsan@example.com',
        idCard: '310123199001011234',
        bankCard: '6222021234567890123',
        address: '上海市浦东新区张江高科技园区',
        password: 'secret123',
        normalField: 'normal value',
      };

      const masked = service.maskSensitiveData(data);

      expect(masked.phoneNumber).toBe('138****5678');
      expect(masked.email).toBe('zha***@example.com');
      expect(masked.idCard).toBe('310123********1234');
      expect(masked.bankCard).toBe('6222 **** **** 0123');
      expect(masked.password).toBe('******');
      expect(masked.normalField).toBe('normal value');
    });

    it('应该能够处理嵌套对象', () => {
      const data = {
        user: {
          name: '张三',
          contact: {
            phoneNumber: '13812345678',
            email: 'zhangsan@example.com',
          },
        },
        credentials: {
          password: 'secret123',
          token: 'abc123',
        },
      };

      const masked = service.maskSensitiveData(data);

      expect(masked.user.contact.phoneNumber).toBe('138****5678');
      expect(masked.user.contact.email).toBe('zha***@example.com');
      expect(masked.credentials.password).toBe('******');
      expect(masked.credentials.token).toBe('******');
    });

    it('应该能够处理数组', () => {
      const data = {
        users: [
          {
            name: '张三',
            phoneNumber: '13812345678',
          },
          {
            name: '李四',
            phoneNumber: '13987654321',
          },
        ],
      };

      const masked = service.maskSensitiveData(data);

      expect(masked.users[0].phoneNumber).toBe('138****5678');
      expect(masked.users[1].phoneNumber).toBe('139****4321');
    });
  });

  describe('安全头生成', () => {
    it('应该生成所有配置的安全头', () => {
      const headers = service.generateSecurityHeaders();

      // HSTS
      expect(headers['Strict-Transport-Security']).toBeDefined();
      expect(headers['Strict-Transport-Security']).toContain('max-age=31536000');
      expect(headers['Strict-Transport-Security']).toContain('includeSubDomains');
      expect(headers['Strict-Transport-Security']).toContain('preload');

      // Content-Type Options
      expect(headers['X-Content-Type-Options']).toBe('nosniff');

      // Frame Options
      expect(headers['X-Frame-Options']).toBe('DENY');

      // XSS Protection
      expect(headers['X-XSS-Protection']).toBe('1; mode=block');

      // Referrer Policy
      expect(headers['Referrer-Policy']).toBe('same-origin');

      // CSP
      expect(headers['Content-Security-Policy']).toBeDefined();
      expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
    });
  });

  describe('随机令牌生成', () => {
    it('应该生成指定长度的随机令牌', () => {
      const token = service.generateRandomToken(32);
      expect(token).toHaveLength(64); // 16进制字符串长度是字节数的2倍
    });

    it('应该生成不同的令牌', () => {
      const token1 = service.generateRandomToken();
      const token2 = service.generateRandomToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('会话ID生成', () => {
    it('应该生成有效的会话ID', () => {
      const sessionId = service.generateSessionId();
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(0);
    });

    it('应该生成不同的会话ID', () => {
      const sessionId1 = service.generateSessionId();
      const sessionId2 = service.generateSessionId();
      expect(sessionId1).not.toBe(sessionId2);
    });
  });
});
