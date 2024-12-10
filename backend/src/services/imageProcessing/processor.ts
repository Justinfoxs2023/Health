import sharp from 'sharp';
import { Image } from '../../schemas/Image';
import { logger } from '../logger';

interface ProcessResult {
  optimizedUrl: string;
  thumbnailUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/** 处理图片 */
export const processImage = async (imageId: string): Promise<ProcessResult> => {
  // 获取图片信息
  const image = await Image.findById(imageId);
  if (!image) {
    throw new Error('图片不存在');
  }

  try {
    // 下载原始图片
    const response = await fetch(image.url);
    const buffer = await response.arrayBuffer();
    const originalSize = buffer.byteLength;

    // 创建Sharp实例
    const sharpInstance = sharp(Buffer.from(buffer));
    
    // 优化图片
    const optimized = await sharpInstance
      .webp({ quality: 80 })
      .toBuffer();

    // 生成缩略图
    const thumbnail = await sharpInstance
      .resize(200, 200, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 60 })
      .toBuffer();

    // 计算压缩比
    const compressedSize = optimized.length;
    const compressionRatio = (originalSize - compressedSize) / originalSize;

    // 生成文件名
    const timestamp = Date.now();
    const optimizedUrl = `/images/optimized/${timestamp}_${image.filename}`;
    const thumbnailUrl = `/images/thumbnails/${timestamp}_${image.filename}`;

    // 记录处理信息
    logger.info('图片处理完成', {
      imageId,
      originalSize,
      compressedSize,
      compressionRatio,
    });

    return {
      optimizedUrl,
      thumbnailUrl,
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    logger.error('图片处理失败', { imageId, error });
    throw error;
  }
};

/** 图片安全检查 */
export const performSecurityCheck = async (buffer: Buffer): Promise<boolean> => {
  try {
    // 检查文件头
    const fileSignature = buffer.toString('hex', 0, 4);
    const validSignatures = [
      'ffd8ffe0', // JPEG
      '89504e47', // PNG
      '47494638', // GIF
    ];

    if (!validSignatures.includes(fileSignature)) {
      throw new Error('不支持的图片格式');
    }

    // 检查文件大小
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (buffer.length > maxSize) {
      throw new Error('图片大小超过限制');
    }

    // 验证图片完整性
    await sharp(buffer).metadata();

    return true;
  } catch (error) {
    logger.error('图片安全检查失败', { error });
    return false;
  }
};

/** 提取图片元数据 */
export const extractMetadata = async (buffer: Buffer) => {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      space: metadata.space,
      channels: metadata.channels,
      depth: metadata.depth,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation,
    };
  } catch (error) {
    logger.error('元数据提取失败', { error });
    throw error;
  }
}; 