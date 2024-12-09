import { Request } from 'express';
import multer from 'multer';

// 使用 multer 的原始类型
export type FileFilterCallback = multer.FileFilterCallback;

export interface UploadOptions extends multer.Options {
  storage: multer.StorageEngine;
  limits?: {
    fileSize?: number;
  };
  fileFilter?: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => void;
}

export interface UploadedFile extends Express.Multer.File {
  path: string;
  filename: string;
} 