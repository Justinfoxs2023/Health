import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  value: number;

  @Column()
  items: any[];

  @Column()
  expireAt: Date;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
