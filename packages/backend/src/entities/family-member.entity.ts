import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserGrowth } from './user-growth.entity';

@Entity()
export class FamilyMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  healthStatus: string;

  @Column()
  familyId: string;

  @ManyToOne(() => UserGrowth)
  userGrowth: UserGrowth;
}
