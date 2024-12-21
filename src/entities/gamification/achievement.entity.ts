import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne() => User)
  user: User;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  progress: {
    current: number;
    target: number;
    level: number;
    status: 'in_progress' | 'completed';
  };

  @Column()
  rewards: {
    experience: number;
    coins: number;
    items?: Array<{
      id: string;
      type: string;
      quantity: number;
    }>;
    badges?: string[];
  };

  @Column()
  conditions: {
    requirements: Array<{
      type: string;
      target: number;
      operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    }>;
    timeFrame?: {
      start: Date;
      end: Date;
    };
  };

  @CreateDateColumn()
  unlockedAt: Date;
}
