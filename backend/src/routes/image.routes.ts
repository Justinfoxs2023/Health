import multer from 'multer';
import {
  uploadImage,
  getImageStatus,
  getProcessingStatus,
  getImages,
  deleteImage,
} from '../controllers/image.controller';
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { rateLimitMiddleware } from '../middleware/security';
const router = Router();

// 配置文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    // 检查文件类型
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('只允许上传图片文件'));
    }
    cb(null, true);
  },
});

// 图片上传路由
router.post('/upload', authMiddleware, rateLimitMiddleware, upload.single('image'), uploadImage);

// 获取图片状态
router.get('/status/:imageId', authMiddleware, getImageStatus);

// 获取处理队列状态
router.get('/processing/status', authMiddleware, getProcessingStatus);

// 获取图片列表
router.get('/list', authMiddleware, getImages);

// 删除图片
router.delete('/:imageId', authMiddleware, deleteImage);

// 错误处理
router.use((err: Error, _req: any, res: any, _next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小超过限制' });
    }
  }
  res.status(500).json({ error: err.message });
});

export default router;
