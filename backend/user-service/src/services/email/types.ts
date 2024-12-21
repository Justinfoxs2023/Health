/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IEmailService {
  sendEmail(options: IEmailOptions): Promise<void>;
  sendVerificationEmail(to: string, code: string): Promise<void>;
  sendSecurityAlert(to: string, notification: ISecurityNotification): Promise<void>;
}

export interface IEmailOptions {
  /** to 的描述 */
  to: string;
  /** subject 的描述 */
  subject: string;
  /** template 的描述 */
  template: string;
  /** context 的描述 */
  context: Record<string, any>;
}

export interface ISecurityNotification {
  /** type 的描述 */
  type: string;
  /** title 的描述 */
  title: string;
  /** content 的描述 */
  content?: string;
  /** metadata 的描述 */
  metadata?: Record<string, any>;
}
