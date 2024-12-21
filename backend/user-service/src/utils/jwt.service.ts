import jwt from 'jsonwebtoken';
import { ITokenPayload } from '../types/interfaces/auth.interface';
import { config } from '../config';
import { injectable } from 'inversify';

@injectable()
export class JwtService {
  async generateAccessToken(payload: ITokenPayload): Promise<string> {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpiry,
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.refreshTokenExpiry,
    });
  }

  async verifyAccessToken(token: string): Promise<ITokenPayload> {
    return jwt.verify(token, config.jwt.secret) as ITokenPayload;
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string }> {
    return jwt.verify(token, config.jwt.secret) as { userId: string };
  }
}
