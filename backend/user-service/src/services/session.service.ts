import { ILogger } from '../types/logger';
import { IRedisClient } from '../infrastructure/redis';
import { ISession, IDeviceInfo } from '../types/session.types';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class SessionService {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.Redis) private redis: IRedisClient,
  ) {}

  async createSession(userId: string, deviceInfo: IDeviceInfo): Promise<ISession> {
    const sessionId = await generateToken(32);
    const session: ISession = {
      id: sessionId,
      userId,
      deviceInfo,
      createdAt: new Date(),
      lastActivityAt: new Date(),
    };

    await this.redis.setex(
      `session:${sessionId}`,
      86400, // 24小时
      JSON.stringify(session),
    );

    return session;
  }

  async validateSession(sessionId: string): Promise<ISession | null> {
    const session = await this.redis.get(`session:${sessionId}`);
    if (!session) return null;

    const parsedSession = JSON.parse(session);
    await this.updateSessionActivity(sessionId);

    return parsedSession;
  }

  async terminateSession(sessionId: string): Promise<void> {
    await this.redis.del(`session:${sessionId}`);
  }

  async getUserSessions(userId: string): Promise<ISession[]> {
    const keys = await this.redis.keys(`session:*`);
    const sessions = await Promise.all(
      keys.map(async key => {
        const session = await this.redis.get(key);
        return session ? JSON.parse(session) : null;
      }),
    );

    return sessions.filter(session => session && session.userId === userId);
  }

  private async updateSessionActivity(sessionId: string): Promise<void> {
    const session = await this.redis.get(`session:${sessionId}`);
    if (session) {
      const updatedSession = {
        ...JSON.parse(session),
        lastActivityAt: new Date(),
      };
      await this.redis.setex(`session:${sessionId}`, 86400, JSON.stringify(updatedSession));
    }
  }
}
