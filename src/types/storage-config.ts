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
    type: import("D:/Health/src/types/storage-config").StorageType.LOCAL | import("D:/Health/src/types/storage-config").StorageType.S3 | import("D:/Health/src/types/storage-config").StorageType.OSS | import("D:/Health/src/types/storage-config").StorageType.COS;
  /** bucket 的描述 */
    bucket: string;
  /** region 的描述 */
    region: string;
  /** endpoint 的描述 */
    endpoint: string;
  /** accessKeyId 的描述 */
    accessKeyId: string;
  /** accessKeySecret 的描述 */
    accessKeySecret: string;
  /** maxFileSize 的描述 */
    maxFileSize: number;  : /** MB 的描述 */
    /** MB 的描述 */
    MB
  /** allowedTypes 的描述 */
    allowedTypes: import("D:/Health/src/types/storage-config").FileType.IMAGE | import("D:/Health/src/types/storage-config").FileType.VIDEO | import("D:/Health/src/types/storage-config").FileType.DOCUMENT | import("D:/Health/src/types/storage-config").FileType.AUDIO;
  /** cacheDuration 的描述 */
    cacheDuration: number;  ,: 
}

// 缓存配置接口
export interface ICacheConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** maxSize 的描述 */
    maxSize: number;  ,: /** MB 的描述 */
    /** MB 的描述 */
    MB
  /** maxAge 的描述 */
    maxAge: number;  ,: 
  /** cleanupInterval 的描述 */
    cleanupInterval: number;  ,: 
}
