/**
 * @fileoverview TS 文件 prisma.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module '@prisma/client' {
  export interface Prisma {}

  export class PrismaClient {
    constructor(options?: PrismaClientOptions);

    $connect(): Promise<void>;
    $disconnect(): Promise<void>;

    user: {
      findUnique(args: { where: { id: string } }): Promise<User | null>;
      findMany(args?: { where?: any; include?: any }): Promise<User[]>;
      create(args: { data: any }): Promise<User>;
      update(args: { where: { id: string }; data: any }): Promise<User>;
      delete(args: { where: { id: string } }): Promise<User>;
    };

    userActivity: {
      findMany(args?: {
        where?: any;
        include?: any;
        orderBy?: {
          [key: string]: 'asc' | 'desc';
        };
        take?: number;
        skip?: number;
      }): Promise<UserActivity[]>;
      create(args: { data: any }): Promise<UserActivity>;
      createMany(args: { data: any[] }): Promise<{ count: number }>;
    };

    achievement: {
      findMany(args?: { where?: any; include?: any }): Promise<Achievement[]>;
      create(args: { data: any }): Promise<Achievement>;
      createMany(args: { data: any[] }): Promise<{ count: number }>;
    };

    userLevel: {
      findFirst(args?: { where?: any; orderBy?: any }): Promise<UserLevel | null>;
      create(args: { data: any }): Promise<UserLevel>;
    };
  }

  export interface PrismaClientOptions {
    datasources: {
      db: {
        url: string;
      };
    };
    log?: Array<LogLevel | LogDefinition>;
  }

  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export interface User {
    id: string;
    activities: UserActivity;
    achievements: Achievement;
    levels: UserLevel;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface UserActivity {
    id: string;
    userId: string;
    type: string;
    points: number;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
    user: User;
  }

  export interface Achievement {
    id: string;
    userId: string;
    type: string;
    points: number;
    description: string;
    icon: string;
    unlockedAt: Date;
    user: User;
  }

  export interface UserLevel {
    id: string;
    userId: string;
    level: number;
    benefits: any;
    achievedAt: Date;
    user: User;
  }
}

declare module '@nestjs/common' {
  export interface OnModuleInit {
    onModuleInit: Promisevoid;
  }
}
