import { Injectable } from '@nestjs/common';
import { StorageService } from '../../storage/storage.service';
import { AIService } from '../../ai/ai.service';
import { BaseHealthData } from '../types/health-base.types';

@Injectable()
export class HealthBaseService {
  constructor(
    protected readonly storage: StorageService,
    protected readonly ai: AIService
  ) {}

  // 基础数据存储方法
  protected async saveData<T extends BaseHealthData | BaseHealthData[]>(
    key: string, 
    data: T
  ): Promise<void> {
    await this.storage.set(key, data);
  }

  protected async getData<T extends BaseHealthData>(key: string): Promise<T | null> {
    return this.storage.get<T>(key);
  }

  protected async getListData<T extends BaseHealthData>(key: string): Promise<T[]> {
    return this.storage.get<T[]>(key) || [];
  }

  // 时间段计算
  protected calculatePeriod(data: BaseHealthData[]): { start: Date; end: Date } {
    if (!data.length) {
      return {
        start: new Date(),
        end: new Date()
      };
    }

    return {
      start: new Date(Math.min(...data.map(d => d.timestamp.getTime()))),
      end: new Date(Math.max(...data.map(d => d.timestamp.getTime())))
    };
  }

  // 进度计算
  protected calculateProgress(current: number, target: number): number {
    return Math.min(Math.max((current / target) * 100, 0), 100);
  }

  // 趋势分析
  protected analyzeTrend(data: number[]): 'increasing' | 'stable' | 'decreasing' {
    if (data.length < 2) return 'stable';
    
    const recentAvg = this.calculateAverage(data.slice(-3));
    const previousAvg = this.calculateAverage(data.slice(-6, -3));
    
    const difference = recentAvg - previousAvg;
    const threshold = 0.05; // 5%变化阈值

    if (Math.abs(difference) < threshold) return 'stable';
    return difference > 0 ? 'increasing' : 'decreasing';
  }

  // 数据验证
  protected validateData<T extends BaseHealthData>(data: T): boolean {
    return (
      data &&
      data.id &&
      data.userId &&
      data.timestamp instanceof Date &&
      typeof data.source === 'string' &&
      typeof data.reliability === 'number' &&
      typeof data.verified === 'boolean'
    );
  }

  // 辅助方法
  private calculateAverage(numbers: number[]): number {
    return numbers.length ? numbers.reduce((a, b) => a + b) / numbers.length : 0;
  }

  // 添加数据验证方法
  protected validateSessionData<T extends BaseHealthData>(
    session: Partial<T>,
    plan: BaseHealthData
  ): boolean {
    return (
      session &&
      session.userId === plan.userId &&
      (!session.id || typeof session.id === 'string')
    );
  }
} 