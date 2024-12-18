import { EventEmitter } from '../../utils/event-emitter';
import { IDevice, DeviceType, IConnectionInfo } from '../../types/device';
import { Logger } from '../../utils/logger';

export class DeviceConnectionService {
  private logger: Logger;
  private events: EventEmitter;
  private connectedDevices: Map<string, IDevice>;

  constructor() {
    this.logger = new Logger('DeviceConnection');
    this.events = new EventEmitter();
    this.connectedDevices = new Map();
  }

  // 扫描设备
  async scanDevices(type?: DeviceType): Promise<IDevice[]> {
    try {
      // 扫描蓝牙设备
      const bluetoothDevices = await this.scanBluetoothDevices(type);

      // 扫描WiFi设备
      const wifiDevices = await this.scanWifiDevices(type);

      // 扫描USB设备
      const usbDevices = await this.scanUsbDevices(type);

      return [...bluetoothDevices, ...wifiDevices, ...usbDevices];
    } catch (error) {
      this.logger.error('设备扫描失败', error);
      throw error;
    }
  }

  // 连接设备
  async connectDevice(device: IDevice): Promise<void> {
    try {
      switch (device.connectionInfo.protocol) {
        case 'bluetooth':
          await this.connectBluetoothDevice(device);
          break;
        case 'wifi':
          await this.connectWifiDevice(device);
          break;
        case 'usb':
          await this.connectUsbDevice(device);
          break;
      }

      this.connectedDevices.set(device.id, device);
      this.events.emit('deviceConnected', device);
    } catch (error) {
      this.logger.error('设备连接失败', error);
      throw error;
    }
  }

  // 断开设备连接
  async disconnectDevice(deviceId: string): Promise<void> {
    try {
      const device = this.connectedDevices.get(deviceId);
      if (!device) {
        throw new Error('设备未连接');
      }

      await this.performDisconnect(device);
      this.connectedDevices.delete(deviceId);
      this.events.emit('deviceDisconnected', device);
    } catch (error) {
      this.logger.error('设备断开连接失败', error);
      throw error;
    }
  }
}
