import multer from 'multer';
import path from 'path';
import { FileFilterCallbackType, IUploadOptions, IUploadedFile } from './types';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: Function) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (_req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const uploadOptions: IUploadOptions = {
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallbackType) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
};

export const upload = multer(uploadOptions);

export const uploadImage = async (file: IUploadedFile): Promise<string> => {
  if (!file) {
    throw new Error('未上传文件');
  }
  return `/uploads/${file.filename}`;
};

export type { IUploadedFile } from './types';
