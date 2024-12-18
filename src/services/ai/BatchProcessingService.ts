import * as tf from '@tensorflow/tfjs-node';
import { chunk } from 'lodash';

import { BatchProcessError } from '@/utils/errors';
import { Logger } from '@/utils/Logger';

export class BatchProcessingService {
  private logger: Logger;
  private readonly batchSize = 32;
  private readonly maxConcurrent = 4;

  constructor() {
    this.logger = new Logger('BatchProcessing');
  }

  /**
   * 批量处理数据
   */
  async processBatch<T, R>(
    items: T[],
    processor: (batch: T[]) => Promise<R[]>,
    options: {
      batchSize?: number;
      maxConcurrent?: number;
      onProgress?: (progress: number) => void;
    } = {},
  ): Promise<R[]> {
    try {
      const {
        batchSize = this.batchSize,
        maxConcurrent = this.maxConcurrent,
        onProgress,
      } = options;

      // 分批
      const batches = chunk(items, batchSize);
      let completed = 0;
      let results: R[] = [];

      // 并发处理
      for (let i = 0; i < batches.length; i += maxConcurrent) {
        const currentBatches = batches.slice(i, i + maxConcurrent);
        const batchResults = await Promise.all(
          currentBatches.map(async batch => {
            const result = await processor(batch);
            completed += batch.length;

            if (onProgress) {
              onProgress(completed / items.length);
            }

            return result;
          }),
        );

        results = results.concat(batchResults.flat());
      }

      return results;
    } catch (error) {
      this.logger.error('批量处理失败', error);
      throw new BatchProcessError('BATCH_PROCESSING_FAILED', error.message);
    }
  }

  /**
   * 批量预测
   */
  async batchPredict(
    model: tf.LayersModel,
    inputs: tf.Tensor[],
    options: {
      batchSize?: number;
      onProgress?: (progress: number) => void;
    } = {},
  ): Promise<tf.Tensor[]> {
    try {
      const { batchSize = this.batchSize, onProgress } = options;
      const batches = chunk(inputs, batchSize);
      let results: tf.Tensor[] = [];
      let completed = 0;

      for (const batch of batches) {
        // 合并batch中的tensor
        const batchTensor = tf.concat(batch);

        // 执行预测
        const predictions = (await model.predict(batchTensor)) as tf.Tensor;

        // 分割预测结果
        const splitPredictions = tf.split(predictions, batch.length);
        results = results.concat(splitPredictions);

        completed += batch.length;
        if (onProgress) {
          onProgress(completed / inputs.length);
        }

        // 清理内存
        batchTensor.dispose();
        predictions.dispose();
      }

      return results;
    } catch (error) {
      this.logger.error('批量预测失败', error);
      throw new BatchProcessError('BATCH_PREDICTION_FAILED', error.message);
    }
  }
}
