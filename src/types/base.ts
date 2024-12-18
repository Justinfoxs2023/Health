/**
 * @fileoverview TS 文件 base.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 基础类型定义
export interface ILogger {
  /** errormessage 的描述 */
    errormessage: string, /** error 的描述 */
    /** error 的描述 */
    error: any: /** void 的描述 */
    /** void 的描述 */
    void;
  /** warnmessage 的描述 */
    warnmessage: string, /** data 的描述 */
    /** data 的描述 */
    data: any: /** void 的描述 */
    /** void 的描述 */
    void;
  /** infomessage 的描述 */
    infomessage: string, /** data 的描述 */
    /** data 的描述 */
    data: any: /** void 的描述 */
    /** void 的描述 */
    void;
  /** debugmessage 的描述 */
    debugmessage: string, /** data 的描述 */
    /** data 的描述 */
    data: any: /** void 的描述 */
    /** void 的描述 */
    void;
}

export interface IMetrics {
  /** recordMetricname 的描述 */
    recordMetricname: string, /** value 的描述 */
    /** value 的描述 */
    value: number: /** void 的描述 */
    /** void 的描述 */
    void;
  /** getMetricname 的描述 */
    getMetricname: string: /** number 的描述 */
    /** number 的描述 */
    number;
  /** incrementMetricname 的描述 */
    incrementMetricname: string: /** void 的描述 */
    /** void 的描述 */
    void;
  /** setMetricname 的描述 */
    setMetricname: string, /** value 的描述 */
    /** value 的描述 */
    value: number: /** void 的描述 */
    /** void 的描述 */
    void;
}

export interface IAlertService {
  /** sendAlertlevel 的描述 */
    sendAlertlevel: string, /** message 的描述 */
    /** message 的描述 */
    message: string, /** data 的描述 */
    /** data 的描述 */
    data: any: /** Promisevoid 的描述 */
    /** Promisevoid 的描述 */
    Promisevoid;
  /** clearAlertalertId 的描述 */
    clearAlertalertId: string: /** Promisevoid 的描述 */
    /** Promisevoid 的描述 */
    Promisevoid;
  /** getActiveAlerts 的描述 */
    getActiveAlerts: PromiseAlert;
}
