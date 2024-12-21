import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const deflate = promisify(zlib.deflate);
const inflate = promisify(zlib.inflate);
const brotliCompress = promisify(zlib.brotliCompress);
const brotliDecompress = promisify(zlib.brotliDecompress);

export interface IDataCompressorOptions {
  /** algorithm 的描述 */
    algorithm: gzip  deflate  brotli;
  compressionLevel: number;
  dictionary: Buffer;
}

/**
 * 数据压缩器类
 */
export class DataCompressor {
  private algorithm: string;
  private compressionLevel: number;
  private dictionary?: Buffer;

  constructor(options: IDataCompressorOptions) {
    this.algorithm = options.algorithm;
    this.compressionLevel = options.compressionLevel || 6;
    this.dictionary = options.dictionary;
  }

  /**
   * 压缩数据
   */
  public async compress(data: any): Promise<Buffer> {
    const input = this.serializeData(data);
    const options = {
      level: this.compressionLevel,
      dictionary: this.dictionary,
    };

    switch (this.algorithm) {
      case 'gzip':
        return await gzip(input, options);
      case 'deflate':
        return await deflate(input, options);
      case 'brotli':
        return await brotliCompress(input, {
          ...options,
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: this.compressionLevel,
          },
        });
      default:
        throw new Error(`不支持的压缩算法: ${this.algorithm}`);
    }
  }

  /**
   * 解压数据
   */
  public async decompress(data: Buffer): Promise<any> {
    const options = {
      dictionary: this.dictionary,
    };

    let decompressed: Buffer;
    switch (this.algorithm) {
      case 'gzip':
        decompressed = await gunzip(data, options);
        break;
      case 'deflate':
        decompressed = await inflate(data, options);
        break;
      case 'brotli':
        decompressed = await brotliDecompress(data, options);
        break;
      default:
        throw new Error(`不支持的解压算法: ${this.algorithm}`);
    }

    return this.deserializeData(decompressed);
  }

  /**
   * 序列化数据
   */
  private serializeData(data: any): Buffer {
    if (Buffer.isBuffer(data)) {
      return data;
    }
    if (typeof data === 'string') {
      return Buffer.from(data);
    }
    return Buffer.from(JSON.stringify(data));
  }

  /**
   * 反序列化数据
   */
  private deserializeData(data: Buffer): any {
    const str = data.toString();
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  }

  /**
   * 计算压缩率
   */
  public calculateCompressionRatio(original: Buffer, compressed: Buffer): number {
    return 1 - compressed.length / original.length;
  }

  /**
   * 估算压缩后的大小
   */
  public estimateCompressedSize(data: any): number {
    const serialized = this.serializeData(data);
    // 根据不同算法的平均压缩率估算
    const estimatedRatios = {
      gzip: 0.3,
      deflate: 0.35,
      brotli: 0.25,
    };
    return Math.ceil(
      serialized.length * estimatedRatios[this.algorithm as keyof typeof estimatedRatios],
    );
  }

  /**
   * 获取当前压缩器配置
   */
  public getConfiguration(): IDataCompressorOptions {
    return {
      algorithm: this.algorithm as IDataCompressorOptions['algorithm'],
      compressionLevel: this.compressionLevel,
      dictionary: this.dictionary,
    };
  }
}
