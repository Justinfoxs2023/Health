import { 
  Controller, 
  Get, 
  Put, 
  Post, 
  Body, 
  Param, 
  Query,
  UseGuards 
} from '@nestjs/common';
import { 
  AIFeatureConfig, 
  AIFeatureType,
  AIPerformanceMetrics,
  AIUsageStats 
} from '@/types/ai-config';
import { AIConfigService } from '@/services/ai/ai-config.service';
import { AdminGuard } from '@/guards/admin.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Configuration')
@Controller('api/ai-config')
export class AIConfigController {
  constructor(private readonly aiConfigService: AIConfigService) {}

  @Get('features')
  @ApiOperation({ summary: '获取所有AI功能配置' })
  async getAllFeatures(): Promise<{[key in AIFeatureType]?: AIFeatureConfig}> {
    const features = {};
    for (const type of Object.values(AIFeatureType)) {
      features[type] = await this.aiConfigService.getFeatureConfig(type);
    }
    return features;
  }

  @Get('feature/:type')
  @ApiOperation({ summary: '获取指定AI功能配置' })
  async getFeatureConfig(
    @Param('type') type: AIFeatureType
  ): Promise<AIFeatureConfig> {
    return this.aiConfigService.getFeatureConfig(type);
  }

  @Put('feature/:type')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: '更新AI功能配置' })
  async updateFeatureConfig(
    @Param('type') type: AIFeatureType,
    @Body() config: Partial<AIFeatureConfig>
  ): Promise<boolean> {
    return this.aiConfigService.updateFeatureConfig(type, config);
  }

  @Get('metrics/:type')
  @ApiOperation({ summary: '获取AI功能性能指标' })
  async getMetrics(
    @Param('type') type: AIFeatureType
  ): Promise<AIPerformanceMetrics> {
    return this.aiConfigService.getPerformanceMetrics(type);
  }

  @Get('usage/:type')
  @ApiOperation({ summary: '获取AI功能使用统计' })
  async getUsageStats(
    @Param('type') type: AIFeatureType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<AIUsageStats> {
    return this.aiConfigService.getUsageStats(type);
  }

  @Post('test/:type')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: '测试AI功能' })
  async testFeature(
    @Param('type') type: AIFeatureType
  ): Promise<{
    success: boolean;
    latency: number;
    error?: string;
  }> {
    try {
      const startTime = Date.now();
      // 实现测试逻辑
      const latency = Date.now() - startTime;
      return { success: true, latency };
    } catch (error) {
      return { 
        success: false, 
        latency: 0, 
        error: error.message 
      };
    }
  }
} 