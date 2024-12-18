import { ConfigService } from '../config/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Repository } from 'typeorm';

@Injectable()
export class DistributedSchedulerService implements OnModuleInit {
  private readonly nodeId: string;
  private readonly heartbeatInterval: number;

  constructor(
    @InjectRepository()
    private readonly taskRepo: Repository<ScheduledTask>,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {
    this.nodeId = config.get('NODE_ID');
    this.heartbeatInterval = parseInt(config.get('SCHEDULER_HEARTBEAT_INTERVAL'));
  }

  async onModuleInit() {
    // 注册调度节点
    await this.registerNode();
    // 开始心跳
    this.startHeartbeat();
    // 开始任务调度
    this.startScheduling();
  }

  async scheduleTask(task: Partial<ScheduledTask>): Promise<void> {
    await this.taskRepo.save({
      ...task,
      status: 'PENDING',
      createdAt: new Date(),
    });
  }

  private async registerNode(): Promise<void> {
    const nodeKey = `scheduler:nodes:${this.nodeId}`;
    await this.redis.set(
      nodeKey,
      JSON.stringify({
        lastHeartbeat: Date.now(),
        status: 'ACTIVE',
      }),
    );
  }

  private startHeartbeat(): void {
    setInterval(async () => {
      const nodeKey = `scheduler:nodes:${this.nodeId}`;
      await this.redis.set(
        nodeKey,
        JSON.stringify({
          lastHeartbeat: Date.now(),
          status: 'ACTIVE',
        }),
      );
    }, this.heartbeatInterval);
  }

  private async startScheduling(): Promise<void> {
    // 实现任务调度逻辑
  }
}
