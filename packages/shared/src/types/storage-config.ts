/**
 * @fileoverview TS 文件 storage-config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 存储类型枚举
export enum StorageType {
  LOCAL = 'local', // 本地存储
  S3 = 's3', // AWS S3
  OSS = 'oss', // 阿里云OSS
  COS = 'cos', // 腾讯云COS
}

// 文件类型枚举
export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio',
}

// 存储配置接口
export interface IStorageConfig {
  /** type 的描述 */
  type: StorageType;
  /** bucket 的描述 */
  bucket: string;
  /** region 的描述 */
  region: string;
  /** endpoint 的描述 */
  endpoint?: string;
  /** accessKeyId 的描述 */
  accessKeyId: string;
  /** accessKeySecret 的描述 */
  accessKeySecret: string;
  /** maxFileSize 的描述 */
  maxFileSize: number; // 单位: MB
  /** allowedTypes 的描述 */
  allowedTypes: FileType[];
  /** cacheDuration 的描述 */
  cacheDuration: number; // 缓存时间,单位: 秒
}

// 缓存配置接口
export interface ICacheConfig {
  /** enabled 的描述 */
  enabled: boolean;
  /** maxSize 的描述 */
  maxSize: number; // 最大缓存大小,单位: MB
  /** maxAge 的描述 */
  maxAge: number; // 缓存过期时间,单位: 秒
  /** cleanupInterval 的描述 */
  cleanupInterval: number; // 清理间隔,单位: 秒
}
