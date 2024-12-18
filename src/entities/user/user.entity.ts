import { Achievement } from '../gamification/achievement.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { HealthRecord } from '../health/health-record.entity';
import { SocialInteraction } from '../social/social-interaction.entity';
import { Transaction } from '../commerce/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  role: 'user' | 'merchant' | 'expert' | 'admin';

  @OneToMany() => HealthRecord, record => record.user)
  healthRecords: HealthRecord[];

  @OneToMany() => SocialInteraction, interaction => interaction.user)
  socialInteractions: SocialInteraction[];

  @OneToMany() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @OneToMany() => Achievement, achievement => achievement.user)
  achievements: Achievement[];
}
