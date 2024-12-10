import Bull from 'bull';
import { Image } from '../../schemas/Image';
import { processImage } from './processor';
import { logger } from '../logger';

// 创建图片处理队列
const imageQueue = new Bull('image-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
  },
});

// 队列处理器
imageQueue.process(async (job) => {
  const { imageId } = job.data;
  
  try {
    // 更新图片状态为处理中
    await Image.findByIdAndUpdate(imageId, { status: 'processing' });
    
    // 处理图片
    const result = await processImage(imageId);
    
    // 更新处理结果
    await Image.findByIdAndUpdate(imageId, {
      status: 'ready',
      optimized: true,
      optimizedUrl: result.optimizedUrl,
      thumbnailUrl: result.thumbnailUrl,
      'metadata.compression': {
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        ratio: result.compressionRatio,
      },
    });

    return result;
  } catch (error) {
    logger.error('图片处理失败:', { imageId, error });
    
    // 更新错误状态
    await Image.findByIdAndUpdate(imageId, {
      status: 'error',
      errorMessage: error.message,
    });
    
    throw error;
  }
});

// 监听队列事件
imageQueue.on('completed', (job) => {
  logger.info('图片处理完成:', { imageId: job.data.imageId });
});

imageQueue.on('failed', (job, error) => {
  logger.error('图片处理失败:', { 
    imageId: job.data.imageId, 
    error: error.message,
    attempts: job.attemptsMade,
  });
});

// 导出队列管理函数
export const addImageToQueue = async (imageId: string) => {
  return imageQueue.add({ imageId });
};

export const getQueueStatus = async () => {
  const [waiting, active, completed, failed] = await Promise.all([
    imageQueue.getWaitingCount(),
    imageQueue.getActiveCount(),
    imageQueue.getCompletedCount(),
    imageQueue.getFailedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
  };
};

export const clearQueue = async () => {
  await imageQueue.empty();
  await imageQueue.clean(0, 'completed');
  await imageQueue.clean(0, 'failed');
};

export const pauseQueue = async () => {
  await imageQueue.pause();
};

export const resumeQueue = async () => {
  await imageQueue.resume();
}; 