import * as tf from '@tensorflow/tfjs';
import { LocalDatabase, createDatabase } from '../utils/local-database';
import { PrivacyPreservingService } from './privacy-preserving.service';

interface FederatedConfig {
  aggregationRounds: number;
  minClients: number;
  clientFraction: number;
  localEpochs: number;
  localBatchSize: number;
  communicationProtocol: 'websocket' | 'webrtc' | 'http';
  privacyConfig: {
    enabled: boolean;
    method: 'differential-privacy' | 'secure-aggregation';
    epsilon: number;
    delta: number;
  };
}

interface ClientState {
  id: string;
  dataSize: number;
  lastUpdate: Date;
  performance: {
    accuracy: number;
    loss: number;
    trainingTime: number;
  };
  status: 'idle' | 'training' | 'uploading' | 'error';
}

interface FederatedMetrics {
  globalAccuracy: number;
  globalLoss: number;
  clientMetrics: Map<string, {
    accuracy: number;
    loss: number;
    contribution: number;
  }>;
  convergenceRate: number;
  communicationCost: number;
}

export class FederatedLearningService {
  private db: LocalDatabase;
  private globalModel: tf.LayersModel | null = null;
  private clients: Map<string, ClientState> = new Map();
  private config: FederatedConfig;
  private privacyService: PrivacyPreservingService;
  private currentRound: number = 0;

  constructor() {
    this.db = createDatabase('federated-learning');
    this.privacyService = new PrivacyPreservingService();
    this.config = {
      aggregationRounds: 100,
      minClients: 3,
      clientFraction: 0.8,
      localEpochs: 5,
      localBatchSize: 32,
      communicationProtocol: 'websocket',
      privacyConfig: {
        enabled: true,
        method: 'secure-aggregation',
        epsilon: 0.1,
        delta: 1e-5
      }
    };
  }

  // 初始化联邦学习
  async initializeFederation(
    initialModel: tf.LayersModel
  ): Promise<void> {
    this.globalModel = initialModel;
    await this.saveGlobalModel();
  }

  // 注册客户端
  async registerClient(
    clientId: string,
    dataSize: number
  ): Promise<void> {
    const clientState: ClientState = {
      id: clientId,
      dataSize,
      lastUpdate: new Date(),
      performance: {
        accuracy: 0,
        loss: 0,
        trainingTime: 0
      },
      status: 'idle'
    };

    this.clients.set(clientId, clientState);
    await this.db.put(`client-${clientId}`, clientState);
  }

  // 开始联邦训练
  async startFederatedTraining(): Promise<void> {
    for (this.currentRound = 0; this.currentRound < this.config.aggregationRounds; this.currentRound++) {
      // 选择参与客户端
      const selectedClients = this.selectClients();
      
      // 分发模型
      await this.distributeModel(selectedClients);
      
      // 收集更新
      const clientUpdates = await this.collectClientUpdates(selectedClients);
      
      // 聚合更新
      await this.aggregateUpdates(clientUpdates);
      
      // 评估全局模型
      const metrics = await this.evaluateGlobalModel();
      
      // 检查收敛
      if (this.checkConvergence(metrics)) {
        break;
      }
    }
  }

