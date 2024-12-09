import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { MetricsService } from '../monitoring/metrics.service';

@Injectable()
export class HealthCheckService {
  private checks: Map<string, () => Promise<boolean>>;

  constructor(
    private readonly config: ConfigService,
    private readonly metrics: MetricsService
  ) {
    this.checks = new Map();
    this.initializeHealthChecks();
  }

  private initializeHealthChecks() {
    // 添加默认的健康检查
    this.addCheck('memory', this.checkMemoryUsage.bind(this));
    this.addCheck('cpu', this.checkCPUUsage.bind(this));
    this.addCheck('disk', this.checkDiskSpace.bind(this));
  }

  addCheck(name: string, check: () => Promise<boolean>) {
    this.checks.set(name, check);
  }

  async checkHealth(): Promise<HealthStatus> {
    const results = new Map<string, boolean>();
    
    for (const [name, check] of this.checks) {
      try {
        results.set(name, await check());
      } catch (error) {
        results.set(name, false);
      }
    }

    return {
      status: this.evaluateOverallHealth(results),
      checks: Object.fromEntries(results),
      timestamp: new Date()
    };
  }

  private async checkMemoryUsage(): Promise<boolean> {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    return used < parseInt(this.config.get('MAX_MEMORY_USAGE') || '512');
  }

  private async checkCPUUsage(): Promise<boolean> {
    // 实现CPU使用率检查
    return true;
  }

  private async checkDiskSpace(): Promise<boolean> {
    // 实现磁盘空间检查
    return true;
  }

  private evaluateOverallHealth(results: Map<string, boolean>): string {
    return Array.from(results.values()).every(result => result) ? 'healthy' : 'unhealthy';
  }
} 