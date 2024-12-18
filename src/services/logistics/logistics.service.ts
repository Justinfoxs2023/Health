import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { IShipmentStatus, IShipmentItem, IShippingAddress } from '../../types/logistics.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { LogisticsOrder, ILogisticsProvider } from '../../entities/logistics.entity';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LogisticsService {
  private readonly logger = console;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository()
    private readonly orderRepo: Repository<LogisticsOrder>,
    @InjectRepository()
    private readonly providerRepo: Repository<ILogisticsProvider>,
  ) {}

  // 创建物流订单
  async createShipment(item: IShipmentItem, receiverId: string): Promise<LogisticsOrder> {
    try {
      // 选择合适的物流商
      const provider = await this.selectBestProvider(item);

      // 创建物流订单
      const order = await this.createLogisticsOrder({
        providerId: provider.id,
        serviceCode: provider.services[0].code,
        items: [item],
        receiver: await this.getUserAddress(receiverId),
        sender: await this.getWarehouseAddress(),
      });

      // 通知物流商
      await this.notifyProvider(order);

      return order;
    } catch (error) {
      this.logger.error('创建物流订单失败', error);
      throw error;
    }
  }

  // 查询物流状态
  async getShipmentStatus(trackingId: string): Promise<IShipmentStatus> {
    try {
      const order = await this.orderRepo.findOne({ where: { trackingNumber: trackingId } });
      const provider = await this.getProvider(order.providerId);

      // 调用物流商API
      const response = await firstValueFrom(
        this.httpService.get(this.buildTrackingUrl(provider, trackingId)),
      );

      return this.formatTrackingInfo(response.data);
    } catch (error) {
      this.logger.error('查询物流状态失败', error);
      throw error;
    }
  }

  private async selectBestProvider(item: IShipmentItem): Promise<ILogisticsProvider> {
    // 实现物流商选择逻辑
    return {} as ILogisticsProvider;
  }

  private buildTrackingUrl(provider: ILogisticsProvider, trackingId: string): string {
    return provider.trackingUrlTemplate.replace('{tracking_number}', trackingId);
  }

  private formatTrackingInfo(rawData: any): IShipmentStatus {
    // 实现物流信息格式化逻辑
    return {} as IShipmentStatus;
  }

  private async getProvider(providerId: string): Promise<ILogisticsProvider> {
    const provider = await this.providerRepo.findOne({ where: { id: providerId } });
    if (!provider) {
      throw new Error('物流商不存在');
    }
    return provider;
  }

  private async getUserAddress(userId: string): Promise<IShippingAddress> {
    // 实现获取用户地址的逻辑
    return {} as IShippingAddress;
  }

  private async getWarehouseAddress(): Promise<IShippingAddress> {
    // 实现获取仓库地址的逻辑
    return {} as IShippingAddress;
  }

  private async createLogisticsOrder(data: Partial<LogisticsOrder>): Promise<LogisticsOrder> {
    const order = this.orderRepo.create(data);
    return await this.orderRepo.save(order);
  }

  private async notifyProvider(order: LogisticsOrder): Promise<void> {
    // 实现通知物流商的逻辑
  }
}
