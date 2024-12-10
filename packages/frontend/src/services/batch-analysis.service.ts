import { FoodAnalysisService } from './food-analysis.service';
import { ImageOptimizationService } from './image-optimization.service';
import { DataCompressionService } from './data-compression.service';

export class BatchAnalysisService {
  private foodAnalysis: FoodAnalysisService;
  private imageOptimization: ImageOptimizationService;
  private dataCompression: DataCompressionService;

  constructor() {
    this.foodAnalysis = new FoodAnalysisService();
    this.imageOptimization = new ImageOptimizationService();
    this.dataCompression = new DataCompressionService();
  }

  // 批量分析图片
  async analyzeBatchImages(images: File[]): Promise<any[]> {
    // 优化图片
    const optimizedImages = await Promise.all(
      images.map(async (image) => {
        const imageData = await this.fileToImageData(image);
        return this.imageOptimization.batchOptimize([imageData]);
      })
    );

    // 分析食物
    const analysisResults = await Promise.all(
      optimizedImages.flat().map(async (imageData) => {
        const file = await this.imageDataToFile(imageData);
        return this.foodAnalysis.analyzeImage(file);
      })
    );

    // 压缩并存储结果
    await this.dataCompression.batchCompress(
      new Map(analysisResults.map((result, index) => [
        `batch-analysis-${Date.now()}-${index}`,
        result
      ]))
    );

    return analysisResults;
  }

  private async fileToImageData(file: File): Promise<ImageData> {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => img.onload = resolve);

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
  }

  private async imageDataToFile(imageData: ImageData): Promise<File> {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(imageData, 0, 0);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((blob) => resolve(blob!))
    );

    return new File([blob], 'processed-image.jpg', { type: 'image/jpeg' });
  }
} 