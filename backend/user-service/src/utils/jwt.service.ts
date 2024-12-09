import jwt from 'jsonwebtoken';
import { config } from '../config';
import { TokenPayload } from '../types/interfaces/auth.interface';
import { injectable } from 'inversify';

@injectable()
export class JwtService {
  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpiry,
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.refreshTokenExpiry,
    });
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string }> {
    return jwt.verify(token, config.jwt.secret) as { userId: string };
  }
} 