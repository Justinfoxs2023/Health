import { UserRoleType } from './base.types';

// 任务类型
export type QuestType =
  any; // 活动任务

// 任务状态
export type QuestStatusType =
  any; // 失败

// 任务配置
export interface IQuest {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: "main" | "role" | "daily" | "weekly" | "achievement" | "event";
  /** name 的描述 */
    name: string;
  /** description 的描述 */
    description: string;
  /** requirements 的描述 */
    requirements: {
    level: number;
    previousQuests: string;
    roleType: UserRoleType;
  };
  /** objectives 的描述 */
    objectives: IQuestObjective[];
  /** rewards 的描述 */
    rewards: IQuestReward[];
  /** timeLimit 的描述 */
    timeLimit?: undefined | number; // 秒为单位
  /** repeatable 的描述 */
    repeatable: false | true;
}

// 任务目标
export interface IQuestObjective {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: string;
  /** target 的描述 */
    target: number;
  /** current 的描述 */
    current: number;
  /** description 的描述 */
    description: string;
}

// 任务奖励
export interface IQuestReward {
  /** type 的描述 */
    type: exp  points  item  feature  title;
  value: number  string;
  amount: number;
}

// 任务线配置
export interface IQuestLine {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: "main" | "role" | "daily" | "weekly" | "achievement" | "event";
  /** description 的描述 */
    description: string;
  /** chapters 的描述 */
    chapters: IQuestChapter;
  /** requirements 的描述 */
    requirements: {
    level: number;
    previousQuestLines: string;
  };
}

// 任务章节
export interface IQuestChapter {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** quests 的描述 */
    quests: IQuest;
  /** requirements 的描述 */
    requirements: {
    level: number;
    previousChapters: string;
  };
}
