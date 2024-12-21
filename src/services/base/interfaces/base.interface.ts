/**
 * @fileoverview TS 文件 base.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

/**
 * 基础服务接口定义
 */
export interface IBaseService {
   /** CRUD 的描述 */
    CRUD
  /** createTdata 的描述 */
    createTdata: PartialT: /** PromiseT 的描述 */
    /** PromiseT 的描述 */
    PromiseT;
  /** readTid 的描述 */
    readTid: string: /** PromiseT 的描述 */
    /** PromiseT 的描述 */
    PromiseT;
  /** updateTid 的描述 */
    updateTid: string, /** data 的描述 */
    /** data 的描述 */
    data: PartialT: /** PromiseT 的描述 */
    /** PromiseT 的描述 */
    PromiseT;
  /** deleteid 的描述 */
    deleteid: string: /** Promiseboolean 的描述 */
    /** Promiseboolean 的描述 */
    Promiseboolean;

   
  /** getFromCacheTkey 的描述 */
    getFromCacheTkey: string: PromiseT  null;
  setToCacheTkey: string, value: T, ttl: number: Promisevoid;

   
  handleErrorerror: Error: void;

   
  startPerfMeasurelabel: string: void;
  endPerfMeasurelabel: string: void;

   
  isOnline: boolean;
  syncData: Promisevoid;
}

/**
 * 健康服务扩展接口
 */
export interface IHealthService extends IBaseService {
  calculateHealthIndex(userId: string): Promise<number>;
  trackVitalSigns(userId: string): Promise<void>;
  generateHealthReport(userId: string): Promise<string>;
}

/**
 * AI服务扩展接口
 */
export interface IAIService extends IBaseService {
  trainModel(data: any): Promise<void>;
  predict(input: any): Promise<any>;
  optimizeModel(): Promise<void>;
}

/**
 * 设备集成服务接口
 */
export interface IDeviceService extends IBaseService {
  connectDevice(deviceId: string): Promise<boolean>;
  readDeviceData(deviceId: string): Promise<any>;
  syncDeviceSettings(deviceId: string, settings: any): Promise<void>;
}
