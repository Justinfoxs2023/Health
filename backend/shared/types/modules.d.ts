// 声明本地模块
declare module '../*' {
  const content: any;
  export = content;
}

declare module './*' {
  const content: any;
  export = content;
}

// 声明服务模块
declare module '../services/*' {
  export * from '../types/services';
  export { AdminService } from './admin.service';
  export { AuditService } from './audit.service';
  export { ContentService } from './content.service';
  export { IconService } from './icon.service';
  export { AnalyticsService } from './analytics.service';
  export { HealthRecordService } from './health-record.service';
  export { AIService } from './ai.service';
  export { DoctorService } from './doctor.service';
  export { AdvisorService } from './advisor.service';
  export { NutritionistService } from './nutritionist.service';
  export { FitnessService } from './fitness.service';
  export { TCMService } from './tcm.service';
  export { PsychologistService } from './psychologist.service';
}

// 声明工具模块
declare module '../utils/*' {
  export * from '../types/utils';
  export { Logger } from './logger';
  export { Redis } from './redis';
  export { EncryptionService } from './encryption';
  export { validateHealthRecord } from './validators';
  export { PushService } from './push.service';
}

// 声明中间件模块
declare module '../middleware/*' {
  export * from '../types/middleware';
  export { authMiddleware } from './auth.middleware';
  export { roleMiddleware } from './role.middleware';
}

// 声明模型模块
declare module '../models/*' {
  export * from '../types/models';
  export { HealthRecord } from './health-record.model';
  export { AuditLog } from './audit-log.model';
}

// 声明第三方模块
declare module 'joi';
declare module 'ioredis';
declare module '@jest/types' {
  export namespace Config {
    export interface InitialOptions {
      preset?: string;
      moduleFileExtensions?: string[];
      setupFiles?: string[];
      testMatch?: string[];
      transform?: Record<string, string>;
      collectCoverage?: boolean;
      coverageDirectory?: string;
      coverageReporters?: string[];
    }
  }
}

// 声明React Native相关模块
declare module 'react-native' {
  export * from '@types/react-native';
  export const Platform: Platform;
  export const AsyncStorage: AsyncStorage;
  export const Animated: typeof Animated;
}

declare module 'react-native-svg' {
  export const Svg: any;
  export const Path: any;
}

declare module 'react-native-sound' {
  export default class Sound {
    static MAIN_BUNDLE: number;
    constructor(file: string, bundle: number, callback: (error: any) => void);
    play(callback?: (success: boolean) => void): void;
  }
}

// 声明资源模块
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
} 