/**
 * @fileoverview TS 文件 nest-common.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module '@nestjs/common' {
  export const Module: Function;
  export const Injectable: Function;
  export const Controller: Function;
  export const Get: Function;
  export const Post: Function;
  export const Body: Function;
  export const UseGuards: Function;
  export const Catch: Function;
  export const ExceptionFilter: Function;
  export const ArgumentsHost: any;
  export const HttpException: any;

  export interface Type<T = any> extends Function {
    new (...args: any[]): T;
  }
}

declare module '@nestjs/core' {
  export const NestFactory: any;
  export class Reflector {
    get<T>(metadataKey: string, target: object): T;
  }
}

declare module '@nestjs/microservices' {
  export const Client: Function;
  export interface ClientGrpc {
    getService<T>(service: string): T;
  }
  export interface GrpcOptions {
    transport: any;
    options: {
      package: string;
      protoPath: string;
    };
  }
}
