// 存储类型枚举
export enum StorageType {
  LOCAL = 'local',    // 本地存储
  S3 = 's3',         // AWS S3
  OSS = 'oss',       // 阿里云OSS
  COS = 'cos'        // 腾讯云COS
}

// 文件类型枚举
export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio'
}

// 存储配置接口
export interface StorageConfig {
  type: StorageType;
  bucket: string;
  region: string;
  endpoint?: string;
  accessKeyId: string;
  accessKeySecret: string;
  maxFileSize: number;  // 单位: MB
  allowedTypes: FileType[];
  cacheDuration: number; // 缓存时间,单位: 秒
}

// 缓存配置接口
export interface CacheConfig {
  enabled: boolean;
  maxSize: number;      // 最大缓存大小,单位: MB
  maxAge: number;       // 缓存过期时间,单位: 秒
  cleanupInterval: number; // 清理间隔,单位: 秒
} 