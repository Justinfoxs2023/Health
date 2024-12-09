import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';
import { RedisClient } from '../infrastructure/redis';
import { Session, DeviceInfo } from '../types/session.types';

@injectable()
export class SessionService {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Redis) private redis: RedisClient
  ) {}

  async createSession(userId: string, deviceInfo: DeviceInfo): Promise<Session> {
    const sessionId = await generateToken(32);
    const session: Session = {
      id: sessionId,
      userId,
      deviceInfo,
      createdAt: new Date(),
      lastActivityAt: new Date()
    };

    await this.redis.setex(
      `session:${sessionId}`,
      86400, // 24小时
      JSON.stringify(session)
    );

    return session;
  }

  async validateSession(sessionId: string): Promise<Session | null> {
    const session = await this.redis.get(`session:${sessionId}`);
    if (!session) return null;

    const parsedSession = JSON.parse(session);
    await this.updateSessionActivity(sessionId);
    
    return parsedSession;
  }

  async terminateSession(sessionId: string): Promise<void> {
    await this.redis.del(`session:${sessionId}`);
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const keys = await this.redis.keys(`session:*`);
    const sessions = await Promise.all(
      keys.map(async key => {
        const session = await this.redis.get(key);
        return session ? JSON.parse(session) : null;
      })
    );

    return sessions.filter(session => 
      session && session.userId === userId
    );
  }

  private async updateSessionActivity(sessionId: string): Promise<void> {
    const session = await this.redis.get(`session:${sessionId}`);
    if (session) {
      const updatedSession = {
        ...JSON.parse(session),
        lastActivityAt: new Date()
      };
      await this.redis.setex(
        `session:${sessionId}`,
        86400,
        JSON.stringify(updatedSession)
      );
    }
  }
} 