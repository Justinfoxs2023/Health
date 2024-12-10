import * as tf from '@tensorflow/tfjs';
import { LocalDatabase, createDatabase } from '../utils/local-database';

interface CompressionConfig {
  methods: Array<'quantization' | 'pruning' | 'distillation' | 'low-rank'>;
  targetSize: number;  // 目标模型大小(MB)
  accuracyThreshold: number;  // 可接受的精度损失
  pruning: {
    sparsity: number;  // 稀疏度
    schedule: 'constant' | 'gradual' | 'polynomial';
  };
  quantization: {
    bits: 8 | 16;  // 量化位数
    scheme: 'dynamic' | 'static';
  };
}

interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  accuracyDrop: number;
  latencyImprovement: number;
  metrics: {
    sparsity: number;
    compressionRatio: number;
    memoryUsage: number;
  };
}

export class ModelCompressionService {
  private db: LocalDatabase;
  private model: tf.LayersModel | null = null;
  private compressedModel: tf.LayersModel | null = null;
  private config: CompressionConfig;

  constructor() {
    this.db = createDatabase('model-compression');
    this.config = {
      methods: ['quantization', 'pruning'],
      targetSize: 10,
      accuracyThreshold: 0.02,
      pruning: {
        sparsity: 0.5,
        schedule: 'gradual'
      },
      quantization: {
        bits: 8,
        scheme: 'dynamic'
      }
    };
  }

