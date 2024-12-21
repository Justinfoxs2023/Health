import { ILogger } from '../types/logger';
import { IRedisClient } from '../infrastructure/redis';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class NameGeneratorService {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.Redis) private redis: IRedisClient,
  ) {}

  // 姓氏库
  private readonly lastNames = [
    '李',
    '王',
    '张',
    '刘',
    '陈',
    '杨',
    '赵',
    '黄',
    '周',
    '吴',
    '徐',
    '孙',
    '胡',
    '朱',
    '高',
    '林',
    '何',
    '郭',
    '马',
    '罗',
  ];

  // 名字前缀
  private readonly firstNamePrefixes = [
    '金',
    '玉',
    '天',
    '龙',
    '凤',
    '紫',
    '青',
    '白',
    '黑',
    '赤',
    '幻',
    '冰',
    '火',
    '风',
    '云',
    '月',
    '星',
    '光',
    '影',
    '雷',
  ];

  // 名字后缀
  private readonly firstNameSuffixes = [
    '峰',
    '龙',
    '杰',
    '豪',
    '雨',
    '雪',
    '霜',
    '枫',
    '鹰',
    '鹤',
    '剑',
    '刀',
    '弓',
    '箭',
    '盾',
    '斧',
    '锤',
    '琴',
    '笛',
    '鼓',
  ];

  // 称号库
  private readonly titles = [
    '不败',
    '无敌',
    '至尊',
    '王者',
    '霸主',
    '神话',
    '传说',
    '战神',
    '武神',
    '剑圣',
    '仙人',
    '道尊',
    '魔尊',
    '帝君',
    '圣者',
    '天骄',
    '奇才',
    '英杰',
    '豪侠',
    '侠客',
  ];

  // 生成随机名字
  async generateRandomName(): Promise<string> {
    try {
      const nameType = Math.random() > 0.5 ? 'normal' : 'title';

      if (nameType === 'normal') {
        const lastName = this.getRandomElement(this.lastNames);
        const prefix = this.getRandomElement(this.firstNamePrefixes);
        const suffix = this.getRandomElement(this.firstNameSuffixes);
        return `${lastName}${prefix}${suffix}`;
      } else {
        const lastName = this.getRandomElement(this.lastNames);
        const firstName = this.getRandomElement(this.firstNamePrefixes);
        const title = this.getRandomElement(this.titles);
        return `${title}${lastName}${firstName}`;
      }
    } catch (error) {
      this.logger.error('生成随机名字失败', error);
      throw error;
    }
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // 检查名字是否可用
  async checkNameAvailability(name: string): Promise<boolean> {
    try {
      // 检查长度
      if (name.length < 2 || name.length > 12) {
        return false;
      }

      // 检查是否包含特殊字符
      if (!/^[\u4e00-\u9fa5]+$/.test(name)) {
        return false;
      }

      // 检查是否已被使用
      const exists = await this.redis.exists(`character:name:${name}`);
      return !exists;
    } catch (error) {
      this.logger.error('检查名字可用性失败', error);
      throw error;
    }
  }

  // 保存角色名字
  async saveCharacterName(userId: string, name: string): Promise<void> {
    try {
      // 检查名字是否已被使用
      if (!(await this.checkNameAvailability(name))) {
        throw new Error('该名字已被使用或不符合规则');
      }

      // 保存名字
      await this.redis
        .multi()
        .set(`character:name:${name}`, userId)
        .set(`user:${userId}:character:name`, name)
        .exec();
    } catch (error) {
      this.logger.error('保存角色名字失败', error);
      throw error;
    }
  }
}
