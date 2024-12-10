import { Logger } from '../../utils/logger';
import { Device } from '../../types/device';
import { DeviceConnectionService } from './device-connection.service';
import { DeviceSyncService } from './device-sync.service';
import { DeviceParserService } from './device-parser.service';

export class DeviceManagerService {
  private logger: Logger;
  private connectionService: DeviceConnectionService;
  private syncService: DeviceSyncService;
  private parserService: DeviceParserService;

  constructor() {
    this.logger = new Logger('DeviceManager');
    this.connectionService = new DeviceConnectionService();
    this.syncService = new DeviceSyncService();
    this.parserService = new DeviceParserService();
  }

  // 添加设备
  async addDevice(device: Device): Promise<void> {
    try {
      // 验证设备
      await this.validateDevice(device);
      
      // 连接设备
      await this.connectionService.connectDevice(device);
      
      // 配置同步
      await this.syncService.configureAutoSync(device, {
        interval: 300000, // 5分钟
        retryAttempts: 3,
        filters: ['all']
      });
      
      // 注册设备
      await this.registerDevice(device);
    } catch (error) {
      this.logger.error('添加设备失败', error);
      throw error;
    }
  }

  // 移除设备
  async removeDevice(deviceId: string): Promise<void> {
    try {
      // 断开连接
      await this.connectionService.disconnectDevice(deviceId);
      
      // 清理同步配置
      await this.syncService.clearSyncConfig(deviceId);
      
      // 注销设备
      await this.unregisterDevice(deviceId);
    } catch (error) {
      this.logger.error('移除设备失败', error);
      throw error;
    }
  }

  // 获取设备数据
  async getDeviceData(deviceId: string): Promise<HealthData[]> {
    try {
      const device = await this.getDevice(deviceId);
      
      // 同步数据
      const rawData = await this.syncService.syncDeviceData(device);
      
      // 解析数据
      return await this.parserService.parseDeviceData(device, rawData);
    } catch (error) {
      this.logger.error('获取设备数据失败', error);
      throw error;
    }
  }
} 