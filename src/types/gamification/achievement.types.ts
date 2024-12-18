/**
 * @fileoverview TS 文件 achievement.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IAchievement {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** requirements 的描述 */
    requirements: IAchievementRequirement;
  /** rewards 的描述 */
    rewards: IAchievementReward;
  /** unlockedAt 的描述 */
    unlockedAt: Date;
}

export interface IAchievementRequirement {
  /** type 的描述 */
    type: string;
  /** value 的描述 */
    value: number;
  /** progress 的描述 */
    progress: number;
}

export interface IAchievementReward {
  /** type 的描述 */
    type: string;
  /** value 的描述 */
    value: number;
}

export interface IAchievementConfig {
  /** categories 的描述 */
    categories: {
    health_tracking: {
      name: ;
      description: ;
      achievements: {
        first_record: {
          name: ;
          description: ;
          reward: {
            exp: 100;
            points: 150;
            title: ;
          };
        };
        weekly_master: {
          name: '周记达人';
          description: '连续7天记录健康数据';
          reward: {
            exp: 300;
            points: 400;
            title: '坚持达人';
          };
        };
      };
    };

    exercise: {
      name: '运动健将';
      description: '运动相关成就';
      achievements: {
        // ... 运动相关成就配置
      };
    };

    social: {
      name: '社交达人';
      description: '社交互动成就';
      achievements: {
        // ... 社交相关成就配置
      };
    };
  };
}
