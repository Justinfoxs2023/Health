import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserGrowth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  level: number;

  @Column()
  experience: number;

  @Column('json')
  achievements: string[];

  @Column('timestamp')
  lastUpdated: Date;
} 