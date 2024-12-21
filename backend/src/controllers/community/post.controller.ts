import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('社
import { AuthGuard } from '@/guards/auth.guard';
import { CreateCommentDto } from '@/dto/community/comment.dto';
import { CreatePostDto, UpdatePostDto } from '@/dto/community/post.dto';
import { PaginationDto } from '@/dto/common/pagination.dto';
import { PostService } from '@/services/community/post.service';

区帖子')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '创建帖子' })
  @ApiResponse({ status: 201, description: '帖子创建成功' })
  async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(req.user.id, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '获取帖子列表' })
  @ApiResponse({ status: 200, description: '获取帖子列表成功' })
  async getPosts(@Query() query: PaginationDto & { status?: string; category_id?: string }) {
    return this.postService.getPosts(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取帖子详情' })
  @ApiResponse({ status: 200, description: '获取帖子详情成功' })
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '更新帖子' })
  @ApiResponse({ status: 200, description: '帖子更新成功' })
  async updatePost(@Request() req, @Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.updatePost(id, req.user.id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '删除帖子' })
  @ApiResponse({ status: 200, description: '帖子删除成功' })
  async deletePost(@Request() req, @Param('id') id: string) {
    return this.postService.deletePost(id, req.user.id);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '创建评论' })
  @ApiResponse({ status: 201, description: '评论创建成功' })
  async createComment(
    @Request() req,
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postService.createComment(req.user.id, postId, createCommentDto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '获取评论列表' })
  @ApiResponse({ status: 200, description: '获取评论列表成功' })
  async getComments(@Param('id') postId: string, @Query() query: PaginationDto) {
    return this.postService.getComments(postId, query);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '点赞帖子' })
  @ApiResponse({ status: 200, description: '帖子点赞成功' })
  async likePost(@Request() req, @Param('id') postId: string) {
    return this.postService.likePost(req.user.id, postId);
  }

  @Post('comments/:id/like')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '点赞评论' })
  @ApiResponse({ status: 200, description: '评论点赞成功' })
  async likeComment(@Request() req, @Param('id') commentId: string) {
    return this.postService.likeComment(req.user.id, commentId);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '收藏帖子' })
  @ApiResponse({ status: 200, description: '帖子收藏成功' })
  async favoritePost(@Request() req, @Param('id') postId: string) {
    return this.postService.favoritePost(req.user.id, postId);
  }
}
