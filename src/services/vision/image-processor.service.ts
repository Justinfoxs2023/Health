import sharp from 'sharp';
import { Logger } from '../../utils/logger';
import { visionConfig } from '../../config/vision.config';

export class ImageProcessorService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('ImageProcessor');
  }

  // 图像预处理
  async preprocessImage(imageBuffer: Buffer, options: PreprocessOptions): Promise<Buffer> {
    try {
      let image = sharp(imageBuffer);

      // 调整大小
      if (options.resize) {
        image = image.resize(options.resize.width, options.resize.height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // 调整亮度和对比度
      if (options.enhance) {
        image = image.modulate({
          brightness: options.enhance.brightness,
          contrast: options.enhance.contrast
        });
      }

      // 降噪
      if (options.denoise) {
        image = image.removeNoise({
          sigma: options.denoise.sigma
        });
      }

      // 格式转换
      image = image.toFormat(options.format || 'jpeg', {
        quality: options.quality || 80
      });

      return await image.toBuffer();
    } catch (error) {
      this.logger.error('图像预处理失败:', error);
      throw error;
    }
  }

  // 批量处理图片
  async batchProcess(images: Array<{buffer: Buffer, metadata: any}>) {
    return await Promise.all(
      images.map(async img => {
        const processed = await this.preprocessImage(img.buffer, {
          resize: visionConfig.preprocessing.defaultResize,
          enhance: visionConfig.preprocessing.defaultEnhance,
          format: 'jpeg',
          quality: 80
        });
        return {
          buffer: processed,
          metadata: img.metadata
        };
      })
    );
  }
} 