declare module '@nestjs/core' {
  export const APP_FILTER: symbol;
  export const APP_PIPE: symbol;
  export const APP_GUARD: symbol;
  export const APP_INTERCEPTOR: symbol;

  export interface Type<T = any> extends Function {
    new (...args: any[]): T;
  }

  export class NestFactory {
    static create(module: any): Promise<any>;
  }

  export class Reflector {
    get<T>(metadataKey: string, target: object): T;
  }
} 