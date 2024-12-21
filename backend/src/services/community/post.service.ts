import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { BadRequestException, NotFoundException } from '@/exceptions';
import { Comment } from '@/schemas/community/comment.schema';
import { CreateCommentDto } from '@/dto/community/comment.dto';
import { CreatePostDto, UpdatePostDto } from '@/dto/community/post.dto';
import { Interaction } from '@/schemas/community/interaction.schema';
import { PaginationDto } from '@/dto/common/pagination.dto';
import { Post } from '@/schemas/community/post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Interaction.name) private interactionModel: Model<Interaction>,
  ) {}

  async createPost(userId: string, createPostDto: CreatePostDto): Promise<Post> {
    const post = new this.postModel({
      ...createPostDto,
      user_id: userId,
      status: 'published',
      metrics: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      },
      created_at: new Date(),
      updated_at: new Date(),
    });

    return post.save();
  }

  async getPosts(query: PaginationDto & { status?: string; category_id?: string }) {
    const { page = 1, pageSize = 10, status = 'published', category_id } = query;
    const skip = (page - 1) * pageSize;

    const filter: any = { status };
    if (category_id) {
      filter.category_id = category_id;
    }

    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('user_id', 'username avatar')
        .populate('category_id', 'name'),
      this.postModel.countDocuments(filter),
    ]);

    return {
      data: posts,
      pagination: {
        current: page,
        pageSize,
        total,
      },
    };
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('user_id', 'username avatar')
      .populate('category_id', 'name');

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 增加浏览量
    await this.postModel.updateOne({ _id: id }, { $inc: { 'metrics.views': 1 } });

    return post;
  }

  async updatePost(id: string, userId: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user_id.toString() !== userId) {
      throw new BadRequestException('No permission to update this post');
    }

    Object.assign(post, updatePostDto, { updated_at: new Date() });
    return post.save();
  }

  async deletePost(id: string, userId: string): Promise<void> {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user_id.toString() !== userId) {
      throw new BadRequestException('No permission to delete this post');
    }

    await Promise.all([
      this.postModel.deleteOne({ _id: id }),
      this.commentModel.deleteMany({ post_id: id }),
      this.interactionModel.deleteMany({ target_id: id, target_type: 'post' }),
    ]);
  }

  async createComment(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = new this.commentModel({
      ...createCommentDto,
      user_id: userId,
      post_id: postId,
      status: 'active',
      metrics: {
        likes: 0,
        replies: 0,
      },
      created_at: new Date(),
      updated_at: new Date(),
    });

    await Promise.all([
      comment.save(),
      this.postModel.updateOne({ _id: postId }, { $inc: { 'metrics.comments': 1 } }),
    ]);

    return comment;
  }

  async getComments(postId: string, query: PaginationDto) {
    const { page = 1, pageSize = 10 } = query;
    const skip = (page - 1) * pageSize;

    const [comments, total] = await Promise.all([
      this.commentModel
        .find({ post_id: postId, parent_id: null })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('user_id', 'username avatar'),
      this.commentModel.countDocuments({ post_id: postId, parent_id: null }),
    ]);

    // 获取每个评论的回复
    const commentsWithReplies = await Promise.all(
      comments.map(async comment => {
        const replies = await this.commentModel
          .find({ parent_id: comment._id })
          .sort({ created_at: 1 })
          .populate('user_id', 'username avatar');
        return {
          ...comment.toObject(),
          replies,
        };
      }),
    );

    return {
      data: commentsWithReplies,
      pagination: {
        current: page,
        pageSize,
        total,
      },
    };
  }

  async likePost(userId: string, postId: string): Promise<void> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.interactionModel.findOne({
      user_id: userId,
      target_id: postId,
      target_type: 'post',
      interaction_type: 'like',
    });

    if (existingLike) {
      throw new BadRequestException('Already liked this post');
    }

    await Promise.all([
      new this.interactionModel({
        user_id: userId,
        target_id: postId,
        target_type: 'post',
        interaction_type: 'like',
        created_at: new Date(),
      }).save(),
      this.postModel.updateOne({ _id: postId }, { $inc: { 'metrics.likes': 1 } }),
    ]);
  }

  async likeComment(userId: string, commentId: string): Promise<void> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.interactionModel.findOne({
      user_id: userId,
      target_id: commentId,
      target_type: 'comment',
      interaction_type: 'like',
    });

    if (existingLike) {
      throw new BadRequestException('Already liked this comment');
    }

    await Promise.all([
      new this.interactionModel({
        user_id: userId,
        target_id: commentId,
        target_type: 'comment',
        interaction_type: 'like',
        created_at: new Date(),
      }).save(),
      this.commentModel.updateOne({ _id: commentId }, { $inc: { 'metrics.likes': 1 } }),
    ]);
  }

  async favoritePost(userId: string, postId: string): Promise<void> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingFavorite = await this.interactionModel.findOne({
      user_id: userId,
      target_id: postId,
      target_type: 'post',
      interaction_type: 'favorite',
    });

    if (existingFavorite) {
      throw new BadRequestException('Already favorited this post');
    }

    await new this.interactionModel({
      user_id: userId,
      target_id: postId,
      target_type: 'post',
      interaction_type: 'favorite',
      created_at: new Date(),
    }).save();
  }
}
