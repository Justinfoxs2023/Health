import { AppError } from '../types/error.types';
import { message } from 'antd';

export const errorHandler = {
  handle(error: any) {
    if (error instanceof AppError) {
      message.error(`${error.code}: ${error.message}`);
    } else {
      message.error('系统错误，请稍后重试');
      console.error('Error in error-handler.ts:', error);
    }
  },
};
