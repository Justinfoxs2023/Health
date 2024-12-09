import { Logger } from '../../utils/logger';
import { PlatformType } from '../../types/platform';
import { HealthData } from '../../types/health';

export class PlatformTransformerService {
  private logger: Logger;
  private transformers: Map<PlatformType, DataTransformer>;

  constructor() {
    this.logger = new Logger('PlatformTransformer');
    this.initializeTransformers();
  }

  // 转换平台数据
  async transformData(
    data: any,
    platform: PlatformType
  ): Promise<HealthData[]> {
    try {
      const transformer = this.transformers.get(platform);
      if (!transformer) {
        throw new Error(`不支持的平台: ${platform}`);
      }

      // 1. 预处理数据
      const preprocessed = await this.preprocessData(data, platform);
      
      // 2. 转换数据
      const transformed = await transformer.transform(preprocessed);
      
      // 3. 验证数据
      await this.validateTransformedData(transformed);
      
      return transformed;
    } catch (error) {
      this.logger.error('平台数据转换失败', error);
      throw error;
    }
  }

  // 初始化转换器
  private initializeTransformers(): void {
    this.transformers = new Map([
      ['wechat', new WechatTransformer()],
      ['apple', new AppleHealthTransformer()],
      ['huawei', new HuaweiTransformer()],
      ['xiaomi', new XiaomiTransformer()],
      ['samsung', new SamsungTransformer()],
      ['google', new GoogleFitTransformer()],
      ['fitbit', new FitbitTransformer()],
      ['garmin', new GarminTransformer()]
    ]);
  }
} 