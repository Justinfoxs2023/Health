import { DatabaseService } from '../database/database.service';
import { DeveloperData } from './types';
import { EventBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeveloperService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
  ) {}

  async registerDeveloper(data: DeveloperData): Promise<any> {
    try {
      await this.validateDeveloperInfo(data);

      const developer = await this.databaseService.create('developers', {
        ...data,
        status: 'pending',
        createdAt: new Date(),
      });

      await this.eventBus.emit('developer.registered', { developer });

      return developer;
    } catch (error) {
      throw new Error(`Developer registration failed: ${error.message}`);
    }
  }

  private async validateDeveloperInfo(data: DeveloperData): Promise<void> {
    // 验证逻辑实现
  }
}
