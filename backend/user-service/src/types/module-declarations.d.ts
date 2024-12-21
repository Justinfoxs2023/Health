/**
 * @fileoverview TS 文件 module-declarations.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 声明Express模块
declare module 'express' {
  export interface Request {
    user?: {
      id: string;
      roles: string[];
      permissions?: string[];
    };
    file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    };
  }
  export interface Response {}
  export interface NextFunction {}
  export class Router {}
}

// 声明React Native模块
declare module 'react-native' {
  export const TextInput: any;
  export const Platform: any;
  export const Dimensions: any;
  export const Keyboard: any;
  export const PanResponder: any;
  export const Easing: any;
  export interface ImageSourcePropType {}
  export interface ScaledSize {}
  export interface KeyboardEvent {}
}

// 声明服务模块
declare module '../services/*' {
  export * from '../services';
}

// 声明工具模块
declare module '../utils/*' {
  export * from '../utils';
}
