import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { FileFilterCallback, UploadOptions, UploadedFile } from './types';

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: Function) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (_req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const uploadOptions: UploadOptions = {
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
};

export const upload = multer(uploadOptions);

export const uploadImage = async (file: UploadedFile): Promise<string> => {
  if (!file) {
    throw new Error('未上传文件');
  }
  return `/uploads/${file.filename}`;
};

export type { UploadedFile } from './types';