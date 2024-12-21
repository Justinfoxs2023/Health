import Bull from 'bull';
import { ImageProcessorService } from './image-processor.service';
import { Logger } from '../../utils/logger';
import { RekognitionService } from './rekognition.service';

export class DistributedProcessorService {
  private imageQueue: Bull.Queue;
  private analysisQueue: Bull.Queue;
  private logger: Logger;
  private rekognition: RekognitionService;
  private imageProcessor: ImageProcessorService;

  constructor() {
    this.logger = new Logger('DistributedProcessor');
    this.rekognition = new RekognitionService();
    this.imageProcessor = new ImageProcessorService();

    // 创建图像处理队列
    this.imageQueue = new Bull('image-processing', {
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    });

    // 创建分析队列
    this.analysisQueue = new Bull('image-analysis', {
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    });

    this.setupWorkers();
  }

  private setupWorkers() {
    // 图像预处理worker
    this.imageQueue.process(async job => {
      const { imageBuffer, options } = job.data;
      return await this.imageProcessor.preprocessImage(imageBuffer, options);
    });

    // 图像分析worker
    this.analysisQueue.process(async job => {
      const { imageKey, type, userId } = job.data;

      switch (type) {
        case 'food':
          return await this.rekognition.analyzeFoodImage(imageKey, userId);
        case 'exercise':
          return await this.rekognition.analyzeExercisePose(imageKey, userId);
        case 'equipment':
          return await this.rekognition.analyzeGymEquipment(imageKey);
        default:
          throw new Error(`不支持的分析类型: ${type}`);
      }
    });
  }

  // 添加图像处理任务
  async addImageProcessingJob(imageBuffer: Buffer, options: any) {
    return await this.imageQueue.add({
      imageBuffer,
      options,
    });
  }

  // 添加分析任务
  async addAnalysisJob(imageKey: string, type: string, userId: string) {
    return await this.analysisQueue.add({
      imageKey,
      type,
      userId,
    });
  }

  // 获取任务状态
  async getJobStatus(jobId: string, type: 'processing' | 'analysis') {
    const queue = type === 'processing' ? this.imageQueue : this.analysisQueue;
    const job = await queue.getJob(jobId);
    return job ? await job.getState() : null;
  }
}
