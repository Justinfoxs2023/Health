import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { User } from '../../schemas/User';
import { logger } from '../logger';

interface TokenPayload {
  userId: string;
  type: 'access' | 'refresh';
  csrfToken?: string;
}

class JWTService {
  private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
  private static readonly REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
  private static readonly ACCESS_TOKEN_EXPIRES = '15m';
  private static readonly REFRESH_TOKEN_EXPIRES = '7d';

  /**
   * 生成访问令牌和刷新令牌
   */
  static async generateTokens(userId: string) {
    // 生成CSRF令牌
    const csrfToken = randomBytes(32).toString('hex');

    // 生成访问令牌
    const accessToken = jwt.sign(
      { userId, type: 'access', csrfToken } as TokenPayload,
      this.ACCESS_TOKEN_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRES }
    );

    // 生成刷新令牌
    const refreshToken = jwt.sign(
      { userId, type: 'refresh' } as TokenPayload,
      this.REFRESH_TOKEN_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRES }
    );

    // 保存刷新令牌到用户记录
    await User.findByIdAndUpdate(userId, {
      refreshToken: refreshToken,
      lastTokenRefresh: new Date()
    });

    return {
      accessToken,
      refreshToken,
      csrfToken
    };
  }

  /**
   * 验证访问令牌
   */
  static verifyAccessToken(token: string, csrfToken?: string) {
    try {
      const payload = jwt.verify(token, this.ACCESS_TOKEN_SECRET) as TokenPayload;

      // 验证令牌类型
      if (payload.type !== 'access') {
        throw new Error('无效的令牌类型');
      }

      // 验证CSRF令牌
      if (csrfToken && payload.csrfToken !== csrfToken) {
        throw new Error('CSRF令牌不匹配');
      }

      return payload;
    } catch (error) {
      logger.error('访问令牌验证失败:', error);
      throw error;
    }
  }

  /**
   * 验证刷新令牌
   */
  static async verifyRefreshToken(token: string) {
    try {
      const payload = jwt.verify(token, this.REFRESH_TOKEN_SECRET) as TokenPayload;

      // 验证令牌类型
      if (payload.type !== 'refresh') {
        throw new Error('无效的令牌类型');
      }

      // 验证用户的刷新令牌
      const user = await User.findById(payload.userId);
      if (!user || user.refreshToken !== token) {
        throw new Error('刷新令牌已失效');
      }

      return payload;
    } catch (error) {
      logger.error('刷新令牌验证失败:', error);
      throw error;
    }
  }

  /**
   * 刷新访问令牌
   */
  static async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      return this.generateTokens(payload.userId);
    } catch (error) {
      logger.error('令牌刷新失败:', error);
      throw error;
    }
  }

  /**
   * 撤销刷新令牌
   */
  static async revokeRefreshToken(userId: string) {
    try {
      await User.findByIdAndUpdate(userId, {
        $unset: { refreshToken: 1, lastTokenRefresh: 1 }
      });
    } catch (error) {
      logger.error('令牌撤销失败:', error);
      throw error;
    }
  }

  /**
   * 清理过期的刷新令牌
   */
  static async cleanupExpiredTokens() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - 7);

    try {
      await User.updateMany(
        { lastTokenRefresh: { $lt: expiryDate } },
        { $unset: { refreshToken: 1, lastTokenRefresh: 1 } }
      );
    } catch (error) {
      logger.error('过期令牌清理失败:', error);
      throw error;
    }
  }
} 