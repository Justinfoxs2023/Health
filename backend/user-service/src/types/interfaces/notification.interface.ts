/**
 * @fileoverview TS 文件 notification.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface INotification {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;
  /** type 的描述 */
  type: NotificationType;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content: string;
  /** data 的描述 */
  data?: any;
  /** read 的描述 */
  read: boolean;
  /** createdAt 的描述 */
  createdAt: Date;
}

export type NotificationType = 'security_alert' | 'health_reminder' | 'appointment' | 'system';

export interface INotificationPreferences {
  /** email 的描述 */
  email: boolean;
  /** push 的描述 */
  push: boolean;
  /** sms 的描述 */
  sms: boolean;
  /** types 的描述 */
  types: {
    [key in NotificationType]: {
      enabled: boolean;
      channels: string[];
    };
  };
}
