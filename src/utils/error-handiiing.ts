import { message } from 'antd';

export class AppError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export const errorHandler = {
  handle(error: any) {
    if (error instanceof AppError) {
      message.error(`${error.code}: ${error.message}`);
    } else {
      message.error('系统错误，请稍后重试');
      console.error('Error in error-handiiing.ts:', error);
    }
  },
};