  // 压缩模型
  async compressModel(
    model: tf.LayersModel,
    validationData?: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<CompressionResult> {
    this.model = model;
    let compressedModel = model;
    const originalSize = await this.calculateModelSize(model);

    // 按顺序应用压缩方法
    for (const method of this.config.methods) {
      switch (method) {
        case 'quantization':
          compressedModel = await this.quantizeModel(compressedModel);
          break;
        case 'pruning':
          compressedModel = await this.pruneModel(compressedModel);
          break;
        case 'distillation':
          compressedModel = await this.distillModel(compressedModel, validationData);
          break;
        case 'low-rank':
          compressedModel = await this.applyLowRankDecomposition(compressedModel);
          break;
      }
    }

    this.compressedModel = compressedModel;

    // 评估压缩结果
    const result = await this.evaluateCompression(validationData);
    await this.saveCompressedModel(result);

    return result;
  }

  // 量化模型
  private async quantizeModel(model: tf.LayersModel): Promise<tf.LayersModel> {
    const quantizedModel = tf.sequential();
    
    // 复制模型架构
    model.layers.forEach(layer => {
      const config = layer.getConfig();
      const newLayer = tf.layers[layer.getClassName() as keyof typeof tf.layers](config);
      quantizedModel.add(newLayer);
    });

    // 量化权重
    const weights = model.getWeights();
    const quantizedWeights = weights.map(weight => {
      return tf.tidy(() => {
        const {mean, variance} = tf.moments(weight);
        const std = tf.sqrt(variance);
        const min = mean.sub(std.mul(3));
        const max = mean.add(std.mul(3));
        
        const scale = max.sub(min).div(tf.scalar(Math.pow(2, this.config.quantization.bits) - 1));
        const quantized = weight.sub(min).div(scale).round();
        return quantized.mul(scale).add(min);
      });
    });

    quantizedModel.setWeights(quantizedWeights);
    return quantizedModel;
  }

  // 剪枝模型
  private async pruneModel(model: tf.LayersModel): Promise<tf.LayersModel> {
    const prunedModel = tf.sequential();
    
    // 复制模型架构
    model.layers.forEach(layer => {
      const config = layer.getConfig();
      const newLayer = tf.layers[layer.getClassName() as keyof typeof tf.layers](config);
      prunedModel.add(newLayer);
    });

    // 剪枝权重
    const weights = model.getWeights();
    const prunedWeights = weights.map(weight => {
      return tf.tidy(() => {
        const threshold = this.calculatePruningThreshold(weight);
        const mask = weight.abs().greater(threshold);
        return weight.mul(mask);
      });
    });

    prunedModel.setWeights(prunedWeights);
    return prunedModel;
  }

  // 低秩分解
  private async applyLowRankDecomposition(
    model: tf.LayersModel
  ): Promise<tf.LayersModel> {
    const decomposedModel = tf.sequential();
    
    // 复制模型架构
    model.layers.forEach(layer => {
      const config = layer.getConfig();
      const newLayer = tf.layers[layer.getClassName() as keyof typeof tf.layers](config);
      decomposedModel.add(newLayer);
    });

    // 对每个密集层进行SVD分解
    const weights = model.getWeights();
    const decomposedWeights = weights.map(weight => {
      if (weight.shape.length === 2) { // 只对2D权重进行分解
        return tf.tidy(() => {
          // 使用特征值分解代替SVD
          const [eigenvalues, eigenvectors] = tf.linalg.eigvalsh(weight.matMul(weight.transpose()));
          const rank = this.calculateOptimalRank(eigenvalues);
          
          // 构建低秩近似
          const topEigenvalues = eigenvalues.slice(0, rank);
          const topEigenvectors = eigenvectors.slice([0, 0], [-1, rank]);
          
          return topEigenvectors.matMul(tf.diag(tf.sqrt(topEigenvalues)));
        });
      }
      return weight;
    });

    decomposedModel.setWeights(decomposedWeights);
    return decomposedModel;
  }

  // 评估压缩效果
  private async evaluateCompression(
    validationData?: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<CompressionResult> {
    const originalSize = await this.calculateModelSize(this.model!);
    const compressedSize = await this.calculateModelSize(this.compressedModel!);

    let accuracyDrop = 0;
    if (validationData) {
      const originalAccuracy = await this.evaluateAccuracy(this.model!, validationData);
      const compressedAccuracy = await this.evaluateAccuracy(this.compressedModel!, validationData);
      accuracyDrop = originalAccuracy - compressedAccuracy;
    }

    const latencyImprovement = await this.measureLatencyImprovement();

    return {
      originalSize,
      compressedSize,
      accuracyDrop,
      latencyImprovement,
      metrics: {
        sparsity: await this.calculateSparsity(this.compressedModel!),
        compressionRatio: originalSize / compressedSize,
        memoryUsage: await this.measureMemoryUsage(this.compressedModel!)
      }
    };
  }

  // 辅助方法
  private calculatePruningThreshold(weights: tf.Tensor): tf.Scalar {
    return tf.tidy(() => {
      const flatValues = weights.abs().reshape([-1]);
      const sortedValues = tf.reverse(
        tf.topk(flatValues, Math.floor(flatValues.size * (1 - this.config.pruning.sparsity))).values
      );
      return sortedValues.gather(0) as tf.Scalar;
    });
  }

  private calculateOptimalRank(singularValues: tf.Tensor): number {
    return tf.tidy(() => {
      const totalEnergy = singularValues.square().sum();
      let currentEnergy = tf.scalar(0);
      let rank = 0;

      for (let i = 0; i < singularValues.size; i++) {
        currentEnergy = currentEnergy.add(singularValues.gather(i).square());
        if (currentEnergy.div(totalEnergy).dataSync()[0] > 0.99) {
          rank = i + 1;
          break;
        }
      }

      return rank;
    });
  }

  private async calculateModelSize(model: tf.LayersModel): Promise<number> {
    return tf.tidy(() => {
      let totalSize = 0;
      model.getWeights().forEach(weight => {
        totalSize += weight.size * Float32Array.BYTES_PER_ELEMENT;
      });
      return totalSize / (1024 * 1024); // Convert to MB
    });
  }

  private async evaluateAccuracy(
    model: tf.LayersModel,
    data: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<number> {
    const result = await model.evaluate(data.x, data.y) as tf.Scalar;
    return result.dataSync()[0];
  }

  private async measureLatencyImprovement(): Promise<number> {
    const originalTime = await this.measureInferenceTime(this.model!);
    const compressedTime = await this.measureInferenceTime(this.compressedModel!);
    return (originalTime - compressedTime) / originalTime;
  }

  private async measureInferenceTime(model: tf.LayersModel): Promise<number> {
    const inputShape = model.inputs[0].shape as number[];
    const warmupInput = tf.zeros([1, ...inputShape.slice(1)]);
    
    // 预热
    for (let i = 0; i < 5; i++) {
      const prediction = await model.predict(warmupInput);
      if (prediction instanceof tf.Tensor) {
        prediction.dispose();
      }
    }

    // 测量时间
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      const prediction = await model.predict(warmupInput);
      if (prediction instanceof tf.Tensor) {
        prediction.dispose();
      }
    }
    const end = performance.now();

    warmupInput.dispose();
    return (end - start) / 100;
  }

  private async calculateSparsity(model: tf.LayersModel): Promise<number> {
    return tf.tidy(() => {
      let totalElements = 0;
      let zeroElements = 0;

      model.getWeights().forEach(weight => {
        const zeros = weight.equal(tf.scalar(0)).sum().dataSync()[0];
        totalElements += weight.size;
        zeroElements += zeros;
      });

      return zeroElements / totalElements;
    });
  }

  private async measureMemoryUsage(model: tf.LayersModel): Promise<number> {
    const memoryInfo = await tf.memory();
    return memoryInfo.numBytes / (1024 * 1024); // Convert to MB
  }

  // 保存压缩后的模型
  private async saveCompressedModel(result: CompressionResult): Promise<void> {
    if (!this.compressedModel) return;
    
    await this.compressedModel.save('indexeddb://compressed-model');
    await this.db.put('compression-result', result);
    await this.db.put('compression-config', this.config);
  }

  // 加载压缩后的模型
  async loadCompressedModel(): Promise<tf.LayersModel | null> {
    try {
      this.compressedModel = await tf.loadLayersModel('indexeddb://compressed-model');
      return this.compressedModel;
    } catch (error) {
      console.error('加载压缩模型失败:', error);
      return null;
    }
  }

  // 添加缺失的 distillModel 方法
  private async distillModel(
    model: tf.LayersModel,
    validationData?: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<tf.LayersModel> {
    // 实现知识蒸馏逻辑
    return model; // 临时返回原模型
  }
} 