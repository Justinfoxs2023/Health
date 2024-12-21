import * as tf from '@tensorflow/tfjs';
import { ImagePreprocessingService } from './image-preprocessing.service';

export class ImageOptimizationService {
  private preprocessor: ImagePreprocessingService;

  constructor() {
    this.preprocessor = new ImagePreprocessingService();
  }

  // 智能裁剪
  async smartCrop(imageData: ImageData): Promise<ImageData> {
    const tensor = tf.browser.fromPixels(imageData);

    // 使用目标检测模型识别食物区域
    const model = await tf.loadGraphModel('/models/food-detection');
    const predictions = await model.predict(tensor.expandDims(0));

    // 获取最大置信度的边界框
    const boxes = await predictions[0].array();
    const [y1, x1, y2, x2] = boxes[0];

    // 裁剪图像
    const cropped = tensor.slice([y1, x1], [y2 - y1, x2 - x1]);
    return tf.browser.toPixels(cropped);
  }

  // 自适应增强
  async adaptiveEnhancement(imageData: ImageData): Promise<ImageData> {
    const tensor = tf.browser.fromPixels(imageData);

    // 计算图像统计信息
    const mean = tensor.mean();
    const std = tensor.sub(mean).square().mean().sqrt();

    // 根据统计信息调整增强参数
    const brightness = await this.calculateBrightnessAdjustment(mean);
    const contrast = await this.calculateContrastAdjustment(std);

    // 应用增强
    const enhanced = tensor.sub(mean).mul(contrast).add(mean.add(brightness));

    return tf.browser.toPixels(enhanced);
  }

  // 批量优化
  async batchOptimize(images: ImageData[]): Promise<ImageData[]> {
    const optimizedImages = await Promise.all(
      images.map(async image => {
        const cropped = await this.smartCrop(image);
        const enhanced = await this.adaptiveEnhancement(cropped);
        return enhanced;
      }),
    );
    return optimizedImages;
  }

  private async calculateBrightnessAdjustment(mean: tf.Tensor): Promise<number> {
    const meanValue = await mean.array();
    const targetBrightness = 0.5;
    return targetBrightness - meanValue;
  }

  private async calculateContrastAdjustment(std: tf.Tensor): Promise<number> {
    const stdValue = await std.array();
    const targetContrast = 0.2;
    return targetContrast / stdValue;
  }
}
