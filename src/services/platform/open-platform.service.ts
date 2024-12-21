import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { IAPIData, IDeveloperData, ISDKData, IAPISpecData, IAPIUsageData } from './interfaces';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';

@Injectable()
export class OpenPlatformService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
  ) {}

  async handleAPI(operation: string, data: any): Promise<any> {
    try {
      switch (operation) {
        case 'create':
          return await this.createAPI(data.apiData);
        case 'update':
          if (!data.apiId) throw new Error('API ID不能为空');
          return await this.updateAPI(data.apiId, data.apiData);
        case 'delete':
          if (!data.apiId) throw new Error('API ID不能为空');
          return await this.deleteAPI(data.apiId);
        default:
          throw new Error('不支持的操作类型');
      }
    } catch (error) {
      this.logger.error('API操作失败', error);
      throw error;
    }
  }

  private async createAPI(data: IAPIData): Promise<any> {
    // 验证API名称唯一性
    const existingAPI = await this.databaseService.findOne('apis', {
      name: data.name,
      version: data.version,
    });

    if (existingAPI) {
      throw new Error('API名称和版本已存在');
    }

    // 创建API
    const api = await this.databaseService.create('apis', {
      ...data,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 生成API文档
    await this.generateAPIDocumentation(api);

    // 发送API创建事件
    await this.eventBus.emit('api.created', { api });

    return api;
  }

  private async updateAPI(apiId: string, data: Partial<IAPIData>): Promise<any> {
    // 验证API存在性
    const existingAPI = await this.databaseService.findOne('apis', { _id: apiId });
    if (!existingAPI) {
      throw new Error('API不存在');
    }

    // 如果更新了版本号,检查新版本是否已存在
    if (data.version && data.version !== existingAPI.version) {
      const versionExists = await this.databaseService.findOne('apis', {
        name: existingAPI.name,
        version: data.version,
      });

      if (versionExists) {
        throw new Error('API版本已存在');
      }
    }

    // 更新API
    const api = await this.databaseService.update(
      'apis',
      { _id: apiId },
      {
        ...data,
        updatedAt: new Date(),
      },
    );

    // 更新API文档
    await this.generateAPIDocumentation(api);

    // 发送API更新事件
    await this.eventBus.emit('api.updated', { api });

    return api;
  }

  private async deleteAPI(apiId: string): Promise<void> {
    // 验证API存在性
    const api = await this.databaseService.findOne('apis', { _id: apiId });
    if (!api) {
      throw new Error('API不存在');
    }

    // 检查API是否有开发者在使用
    const usageCount = await this.databaseService.count('api_usage', { apiId });
    if (usageCount > 0) {
      throw new Error('API正在被使用,无法删除');
    }

    // 删除API
    await this.databaseService.delete('apis', { _id: apiId });

    // 删除相关文档
    await this.databaseService.delete('api_docs', { apiId });

    // 发送API删除事件
    await this.eventBus.emit('api.deleted', { apiId });
  }

  private async generateAPIDocumentation(api: IAPIData): Promise<void> {
    // 根据API类型生成不同格式的文档
    let documentation;
    switch (api.type) {
      case 'rest':
        documentation = await this.generateRESTDocumentation(api);
        break;
      case 'graphql':
        documentation = await this.generateGraphQLDocumentation(api);
        break;
      case 'websocket':
        documentation = await this.generateWebSocketDocumentation(api);
        break;
      default:
        throw new Error('不支持的API类型');
    }

    // 保存或更新文档
    await this.databaseService.updateOne(
      'api_docs',
      { apiId: api._id },
      { documentation },
      { upsert: true },
    );
  }

  // ... 其他方法实现
}
