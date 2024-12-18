import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Comment } from '@/schemas/community/comment.schema';
import { ModerationLog } from '@/schemas/community/moderation.schema';
import { ModerationRule } from '@/schemas/community/moderation.schema';
import { Post } from '@/schemas/community/post.schema';
import { RedisService } from '@/services/redis/redis.service';

@Injectable()
export class ModerationService {
  constructor(
    @InjectModel(ModerationRule.name)
    private moderationRuleModel: Model<ModerationRule>,
    @InjectModel(ModerationLog.name)
    private moderationLogModel: Model<ModerationLog>,
    @InjectModel(Post.name)
    private postModel: Model<Post>,
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async moderateContent(content: string, type: 'post' | 'comment', targetId: string) {
    // 获取活跃的审核规则
    const rules = await this.moderationRuleModel.find({ is_active: true });

    // 应用每个规则进行检查
    for (const rule of rules) {
      const isViolation = await this.checkRule(content, rule);

      if (isViolation) {
        // 创建审核日志
        await this.createModerationLog({
          target_id: targetId,
          target_type: type,
          rule_id: rule._id,
          trigger_type: 'auto',
          status: rule.action === 'block' ? 'blocked' : 'pending',
          reason: `Violated rule: ${rule.name}`,
          metadata: { content },
        });

        // 如果规则要求阻止内容
        if (rule.action === 'block') {
          await this.blockContent(type, targetId);
        }

        // 如果规则要求通知
        if (rule.action === 'notify') {
          await this.notifyModerators(type, targetId, rule);
        }

        return {
          passed: false,
          action: rule.action,
          rule: rule.name,
        };
      }
    }

    return { passed: true };
  }

  private async checkRule(content: string, rule: ModerationRule) {
    switch (rule.type) {
      case 'keyword':
        return this.checkKeywords(content, rule.criteria.keywords || []);
      case 'regex':
        return this.checkRegex(content, rule.criteria.pattern || '');
      case 'ai':
        return this.checkWithAI(content, rule.criteria);
      default:
        return false;
    }
  }

  private checkKeywords(content: string, keywords: string[]) {
    const lowerContent = content.toLowerCase();
    return keywords.some(keyword => lowerContent.includes(keyword.toLowerCase()));
  }

  private checkRegex(content: string, pattern: string) {
    try {
      const regex = new RegExp(pattern, 'i');
      return regex.test(content);
    } catch (error) {
      console.error('Error in moderation.service.ts:', 'Invalid regex pattern:', error);
      return false;
    }
  }

  private async checkWithAI(content: string, criteria: any) {
    // 集成AI内容审核服务
    // TODO: 实现AI审核逻辑
    return false;
  }

  private async blockContent(type: 'post' | 'comment', targetId: string) {
    const model = type === 'post' ? this.postModel : this.commentModel;
    await model.findByIdAndUpdate(targetId, { status: 'blocked' });
  }

  private async notifyModerators(type: 'post' | 'comment', targetId: string, rule: ModerationRule) {
    // 发送通知给管理员
    // TODO: 实现通知逻辑
  }

  async createModerationLog(data: Partial<ModerationLog>) {
    return this.moderationLogModel.create(data);
  }

  async getPendingModerations(page = 1, pageSize = 20) {
    const total = await this.moderationLogModel.countDocuments({ status: 'pending' });
    const items = await this.moderationLogModel
      .find({ status: 'pending' })
      .sort({ created_at: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('rule_id')
      .populate('moderator_id');

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  async reviewModeration(
    logId: string,
    moderatorId: string,
    decision: 'approved' | 'rejected',
    reason?: string,
  ) {
    const log = await this.moderationLogModel.findById(logId);
    if (!log) {
      throw new Error('Moderation log not found');
    }

    // 更新审核日志
    log.status = decision;
    log.moderator_id = moderatorId;
    log.reason = reason;
    log.updated_at = new Date();
    await log.save();

    // 更新内容状态
    const model = log.target_type === 'post' ? this.postModel : this.commentModel;
    await model.findByIdAndUpdate(log.target_id, {
      status: decision === 'approved' ? 'active' : 'blocked',
    });

    return log;
  }

  async getModerationRules(page = 1, pageSize = 20) {
    const total = await this.moderationRuleModel.countDocuments();
    const rules = await this.moderationRuleModel
      .find()
      .sort({ created_at: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return {
      items: rules,
      total,
      page,
      pageSize,
    };
  }

  async createModerationRule(data: Partial<ModerationRule>) {
    return this.moderationRuleModel.create(data);
  }

  async updateModerationRule(ruleId: string, data: Partial<ModerationRule>) {
    return this.moderationRuleModel.findByIdAndUpdate(ruleId, data, { new: true });
  }

  async deleteModerationRule(ruleId: string) {
    return this.moderationRuleModel.findByIdAndDelete(ruleId);
  }
}
