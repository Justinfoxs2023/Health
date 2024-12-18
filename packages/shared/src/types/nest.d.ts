/**
 * @fileoverview TS 文件 nest.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module '@nestjs/common' {
  export const Module: Function;
  export const Injectable: Function;
  export const Controller: Function;
  export interface Type<T = any> extends Function {
    new (...args: any[]): T;
  }
}

declare module '@nestjs/config' {
  export class ConfigModule {
    static forRoot(options?: any): any;
  }
  export class ConfigService {
    get(key: string): string;
    getOrThrow(key: string): string;
  }
}

declare module '@nestjs/typeorm' {
  export class TypeOrmModule {
    static forRoot(options?: any): any;
    static forRootAsync(options?: any): any;
    static forFeature(entities?: any[]): any;
  }
}

declare module '@nestjs/microservices' {
  export class ClientsModule {
    static register(options?: any[]): any;
  }
  export enum Transport {
    GRPC = 'grpc',
  }
}
