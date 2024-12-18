import jwt from 'jsonwebtoken';
import { IJwtService } from './types';
import { config } from '../../config';
import { injectable } from 'inversify';

@injectable()
export class JwtServiceImpl implements IJwtService {
  async generateAccessToken(payload: any): Promise<string> {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: '7d' });
  }

  async verifyAccessToken(token: string): Promise<any> {
    return jwt.verify(token, config.jwt.secret);
  }

  async verifyRefreshToken(token: string): Promise<any> {
    return jwt.verify(token, config.jwt.refreshSecret);
  }
}
