import multer from 'multer';
import { Request } from 'express';

// 使用 multer 的原始类型
export type FileFilterCallbackType = multer.FileFilterCallback;

export interface IUploadOptions extends multer.Options {
  /** storage 的描述 */
  storage: multer.StorageEngine;
  /** limits 的描述 */
  limits?: {
    fileSize?: number;
  };
  /** fileFilter 的描述 */
  fileFilter?: (req: Request, file: Express.Multer.File, callback: FileFilterCallbackType) => void;
}

export interface IUploadedFile extends Express.Multer.File {
  /** path 的描述 */
  path: string;
  /** filename 的描述 */
  filename: string;
}
