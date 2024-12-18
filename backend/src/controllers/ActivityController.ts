import { ActivityService } from '../services/ActivityService';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@Controller('activities')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // 创建活动（仅管理员）
  @Post()
  @Roles('admin')
  async createActivity(@CurrentUser() currentUser: any, @Body() data: any) {
    return this.activityService.createActivity({
      ...data,
      createdBy: currentUser.id,
    });
  }

  // 更新活动（仅管理员）
  @Put(':id')
  @Roles('admin')
  async updateActivity(@Param('id') id: string, @Body() data: any) {
    return this.activityService.updateActivity(id, data);
  }

  // 获取活动详情
  @Get(':id')
  async getActivity(@Param('id') id: string) {
    return this.activityService.getActivity(id);
  }

  // 获取活动列表
  @Get()
  async getActivities(
    @Query('type') type: string,
    @Query('category') category: string,
    @Query('status') status: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const query: any = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;

    return this.activityService.getActivities(query, page, limit);
  }

  // 参加活动
  @Post(':id/join')
  async joinActivity(@CurrentUser() currentUser: any, @Param('id') activityId: string) {
    return this.activityService.joinActivity(activityId, currentUser.id);
  }

  // 更新活动进度
  @Post(':id/progress')
  async updateProgress(
    @CurrentUser() currentUser: any,
    @Param('id') activityId: string,
    @Body() progress: any,
  ) {
    return this.activityService.updateProgress(activityId, currentUser.id, progress);
  }

  // 获取活动排行榜
  @Get(':id/leaderboard')
  async getLeaderboard(@Param('id') activityId: string, @Query('metric') metric = 'points') {
    return this.activityService.getLeaderboard(activityId, metric);
  }

  // 获取用户活动统计
  @Get('user/stats')
  async getUserActivityStats(@CurrentUser() currentUser: any) {
    return this.activityService.getUserActivityStats(currentUser.id);
  }

  // 获取用户参与的活动列表
  @Get('user/participated')
  async getUserParticipatedActivities(
    @CurrentUser() currentUser: any,
    @Query('status') status: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const query = {
      participants: currentUser.id,
    };
    if (status) {
      query['status'] = status;
    }
    return this.activityService.getActivities(query, page, limit);
  }

  // 获取用户创建的活动列表（仅管理员）
  @Get('user/created')
  @Roles('admin')
  async getUserCreatedActivities(
    @CurrentUser() currentUser: any,
    @Query('status') status: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const query = {
      createdBy: currentUser.id,
    };
    if (status) {
      query['status'] = status;
    }
    return this.activityService.getActivities(query, page, limit);
  }

  // 删除活动（仅管理员）
  @Delete(':id')
  @Roles('admin')
  async deleteActivity(@Param('id') id: string) {
    // 这里应该添加软删除功能
    return this.activityService.updateActivity(id, { status: 'cancelled' });
  }
}
