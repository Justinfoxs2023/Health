export interface HealthGroup {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  category: GroupCategory;
  members: string[];
  topics: Topic[];
  activities: GroupActivity[];
  createTime: Date;
  status: GroupStatus;
}

export interface GroupActivity {
  id: string;
  groupId: string;
  title: string;
  description: string;
  type: ActivityType;
  startTime: Date;
  endTime: Date;
  location?: string;
  maxParticipants?: number;
  participants: string[];
  status: ActivityStatus;
  createTime: Date;
}

export interface Experience {
  id: string;
  userId: string;
  groupId?: string;
  title: string;
  content: string;
  images?: string[];
  tags: string[];
  likes: number;
  comments: Comment[];
  createTime: Date;
}

export interface Consultation {
  id: string;
  userId: string;
  expertId: string;
  topic: string;
  content: string;
  attachments?: string[];
  scheduleTime?: Date;
  status: ConsultationStatus;
  reply?: ConsultationReply;
  createTime: Date;
  replyTime?: Date;
} 