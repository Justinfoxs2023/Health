import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommunityActivity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';

  @Column()
  participants: string[];

  @Column()
  rewards: Record<string, any>;

  @Column()
  rules: Record<string, any>;
}
