import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class SocialInteraction {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne() => User)
  user: User;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  content: {
    text?: string;
    media?: Array<{
      type: string;
      url: string;
    }>;
    tags?: string[];
    location?: {
      latitude: number;
      longitude: number;
      name: string;
    };
  };

  @Column()
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };

  @Column()
  visibility: {
    scope: 'public' | 'friends' | 'private';
    excludedUsers?: string[];
    includedGroups?: string[];
  };

  @CreateDateColumn()
  createdAt: Date;
}
