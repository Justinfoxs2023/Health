declare module 'winston' {
  export interface Logger {
    info(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
  }

  export function createLogger(options: any): Logger;
  export const format: any;
  export const transports: any;
} 