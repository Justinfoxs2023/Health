import multer from 'multer';
import path from 'path';
import { FileFilterCallbackType, IUploadOptions } from '../utils/upload/types';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: Function) => {
    cb(null, path.join(__dirname, '../uploads/'));
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
      // 将错误信息存储在请求对象中，而不是通过回调传递
      (
        _req as any
      ).fileValidationError = `不支持的文件类型: ${file.mimetype}。仅支持 JPEG、PNG 和 GIF 格式`;
      cb(null, false);
    }
  },
};

export const upload = multer(uploadOptions);

export const uploadImage = async (file: Express.Multer.File): Promise<string> => {
  if (!file) {
    throw new Error('未上传文件');
  }

  return `/uploads/${file.filename}`;
};
