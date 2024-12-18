import * as Comlink from 'comlink';
import { WorkerPool } from '../utils/worker-pool';

export class ParallelProcessingService {
  private workerPool: WorkerPool;
  private maxWorkers: number;

  constructor(maxWorkers = navigator.hardwareConcurrency || 4) {
    this.maxWorkers = maxWorkers;
    this.workerPool = new WorkerPool(maxWorkers);
  }

  // 并行图像处理
  async processImagesInParallel(images: ImageData[]): Promise<ImageData[]> {
    // 将图像分成批次
    const batchSize = Math.ceil(images.length / this.maxWorkers);
    const batches = this.chunkArray(images, batchSize);

    // 并行处理每个批次
    const results = await Promise.all(
      batches.map(batch => this.workerPool.execute('processImageBatch', [batch])),
    );

    return results.flat();
  }

  // 并行数据分析
  async analyzeDataInParallel<T>(data: T[], processor: (item: T) => Promise<any>): Promise<any[]> {
    const tasks = console.error('Error in parallel-processing.service.ts:', item => async () => {
      try {
        return await processor(item);
      } catch (error) {
        console.error('Error in parallel-processing.service.ts:', '并行处理失败:', error);
        throw error;
      }
    });

    return this.workerPool.executeAll(tasks);
  }

  // 动态负载均衡
  private async balanceLoad(tasks: any[]): Promise<void> {
    const workerLoads = new Array(this.maxWorkers).fill(0);
    const taskQueue = [...tasks];

    while (taskQueue.length > 0) {
      const minLoadIndex = workerLoads.indexOf(Math.min(...workerLoads));
      const task = taskQueue.shift();

      if (task) {
        const startTime = performance.now();
        await this.workerPool.executeOnWorker(minLoadIndex, task);
        const duration = performance.now() - startTime;
        workerLoads[minLoadIndex] += duration;
      }
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, (i + 1) * size),
    );
  }
}
