import { Request, Response } from 'express';
import { Image } from '../schemas/Image';
import { addImageToQueue, getQueueStatus } from '../services/imageProcessing/queue';
import { performSecurityCheck, extractMetadata } from '../services/imageProcessing/processor';
import { logger } from '../services/logger';

/** 上传图片 */
export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: '未找到上传的文件' });
    }

    // 安全检查
    const isSecure = await performSecurityCheck(file.buffer);
    if (!isSecure) {
      return res.status(400).json({ error: '图片未通过安全检查' });
    }

    // 提取元数据
    const metadata = await extractMetadata(file.buffer);

    // 创建图片记录
    const image = new Image({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      width: metadata.width,
      height: metadata.height,
      metadata: {
        uploadedBy: req.user?._id,
        uploadedAt: new Date(),
        lastModified: new Date(),
      },
      status: 'pending',
    });

    await image.save();

    // 添加到处理队列
    await addImageToQueue(image._id);

    res.status(201).json({
      message: '图片上传成功',
      imageId: image._id,
      status: 'pending',
    });
  } catch (error) {
    logger.error('图片上传失败:', error);
    res.status(500).json({ error: '图片上传失败' });
  }
};

/** 获取图片处理状态 */
export const getImageStatus = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ error: '图片不存在' });
    }

    res.json({
      status: image.status,
      optimized: image.optimized,
      optimizedUrl: image.optimizedUrl,
      thumbnailUrl: image.thumbnailUrl,
      error: image.errorMessage,
    });
  } catch (error) {
    logger.error('获取图片状态失败:', error);
    res.status(500).json({ error: '获取图片状态失败' });
  }
};

/** 获取队列状态 */
export const getProcessingStatus = async (_req: Request, res: Response) => {
  try {
    const status = await getQueueStatus();
    res.json(status);
  } catch (error) {
    logger.error('获取队列状态失败:', error);
    res.status(500).json({ error: '获取队列状态失败' });
  }
};

/** 获取图片列表 */
export const getImages = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};

    const [images, total] = await Promise.all([
      Image.find(query)
        .sort({ 'metadata.uploadedAt': -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      Image.countDocuments(query),
    ]);

    res.json({
      images,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    logger.error('获取图片列表失败:', error);
    res.status(500).json({ error: '获取图片列表失败' });
  }
};

/** 删除图片 */
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ error: '图片不存在' });
    }

    // 检查权限
    if (image.metadata.uploadedBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ error: '无权删除此图片' });
    }

    await image.remove();
    res.json({ message: '图片删除成功' });
  } catch (error) {
    logger.error('删除图片失败:', error);
    res.status(500).json({ error: '删除图片失败' });
  }
}; 