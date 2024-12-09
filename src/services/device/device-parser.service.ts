import { Logger } from '../../utils/logger';
import { Device, DeviceType } from '../../types/device';
import { HealthData } from '../../types/health';

export class DeviceParserService {
  private logger: Logger;
  private parsers: Map<DeviceType, DataParser>;

  constructor() {
    this.logger = new Logger('DeviceParser');
    this.initializeParsers();
  }

  // 解析设备数据
  async parseDeviceData(device: Device, rawData: any): Promise<HealthData[]> {
    try {
      const parser = this.parsers.get(device.type);
      if (!parser) {
        throw new Error(`不支持的设备类型: ${device.type}`);
      }

      // 预处理数据
      const preprocessed = await this.preprocessData(rawData, device);
      
      // 解析数据
      const parsed = await parser.parse(preprocessed);
      
      // 验证数据
      await this.validateParsedData(parsed, device);
      
      return parsed;
    } catch (error) {
      this.logger.error('设备数据解析失败', error);
      throw error;
    }
  }

  // 注册自定义解析器
  registerParser(type: DeviceType, parser: DataParser): void {
    this.parsers.set(type, parser);
  }

  // 初始化解析器
  private initializeParsers(): void {
    this.parsers = new Map([
      ['smartwatch', new SmartwatchParser()],
      ['fitnessBand', new FitnessBandParser()],
      ['bloodPressure', new BloodPressureParser()],
      ['glucoseMeter', new GlucoseMeterParser()],
      ['heartRateMonitor', new HeartRateParser()],
      ['sleepMonitor', new SleepMonitorParser()],
      ['ecgMonitor', new ECGMonitorParser()],
      ['thermometer', new ThermometerParser()]
    ]);
  }
} 