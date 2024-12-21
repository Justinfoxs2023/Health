/**
 * @fileoverview TS 文件 shored.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IServiceConfig {
  /** baseUrl 的描述 */
    baseUrl: string;
  /** timeout 的描述 */
    timeout: number;
  /** headers 的描述 */
    headers: Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
}

export interface IMetrics {
  /** recordMetricname 的描述 */
    recordMetricname: string, /** value 的描述 */
    /** value 的描述 */
    value: number: /** void 的描述 */
    /** void 的描述 */
    void;
  /** getMetrics 的描述 */
    getMetrics: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number;
}

export interface IUserGameProfile {
  /** id 的描述 */
    id: string;
  /** userId 的描述 */
    userId: string;
  /** level 的描述 */
    level: number;
  /** exp 的描述 */
    exp: number;
  /** achievements 的描述 */
    achievements: string;
}

export interface IFeatureUnlock {
  /** id 的描述 */
    id: string;
  /** featureId 的描述 */
    featureId: string;
  /** userId 的描述 */
    userId: string;
  /** unlockedAt 的描述 */
    unlockedAt: Date;
}

export interface ICommunityActivity {
  /** id 的描述 */
    id: string;
  /** title 的描述 */
    title: string;
  /** description 的描述 */
    description: string;
  /** startDate 的描述 */
    startDate: Date;
  /** endDate 的描述 */
    endDate: Date;
  /** participants 的描述 */
    participants: string;
}
