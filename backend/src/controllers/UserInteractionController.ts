import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserInteractionService } from '../services/UserInteractionService';

@Controller('user-interaction')
@UseGuards(AuthGuard('jwt'))
export class UserInteractionController {
  constructor(private readonly userInteractionService: UserInteractionService) {}

  // 关注用户
  @Post('follow/:userId')
  async followUser(@CurrentUser() currentUser: any, @Param('userId') userId: string) {
    return this.userInteractionService.followUser(currentUser.id, userId);
  }

  // 取消关注
  @Delete('follow/:userId')
  async unfollowUser(@CurrentUser() currentUser: any, @Param('userId') userId: string) {
    return this.userInteractionService.unfollowUser(currentUser.id, userId);
  }

  // 获取关注列表
  @Get('following')
  async getFollowing(
    @CurrentUser() currentUser: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.userInteractionService.getFollowings(currentUser.id, page, limit);
  }

  // 获取粉丝列表
  @Get('followers')
  async getFollowers(
    @CurrentUser() currentUser: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.userInteractionService.getFollowers(currentUser.id, page, limit);
  }

  // 添加收藏
  @Post('favorite')
  async addFavorite(@CurrentUser() currentUser: any, @Body() data: any) {
    return this.userInteractionService.addFavorite(currentUser.id, data);
  }

  // 取消收藏
  @Delete('favorite/:favoriteId')
  async removeFavorite(@CurrentUser() currentUser: any, @Param('favoriteId') favoriteId: string) {
    return this.userInteractionService.removeFavorite(currentUser.id, favoriteId);
  }

  // 获取收藏列表
  @Get('favorites')
  async getFavorites(
    @CurrentUser() currentUser: any,
    @Query('folder') folder: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.userInteractionService.getFavorites(currentUser.id, folder, page, limit);
  }

  // 获取用户动态时间线
  @Get('timeline')
  async getTimeline(
    @CurrentUser() currentUser: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.userInteractionService.getTimeline(currentUser.id, page, limit);
  }

  // 检查关注状态
  @Get('follow-status/:userId')
  async checkFollowStatus(@CurrentUser() currentUser: any, @Param('userId') userId: string) {
    return this.userInteractionService.checkFollowStatus(currentUser.id, userId);
  }

  // 获取互动统计
  @Get('stats')
  async getInteractionStats(@CurrentUser() currentUser: any) {
    return this.userInteractionService.getInteractionStats(currentUser.id);
  }
}
