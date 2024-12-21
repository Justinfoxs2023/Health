import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ILogisticsProvider, IShipmentStatus, IShippingAddress } from '../types/logistics.types';

@Entity()
export class LogisticsOrder {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  providerId: string;

  @Column()
  serviceCode: string;

  @Column()
  trackingNumber: string;

  @Column()
  sender: IShippingAddress;

  @Column()
  receiver: IShippingAddress;

  @Column()
  items: ShipmentItem[];

  @Column()
  status: IShipmentStatus;
}

@Entity()
export class LogisticsProvider {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  supportedRegions: string[];

  @Column()
  services: LogisticsService[];

  @Column()
  trackingUrlTemplate: string;
}
