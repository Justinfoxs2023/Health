import * as tf from '@tensorflow/tfjs';
import { compress } from 'browser-image-compression';

export class ImagePreprocessingService {
  // 图像压缩
  async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true
    };
    return await compress(file, options);
  }

  // 图像增强
  async enhanceImage(imageData: ImageData): Promise<ImageData> {
    const tensor = tf.browser.fromPixels(imageData);
    
    // 亮度调整
    const brightened = tensor.add(tf.scalar(0.2));
    
    // 对比度增强
    const mean = tf.scalar(0.5);
    const factor = tf.scalar(1.2);
    const contrasted = brightened.sub(mean).mul(factor).add(mean);
    
    // 锐化
    const kernel = tf.tensor2d([
      [-1, -1, -1],
      [-1,  9, -1],
      [-1, -1, -1]
    ]).expandDims(2).expandDims(3);
    
    const sharpened = tf.conv2d(
      contrasted.expandDims(0),
      kernel,
      [1, 1],
      'same'
    ).squeeze();

    return tf.browser.toPixels(sharpened);
  }

  // 批量处理
  async batchProcess(files: File[]): Promise<File[]> {
    const processedFiles = await Promise.all(
      files.map(async file => {
        const compressed = await this.compressImage(file);
        return compressed;
      })
    );
    return processedFiles;
  }
} 