declare module '@nestjs/common' {
  export interface OnModuleInit {
    onModuleInit(): Promise<void>;
  }
  
  export interface OnModuleDestroy {
    onModuleDestroy(): Promise<void>;
  }
  
  export interface OnApplicationBootstrap {
    onApplicationBootstrap(): Promise<void>;
  }
} 