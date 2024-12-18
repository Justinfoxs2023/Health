import multer from 'multer';
import path from 'path';
import { Logger } from '../utils/logger';
import { RekognitionService } from '../services/vision/rekognition.service';
import { Request, Response } from 'express';

export class VisionController {
  private rekognitionService: RekognitionService;
  private logger: Logger;
  private upload: multer.Multer;

  constructor() {
    this.rekognitionService = new RekognitionService();
    this.logger = new Logger('VisionController');

    // 配置文件上传
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error('不支持的文件类型'));
        }
      },
    });
  }

  // 分析食物图片
  async analyzeFoodImage(req: Request, res: Response) {
    try {
      this.upload.single('image')(req, res, async err => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const file = req.file;
        if (!file) {
          return res.status(400).json({ error: '未上传图片' });
        }

        // 上传图片到S3
        const imageKey = await this.rekognitionService.uploadToS3(
          file.buffer,
          `food/${Date.now()}-${file.originalname}`,
        );

        // 分析食物图片
        const analysis = await this.rekognitionService.analyzeFoodImage(imageKey, req.user.id);

        res.json(analysis);
      });
    } catch (error) {
      this.logger.error('处理食物图片失败:', error);
      res.status(500).json({ error: '分析失败' });
    }
  }

  // 分析运动姿势
  async analyzeExercisePose(req: Request, res: Response) {
    try {
      this.upload.single('image')(req, res, async err => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const file = req.file;
        if (!file) {
          return res.status(400).json({ error: '未上传图片' });
        }

        // 上传图片到S3
        const imageKey = await this.rekognitionService.uploadToS3(
          file.buffer,
          `exercise/${Date.now()}-${file.originalname}`,
        );

        // 分析运动姿势
        const analysis = await this.rekognitionService.analyzeExercisePose(imageKey, req.user.id);

        res.json(analysis);
      });
    } catch (error) {
      this.logger.error('处理运动图片失败:', error);
      res.status(500).json({ error: '分析失败' });
    }
  }
}
