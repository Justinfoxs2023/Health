/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IHealthGroup {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** description 的描述 */
  description: string;
  /** coverImage 的描述 */
  coverImage: string;
  /** category 的描述 */
  category: GroupCategory;
  /** members 的描述 */
  members: string[];
  /** topics 的描述 */
  topics: Topic[];
  /** activities 的描述 */
  activities: IGroupActivity[];
  /** createTime 的描述 */
  createTime: Date;
  /** status 的描述 */
  status: GroupStatus;
}

export interface IGroupActivity {
  /** id 的描述 */
  id: string;
  /** groupId 的描述 */
  groupId: string;
  /** title 的描述 */
  title: string;
  /** description 的描述 */
  description: string;
  /** type 的描述 */
  type: ActivityType;
  /** startTime 的描述 */
  startTime: Date;
  /** endTime 的描述 */
  endTime: Date;
  /** location 的描述 */
  location?: string;
  /** maxParticipants 的描述 */
  maxParticipants?: number;
  /** participants 的描述 */
  participants: string[];
  /** status 的描述 */
  status: ActivityStatus;
  /** createTime 的描述 */
  createTime: Date;
}

export interface IExperience {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** groupId 的描述 */
  groupId?: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** images 的描述 */
  images?: string[];
  /** tags 的描述 */
  tags: string[];
  /** likes 的描述 */
  likes: number;
  /** comments 的描述 */
  comments: Comment[];
  /** createTime 的描述 */
  createTime: Date;
}

export interface IConsultation {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** expertId 的描述 */
  expertId: string;
  /** topic 的描述 */
  topic: string;
  /** content 的描述 */
  content: string;
  /** attachments 的描述 */
  attachments?: string[];
  /** scheduleTime 的描述 */
  scheduleTime?: Date;
  /** status 的描述 */
  status: ConsultationStatus;
  /** reply 的描述 */
  reply?: ConsultationReply;
  /** createTime 的描述 */
  createTime: Date;
  /** replyTime 的描述 */
  replyTime?: Date;
}
