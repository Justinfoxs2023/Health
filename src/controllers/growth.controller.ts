import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserGrowthService } from '../services/integration/user-growth.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GrowthActivity } from '../types/growth.types';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GrowthMetricsResponseDto } from '../dto/growth.dto';
import { RecordActivityDto } from '../dto/growth.dto';

@ApiTags('growth')
@Controller('growth')
@UseGuards(AuthGuard)
export class GrowthController {
  constructor(private readonly growthService: UserGrowthService) {}

  @ApiOperation({ summary: '获取成长指标' })
  @ApiResponse({ 
    status: 200, 
    description: '成功获取成长指标',
    type: GrowthMetricsResponseDto 
  })
  @Get('metrics')
  async getMetrics(@CurrentUser() userId: string) {
    return this.growthService.getGrowthMetrics(userId);
  }

  @ApiOperation({ summary: '记录成长活动' })
  @ApiResponse({ 
    status: 201, 
    description: '成功记录活动' 
  })
  @Post('activity')
  async recordActivity(
    @CurrentUser() userId: string,
    @Body() activity: RecordActivityDto
  ) {
    return this.growthService.recordActivity(userId, activity);
  }
} 