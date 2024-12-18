import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Put, Post, Body, Param, Query, UseGuards } from '@nestjs/common';

import {
  IAIFeatureConfig,
  AIFeatureType,
  IAIPerformanceMetrics,
  IAIUsageStats,
} from '@/types/ai-config';
import { AIConfigService } from '@/services/ai/ai-config.service';
import { AdminGuard } from '@/guards/admin.guard';

@ApiT
ags()
@Controller()
export class AIConfigController {
  constructor(private readonly aiConfigService: AIConfigService) {}

  @Get()
  @ApiOperation()
  async getAllFeatures(): Promise<{ [key in AIFeatureType]?: IAIFeatureConfig }> {
    const features = {};
    for (const type of Object.values(AIFeatureType)) {
      features[type] = await this.aiConfigService.getFeatureConfig(type);
    }
    return features;
  }

  @Get()
  @ApiOperation()
  async getFeatureConfig(@Param() type: AIFeatureType): Promise<IAIFeatureConfig> {
    return this.aiConfigService.getFeatureConfig(type);
  }

  @Put()
  @UseGuards()
  @ApiOperation()
  async updateFeatureConfig(
    @Param() type: AIFeatureType,
    @Body() config: Partial<IAIFeatureConfig>,
  ): Promise<boolean> {
    return this.aiConfigService.updateFeatureConfig(type, config);
  }

  @Get()
  @ApiOperation()
  async getMetrics(@Param() type: AIFeatureType): Promise<IAIPerformanceMetrics> {
    return this.aiConfigService.getPerformanceMetrics(type);
  }

  @Get()
  @ApiOperation()
  async getUsageStats(
    @Param() type: AIFeatureType,
    @Query() startDate?: string,
    @Query() endDate?: string,
  ): Promise<IAIUsageStats> {
    return this.aiConfigService.getUsageStats(type);
  }

  @Post()
  @UseGuards()
  @ApiOperation()
  async testFeature(@Param() type: AIFeatureType): Promise<{
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
        error: error.message,
      };
    }
  }
}
