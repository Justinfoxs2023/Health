declare module 'config-types' {
  export interface Config {
    redis: {
      host: string;
      port: number;
      password?: string;
      db: number;
    };
    jwt: {
      secret: string;
      refreshSecret: string;
      accessTokenExpiry: number;
      refreshTokenExpiry: number;
    };
    security: {
      maxLoginAttempts: number;
      loginAttemptsTTL: number;
      accountLockDuration: number;
      maxIPRequests: number;
      ipLimitTTL: number;
    };
    cache: {
      userTTL: number;
    };
  }
} 