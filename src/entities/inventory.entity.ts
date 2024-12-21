import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  type: 'virtual' | 'physical';

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: 'available' | 'on_sale' | 'sold';

  @Column()
  metadata: Record<string, any>;
}
