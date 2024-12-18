/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IPushService {
  sendPushNotification(token: string, notification: IPushNotification): Promise<void>;
}

export interface IPushNotification {
  /** title 的描述 */
  title: string;
  /** body 的描述 */
  body: string;
  /** data 的描述 */
  data?: Record<string, any>;
}
