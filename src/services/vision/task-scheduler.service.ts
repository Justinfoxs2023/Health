import Bull from 'bull';
import { RedisConfig } from '../../config/redis.config';
import { Logger } from '../../utils/logger';

export class TaskSchedulerService {
  private queues: Map<string, Bull.Queue>;
  private logger: Logger;
  private redis: RedisConfig;

  constructor() {
    this.logger = new Logger('TaskScheduler');
    this.queues = new Map();
    this.initializeQueues();
  }

  private async initializeQueues() {
    // 创建不同优先级的队列
    const queueConfigs = [
      { name: 'high-priority', concurrency: 5 },
      { name: 'normal-priority', concurrency: 3 },
      { name: 'low-priority', concurrency: 1 }
    ];

    for (const config of queueConfigs) {
      const queue = new Bull(config.name, {
        redis: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          },
          removeOnComplete: true
        }
      });

      // 设置并发处理器
      queue.process(config.concurrency, async (job) => {
        return await this.processJob(job);
      });

      // 监听队列事件
      this.setupQueueListeners(queue);

      this.queues.set(config.name, queue);
    }
  }

  // 添加任务到队列
  async addTask(task: any, priority: 'high' | 'normal' | 'low' = 'normal') {
    const queue = this.queues.get(`${priority}-priority`);
    if (!queue) {
      throw new Error(`未找到队列: ${priority}-priority`);
    }

    const job = await queue.add(task, {
      priority: this.getPriorityLevel(priority),
      timeout: this.getTimeout(priority)
    });

    return job.id;
  }

  // 获取任务状态
  async getTaskStatus(jobId: string, priority: string) {
    const queue = this.queues.get(`${priority}-priority`);
    if (!queue) {
      throw new Error(`未找到队列: ${priority}-priority`);
    }

    const job = await queue.getJob(jobId);
    return job ? await job.getState() : null;
  }

  // 暂停队列
  async pauseQueue(priority: string) {
    const queue = this.queues.get(`${priority}-priority`);
    if (queue) {
      await queue.pause();
    }
  }

  // 恢复队列
  async resumeQueue(priority: string) {
    const queue = this.queues.get(`${priority}-priority`);
    if (queue) {
      await queue.resume();
    }
  }

  // 清空队列
  async cleanQueue(priority: string) {
    const queue = this.queues.get(`${priority}-priority`);
    if (queue) {
      await queue.clean(0, 'completed');
      await queue.clean(0, 'failed');
    }
  }

  private setupQueueListeners(queue: Bull.Queue) {
    queue.on('completed', (job) => {
      this.logger.info(`任务完成: ${job.id}`);
    });

    queue.on('failed', (job, error) => {
      this.logger.error(`任务失败: ${job.id}`, error);
    });

    queue.on('stalled', (job) => {
      this.logger.warn(`任务停滞: ${job.id}`);
    });
  }

  private getPriorityLevel(priority: string): number {
    switch (priority) {
      case 'high': return 1;
      case 'normal': return 2;
      case 'low': return 3;
      default: return 2;
    }
  }

  private getTimeout(priority: string): number {
    switch (priority) {
      case 'high': return 5000;
      case 'normal': return 10000;
      case 'low': return 20000;
      default: return 10000;
    }
  }
} 