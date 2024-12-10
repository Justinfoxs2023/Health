import { AxiosError } from 'axios';

/** 错误类型 */
export enum ErrorType {
  /** 网络错误 */
  NETWORK = 'NETWORK',
  /** 业务错误 */
  BUSINESS = 'BUSINESS',
  /** 认证错误 */
  AUTH = 'AUTH',
  /** 权限错误 */
  PERMISSION = 'PERMISSION',
  /** 服务器错误 */
  SERVER = 'SERVER',
  /** 未知错误 */
  UNKNOWN = 'UNKNOWN'
}

/** 错误信息 */
export interface ErrorInfo {
  /** 错误类型 */
  type: ErrorType;
  /** 错误消息 */
  message: string;
  /** 错误码 */
  code?: number | string;
  /** 原始错误 */
  originalError?: any;
}

/** 错误处理器 */
export interface ErrorHandler {
  /** 处理错误 */
  handle(error: ErrorInfo): void;
}

/** 错误处理服务 */
export class ErrorService {
  private static instance: ErrorService;
  private handlers: ErrorHandler[] = [];

  private constructor() {}

  /** 获取单例 */
  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  /** 添加错误处理器 */
  public addHandler(handler: ErrorHandler) {
    this.handlers.push(handler);
  }

  /** 移除错误处理器 */
  public removeHandler(handler: ErrorHandler) {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  /** 处理错误 */
  public handleError(error: any) {
    const errorInfo = this.parseError(error);
    this.handlers.forEach(handler => handler.handle(errorInfo));
  }

  /** 解析错误 */
  private parseError(error: any): ErrorInfo {
    if (error instanceof AxiosError) {
      return this.parseAxiosError(error);
    }

    if (error instanceof Error) {
      return {
        type: ErrorType.UNKNOWN,
        message: error.message,
        originalError: error
      };
    }

    return {
      type: ErrorType.UNKNOWN,
      message: String(error),
      originalError: error
    };
  }

  /** 解析Axios错误 */
  private parseAxiosError(error: AxiosError): ErrorInfo {
    if (!error.response) {
      return {
        type: ErrorType.NETWORK,
        message: '网络连接失败，请检查网络设置',
        originalError: error
      };
    }

    const status = error.response.status;
    const data = error.response.data as any;

    switch (status) {
      case 400:
        return {
          type: ErrorType.BUSINESS,
          message: data?.message || '请求参数错误',
          code: data?.code,
          originalError: error
        };
      case 401:
        return {
          type: ErrorType.AUTH,
          message: '未授权，请重新登录',
          code: status,
          originalError: error
        };
      case 403:
        return {
          type: ErrorType.PERMISSION,
          message: '没有权限访问该资源',
          code: status,
          originalError: error
        };
      case 404:
        return {
          type: ErrorType.BUSINESS,
          message: '请求的资源不存在',
          code: status,
          originalError: error
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ErrorType.SERVER,
          message: '服务器错误，请稍后重试',
          code: status,
          originalError: error
        };
      default:
        return {
          type: ErrorType.UNKNOWN,
          message: data?.message || '未知错误',
          code: status,
          originalError: error
        };
    }
  }
}

/** 控制台错误处理器 */
export class ConsoleErrorHandler implements ErrorHandler {
  handle(error: ErrorInfo): void {
    console.error(
      `[${error.type}] ${error.message}${error.code ? ` (${error.code})` : ''}`
    );
  }
}

/** 默认错误服务实例 */
export const errorService = ErrorService.getInstance();

// 添加默认的控制台错误处理器
errorService.addHandler(new ConsoleErrorHandler()); 