import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne() => User)
  user: User;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  amount: number;

  @Column()
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    type: 'virtual' | 'physical';
    metadata: Record<string, any>;
  }>;

  @Column()
  payment: {
    method: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    gateway: string;
    transactionId?: string;
  };

  @Column()
  shipping?: {
    method: string;
    address: {
      recipient: string;
      phone: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    tracking?: {
      carrier: string;
      trackingNumber: string;
      status: string;
    };
  };

  @CreateDateColumn()
  createdAt: Date;
}
