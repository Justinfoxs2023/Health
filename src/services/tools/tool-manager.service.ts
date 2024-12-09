import { Injectable } from '@nestjs/common';
import { 
  ToolType, 
  ToolCategory,
  ToolFeature,
  ToolUsageStats,
  ToolDataSync 
} from '@/types/tool-features';
import { DatabaseService } from '@/services/database/database.service';
import { HealthDocumentService } from '@/services/health/health-document.service';
import { NotificationService } from '@/services/notification/notification.service';

@Injectable()
export class ToolManagerService {
  constructor(
    private readonly db: DatabaseService,
    private readonly healthDoc: HealthDocumentService,
    private readonly notification: NotificationService
  ) {}

  // 获取用户可用工具列表
  async getUserTools(userId: string): Promise<ToolFeature[]> {
    const userProfile = await this.db.findOne('user_profiles', { userId });
    const isVip = userProfile.vipStatus?.active || false;
    
    const tools = await this.db.find('tool_features', {
      enabled: true,
      $or: [
        { requiresVip: false },
        { requiresVip: true, isVip: true }
      ]
    });

    return tools.map(tool => ({
      ...tool,
      available: this.checkToolAvailability(tool, userProfile)
    }));
  }

  // 同步工具数据到健康文档
  async syncToolDataToHealthDoc(
    userId: string,
    toolType: ToolType,
    data: ToolDataSync
  ): Promise<void> {
    try {
      // 更新健康文档
      await this.healthDoc.updateDocument(userId, {
        toolType,
        data: data.data,
        timestamp: data.timestamp,
        source: data.source
      });

      // 记录同步状态
      await this.db.updateOne(
        'tool_usage_stats',
        { userId, toolType },
        {
          $set: {
            'syncStatus.lastSync': new Date(),
            'syncStatus.syncSuccess': true
          }
        }
      );
    } catch (error) {
      // 记录同步失败
      await this.db.updateOne(
        'tool_usage_stats',
        { userId, toolType },
        {
          $set: {
            'syncStatus.syncSuccess': false,
            'syncStatus.errorMessage': error.message
          }
        }
      );
      throw error;
    }
  }

  // 获取工具使用建议
  async getToolRecommendations(userId: string): Promise<ToolFeature[]> {
    const healthDoc = await this.healthDoc.getDocument(userId);
    const userProfile = await this.db.findOne('user_profiles', { userId });
    
    // 基于健康文档数据推荐相关工具
    return this.analyzeAndRecommendTools(healthDoc, userProfile);
  }

  private async analyzeAndRecommendTools(healthDoc: any, userProfile: any): Promise<ToolFeature[]> {
    // 实现工具推荐逻辑
    return [];
  }

  private checkToolAvailability(tool: ToolFeature, userProfile: any): boolean {
    // 实现工具可用性检查逻辑
    return true;
  }
} 