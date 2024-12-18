import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/DatabaseService';
import { EventBus } from '../communication/EventBus';
import { ILogisticsData } from './interfaces';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';

@Injectable()
export class LogisticsService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly eventBus: EventBus,
  ) {}

  async createShipment(orderData: any): Promise<ILogisticsData> {
    try {
      // 创建物流订单
      const logistics: ILogisticsData = {
        orderId: orderData.orderId,
        carrier: await this.selectCarrier(orderData),
        trackingNumber: await this.generateTrackingNumber(),
        status: 'pending',
        timeline: [
          {
            status: 'created',
            timestamp: new Date(),
            description: '物流订单已创建',
          },
        ],
      };

      // 保存物流信息
      await this.databaseService.create('logistics', logistics);

      // 发送事件
      await this.eventBus.emit('logistics.created', { logistics });

      return logistics;
    } catch (error) {
      this.logger.error('创建物流订单失败', error);
      throw error;
    }
  }

  async updateShipmentStatus(
    trackingNumber: string,
    status: string,
    location?: string,
  ): Promise<void> {
    try {
      // 更新物流状态
      const logistics = await this.databaseService.findOne('logistics', { trackingNumber });

      if (!logistics) {
        throw new Error('物流订单不存在');
      }

      logistics.status = status;
      logistics.timeline.push({
        status,
        timestamp: new Date(),
        location,
        description: this.getStatusDescription(status),
      });

      // 保存更新
      await this.databaseService.update('logistics', { trackingNumber }, logistics);

      // 发送事件
      await this.eventBus.emit('logistics.updated', { logistics });
    } catch (error) {
      this.logger.error('更新物流状态失败', error);
      throw error;
    }
  }

  async getShipmentInfo(trackingNumber: string): Promise<ILogisticsData> {
    try {
      const logistics = await this.databaseService.findOne('logistics', { trackingNumber });

      if (!logistics) {
        throw new Error('物流订单不存在');
      }

      return logistics;
    } catch (error) {
      this.logger.error('获取物流信息失败', error);
      throw error;
    }
  }

  private async selectCarrier(orderData: any): Promise<string> {
    // 根据订单信息选择合适的物流商
    // TODO: 实现智能物流商选择算法
    return 'default_carrier';
  }

  private async generateTrackingNumber(): Promise<string> {
    // 生成唯一的物流单号
    const prefix = 'LG';
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  private getStatusDescription(status: string): string {
    const descriptions = {
      pending: '等待揽收',
      shipping: '运输中',
      delivered: '已送达',
      exception: '运输异常',
    };
    return descriptions[status] || status;
  }
}
