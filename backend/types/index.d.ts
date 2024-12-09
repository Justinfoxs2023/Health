/// <reference types="multer" />

export * from './models';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}

declare module 'multer' {
  interface File extends Express.Multer.File {}
} 