import * as zlib from 'zlib';
import { promisify } from 'util';

export class CompressionUtils {
  private static gzip = promisify(zlib.gzip);
  private static gunzip = promisify(zlib.gunzip);
  private static deflate = promisify(zlib.deflate);
  private static inflate = promisify(zlib.inflate);

  // GZIP压缩
  static async gzipCompress(data: string | Buffer): Promise<Buffer> {
    return await this.gzip(data);
  }

  // GZIP解压
  static async gzipDecompress(compressed: Buffer): Promise<Buffer> {
    return await this.gunzip(compressed);
  }

  // Deflate压缩
  static async deflateCompress(data: string | Buffer): Promise<Buffer> {
    return await this.deflate(data);
  }

  // Deflate解压
  static async deflateDecompress(compressed: Buffer): Promise<Buffer> {
    return await this.inflate(compressed);
  }

  // 自动选择最佳压缩方法
  static async smartCompress(
    data: string | Buffer,
    options?: { threshold?: number }
  ): Promise<{ compressed: Buffer; method: string }> {
    const threshold = options?.threshold || 1024; // 默认1KB阈值
    
    if (Buffer.byteLength(data) < threshold) {
      return {
        compressed: Buffer.from(data),
        method: 'none'
      };
    }

    const [gzipped, deflated] = await Promise.all([
      this.gzipCompress(data),
      this.deflateCompress(data)
    ]);

    if (gzipped.length <= deflated.length) {
      return {
        compressed: gzipped,
        method: 'gzip'
      };
    }

    return {
      compressed: deflated,
      method: 'deflate'
    };
  }
} 