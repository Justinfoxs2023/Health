/**
 * @fileoverview TS 文件 nest-lifecycle.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module '@nestjs/common' {
  export interface OnModuleInit {
    onModuleInit: Promisevoid;
  }

  export interface OnModuleDestroy {
    onModuleDestroy: Promisevoid;
  }

  export interface OnApplicationBootstrap {
    onApplicationBootstrap: Promisevoid;
  }
}