  // 客户端本地训练
  async trainOnClient(
    clientId: string,
    data: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<{localModel: tf.LayersModel; metrics: any}> {
    const client = this.clients.get(clientId);
    if (!client) throw new Error('客户端未注册');

    client.status = 'training';
    const startTime = Date.now();

    try {
      // 克隆全局模型
      const localModel = await this.cloneModel(this.globalModel!);
      
      // 本地训练
      const history = await localModel.fit(data.x, data.y, {
        epochs: this.config.localEpochs,
        batchSize: this.config.localBatchSize,
        validationSplit: 0.2,
        callbacks: this.createClientCallbacks(clientId)
      });

      // 更新客户端状态
      client.performance = {
        accuracy: history.history.accuracy[history.history.accuracy.length - 1],
        loss: history.history.loss[history.history.loss.length - 1],
        trainingTime: Date.now() - startTime
      };
      client.status = 'idle';
      client.lastUpdate = new Date();

      await this.db.put(`client-${clientId}`, client);

      return { localModel, metrics: history.history };
    } catch (error) {
      client.status = 'error';
      await this.db.put(`client-${clientId}`, client);
      throw error;
    }
  }

  // 聚合更新
  private async aggregateUpdates(
    clientUpdates: Array<{
      clientId: string;
      model: tf.LayersModel;
      dataSize: number;
    }>
  ): Promise<void> {
    // 如果启用了隐私保护
    if (this.config.privacyConfig.enabled) {
      switch (this.config.privacyConfig.method) {
        case 'differential-privacy':
          await this.aggregateWithDP(clientUpdates);
          break;
        case 'secure-aggregation':
          await this.aggregateWithSecureAggregation(clientUpdates);
          break;
      }
    } else {
      await this.federatedAveraging(clientUpdates);
    }

    await this.saveGlobalModel();
  }

  // 联邦平均
  private async federatedAveraging(
    clientUpdates: Array<{
      clientId: string;
      model: tf.LayersModel;
      dataSize: number;
    }>
  ): Promise<void> {
    const totalDataSize = clientUpdates.reduce((sum, update) => sum + update.dataSize, 0);

    // 初始化聚合权重
    const aggregatedWeights = this.globalModel!.getWeights().map(w => 
      tf.zerosLike(w)
    );

    // 加权平均
    for (const update of clientUpdates) {
      const weight = update.dataSize / totalDataSize;
      const clientWeights = update.model.getWeights();

      aggregatedWeights.forEach((aggWeight, i) => {
        const weightedClientWeight = clientWeights[i].mul(tf.scalar(weight));
        aggWeight.add(weightedClientWeight);
      });
    }

    // 更新全局模型
    this.globalModel!.setWeights(aggregatedWeights);
  }

  // 差分隐私聚合
  private async aggregateWithDP(
    clientUpdates: Array<{
      clientId: string;
      model: tf.LayersModel;
      dataSize: number;
    }>
  ): Promise<void> {
    // 实现差分隐私聚合
    const noisyUpdates = await Promise.all(
      clientUpdates.map(async update => ({
        ...update,
        model: await this.addDPNoise(update.model)
      }))
    );

    await this.federatedAveraging(noisyUpdates);
  }

  // 安全聚合
  private async aggregateWithSecureAggregation(
    clientUpdates: Array<{
      clientId: string;
      model: tf.LayersModel;
      dataSize: number;
    }>
  ): Promise<void> {
    // 实现安全聚合协议
    const secureUpdates = await this.privacyService.secureAggregate(
      clientUpdates.map(update => ({
        gradients: update.model.getWeights(),
        weights: this.globalModel!.getWeights()
      }))
    );

    this.globalModel!.setWeights(secureUpdates.weights);
  }

  // 辅助方法
  private selectClients(): string[] {
    const availableClients = Array.from(this.clients.entries())
      .filter(([_, state]) => state.status === 'idle')
      .map(([id, _]) => id);

    const numSelect = Math.max(
      this.config.minClients,
      Math.floor(availableClients.length * this.config.clientFraction)
    );

    return this.shuffleArray(availableClients).slice(0, numSelect);
  }

  private async cloneModel(model: tf.LayersModel): Promise<tf.LayersModel> {
    const cloned = tf.sequential({
      layers: model.layers.map(layer => layer.clone())
    });
    cloned.compile({
      optimizer: model.optimizer,
      loss: model.loss,
      metrics: model.metrics
    });
    return cloned;
  }

  private createClientCallbacks(clientId: string): tf.CustomCallbackArgs[] {
    return [{
      onBatchEnd: async (batch, logs) => {
        // 监控客户端训练进度
        await this.updateClientProgress(clientId, batch, logs);
      }
    }];
  }

  private async updateClientProgress(
    clientId: string,
    batch: number,
    logs?: tf.Logs
  ): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    // 更新进度
    await this.db.put(`client-progress-${clientId}`, {
      batch,
      logs,
      timestamp: new Date()
    });
  }

  private async saveGlobalModel(): Promise<void> {
    if (!this.globalModel) return;
    await this.globalModel.save('indexeddb://federated-global-model');
    await this.db.put('federation-state', {
      round: this.currentRound,
      timestamp: new Date(),
      config: this.config
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // 监控和评估
  async getClientMetrics(clientId: string): Promise<{
    performance: ClientState['performance'];
    progress: any[];
  }> {
    const client = this.clients.get(clientId);
    if (!client) throw new Error('客户端不存在');

    const progress = await this.db.get(`client-progress-${clientId}`) || [];

    return {
      performance: client.performance,
      progress
    };
  }

  async getFederationMetrics(): Promise<FederatedMetrics> {
    const clientMetrics = new Map();
    let totalAccuracy = 0;
    let totalLoss = 0;

    for (const [clientId, state] of this.clients) {
      clientMetrics.set(clientId, {
        accuracy: state.performance.accuracy,
        loss: state.performance.loss,
        contribution: state.dataSize
      });
      totalAccuracy += state.performance.accuracy;
      totalLoss += state.performance.loss;
    }

    return {
      globalAccuracy: totalAccuracy / this.clients.size,
      globalLoss: totalLoss / this.clients.size,
      clientMetrics,
      convergenceRate: this.calculateConvergenceRate(),
      communicationCost: this.calculateCommunicationCost()
    };
  }

  private calculateConvergenceRate(): number {
    // 实现收敛率计算
    return 0;
  }

  private calculateCommunicationCost(): number {
    // 实现通信成本计算
    return 0;
  }
} 