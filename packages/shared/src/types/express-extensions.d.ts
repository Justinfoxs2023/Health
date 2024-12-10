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