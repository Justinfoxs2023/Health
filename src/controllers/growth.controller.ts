import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GrowthMetricsResponseDto } from '../dto/growth.dto';
import { IGrowthActivity } from '../types/growth.types';
import { RecordActivityDto } from '../dto/growth.dto';
import { UserGrowthService } from '../services/integration/user-growth.service';

@ApiTags()
@Controller()
@UseGuards()
export class GrowthController {
  constructor(private readonly growthService: UserGrowthService) {}

  @ApiOperation()
  @ApiResponse({
    status: 200,
    description: '成功获取成长指标',
    type: GrowthMetricsResponseDto,
  })
  @Get()
  async getMetrics(@CurrentUser() userId: string) {
    return this.growthService.getGrowthMetrics(userId);
  }

  @ApiOperation()
  @ApiResponse({
    status: 201,
    description: '成功记录活动',
  })
  @Post()
  async recordActivity(@CurrentUser() userId: string, @Body() activity: RecordActivityDto) {
    return this.growthService.recordActivity(userId, activity);
  }
}
