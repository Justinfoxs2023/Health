/**
 * @fileoverview TS 文件 express-extensions.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare namespace Express {
  interface Request {
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
}
