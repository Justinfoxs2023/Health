/**
 * @fileoverview TS 文件 global.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 统一导出基础类型
export * from './base';
export * from './express';
export * from './animation';
export * from './tokens';

// 全局类型定义
declare global {
  // 基础类型
  type Dict = Record<string, any>;

  // Express扩展
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: string[];
        permissions?: string[];
      };
      body: any;
      query: any;
      params: any;
      headers: {
        authorization?: string;
        [key: string]: any;
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

    interface Response {
      status(code: number): this;
      json(body: { code: number; data?: any; message?: string }): this;
    }
  }

  // 设计系统类型
  interface DesignTokens {
    colors: {
      brand: {
        primary: string;
        secondary: string;
        tertiary: string;
      };
      background: {
        paper: string;
        default: string;
        secondary: string;
      };
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      functional: {
        success: string;
        warning: string;
        error: string;
        info: string;
      };
      neutral: {
        white: string;
        black: string;
        gray: Record<string, string>;
      };
    };
    spacing: Record<string, number>;
    radius: Record<string, number>;
    typography: {
      sizes: Record<string, number>;
      weights: Record<string, number>;
    };
    shadows: Record<string, any>;
  }
}

// 导出常用类型
export type RequestHandlerType = (
  req: Express.Request,
  res: Express.Response,
  next: NextFunction,
) => Promise<void> | void;

export type ErrorRequestHandlerType = (
  err: any,
  req: Express.Request,
  res: Express.Response,
  next: NextFunction,
) => void;

export type MiddlewareType = RequestHandlerType | ErrorRequestHandlerType;

// 导出第三方库类型
declare module 'joi';
declare module 'fs-extra';
declare module '@jest/types';
declare module 'react-native-svg';
declare module '@tensorflow/tfjs';
declare module '@reduxjs/toolkit';
declare module 'react-redux';
declare module 'react-native-reanimated';
declare module 'react-native-gesture-handler';
declare module '@react-navigation/native';
declare module '@react-navigation/stack';
declare module 'react-native-safe-area-context';
declare module 'react-native-vector-icons/*';
declare module 'react-native-charts-wrapper';
declare module 'react-native-svg-charts';
declare module 'react-native-sound';
declare module 'react-native-keyboard-aware-scroll-view';

// 统一模块声明
declare module 'react-native' {
  export * from './react-native';
}

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
