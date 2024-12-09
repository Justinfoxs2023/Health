import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { OAuth2Client } from 'google-auth-library';

interface TokenPayload {
  sub: string;
  username: string;
  roles: string[];
  permissions: string[];
}

@Injectable()
export class AuthService {
  private readonly oauthClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {
    this.oauthClient = new OAuth2Client({
      clientId: config.get('OAUTH_CLIENT_ID'),
      clientSecret: config.get('OAUTH_CLIENT_SECRET'),
      redirectUri: config.get('OAUTH_REDIRECT_URI')
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    // 实现用户验证逻辑
  }

  async generateToken(user: any): Promise<string> {
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions
    };

    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verify(token);
  }

  async validateOAuthToken(token: string): Promise<any> {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: this.config.get('OAUTH_CLIENT_ID')
    });

    return ticket.getPayload();
  }

  hasPermission(user: any, permission: string): boolean {
    return user.permissions.includes(permission);
  }

  hasRole(user: any, role: string): boolean {
    return user.roles.includes(role);
  }
} 