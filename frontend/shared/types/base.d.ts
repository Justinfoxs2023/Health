// 基础类型定义
export interface Dict {
  [key: string]: any;
}

// Express扩展
declare global {
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
      json(body: {
        code: number;
        data?: any;
        message?: string;
      }): this;
    }
  }
} 