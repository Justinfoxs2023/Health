import { compress, decompress } from 'lz-string';
import { LocalDatabase } from '../utils/local-database';

export class DataCompressionService {
  private db: LocalDatabase;

  constructor() {
    this.db = new LocalDatabase('health-data');
  }

  // 压缩并存储数据
  async compressAndStore(key: string, data: any): Promise<void> {
    // 序列化并压缩
    const serialized = JSON.stringify(data);
    const compressed = compress(serialized);

    // 计算压缩率
    const originalSize = new Blob([serialized]).size;
    const compressedSize = new Blob([compressed]).size;
    const ratio = (compressedSize / originalSize) * 100;

    // 存储压缩数据和元信息
    await this.db.compressAndStore('compressed-data', key, {
      data: compressed,
      metadata: {
        originalSize,
        compressedSize,
        compressionRatio: ratio,
        timestamp: new Date()
      }
    });
  }

  // 检索并解压数据
  async retrieveAndDecompress(key: string): Promise<any> {
    const record = await this.db.retrieveAndDecompress('compressed-data', key);
    if (!record) return null;

    const decompressed = decompress(record.data);
    return JSON.parse(decompressed);
  }

  // 批量压缩
  async batchCompress(dataMap: Map<string, any>): Promise<void> {
    const operations = Array.from(dataMap.entries()).map(([key, data]) =>
      this.compressAndStore(key, data)
    );
    await Promise.all(operations);
  }

  // 清理过期数据
  async cleanupExpiredData(maxAge: number): Promise<void> {
    const now = Date.now();
    const records = await this.db.getAllKeys('compressed-data');
    
    for (const key of records) {
      const metadata = await this.db.get(`metadata:${key}`);
      if (now - metadata.timestamp > maxAge) {
        await this.db.delete('compressed-data', key);
      }
    }
  }
} 