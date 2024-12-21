import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { UserGameProfile } from './user-game-profile.entity';

@Entity()
export class TeamChallenge {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;

  @ManyToOne() => UserGameProfile)
  initiator: UserGameProfile;

  @ManyToMany() => UserGameProfile)
  @JoinTable()
  participants: UserGameProfile[];

  @Column()
  milestones: any[];

  @Column()
  rewards: any;

  @Column()
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}
