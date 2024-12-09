import { Request, Response, NextFunction } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta: {
    timestamp: number;
    path: string;
    duration?: number;
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export class ResponseFormatter {
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // 扩展response对象,添加格式化方法
      res.sendSuccess = function(data: any, message?: string) {
        const response = this.formatResponse(data, true, message);
        res.json(response);
      };

      res.sendError = function(message: string, errors?: any[]) {
        const response = this.formatResponse(null, false, message, errors);
        res.status(400).json(response);
      };

      next();
    };
  }

  format(data: any, success: boolean = true, message?: string): ApiResponse {
    const response: ApiResponse = {
      success,
      meta: {
        timestamp: Date.now()
      }
    };

    if (data) {
      // 处理分页数��
      if (this.isPaginatedData(data)) {
        response.data = data.items;
        response.meta.pagination = {
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: Math.ceil(data.total / data.pageSize)
        };
      } else {
        response.data = data;
      }
    }

    if (message) {
      response.message = message;
    }

    return response;
  }

  private isPaginatedData(data: any): boolean {
    return data && 
      typeof data === 'object' &&
      'items' in data &&
      'total' in data &&
      'page' in data &&
      'pageSize' in data;
  }

  // 处理特殊响应类型
  private formatSpecialTypes(data: any): any {
    if (data instanceof Date) {
      return data.toISOString();
    }
    
    if (data instanceof Map) {
      return Object.fromEntries(data);
    }
    
    if (data instanceof Set) {
      return Array.from(data);
    }

    if (Buffer.isBuffer(data)) {
      return data.toString('base64');
    }

    return data;
  }

  // 递归处理嵌套对象
  private processNestedObjects(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.processNestedObjects(item));
    }

    if (obj && typeof obj === 'object') {
      const processed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        processed[key] = this.processNestedObjects(this.formatSpecialTypes(value));
      }
      return processed;
    }

    return this.formatSpecialTypes(obj);
  }
} 