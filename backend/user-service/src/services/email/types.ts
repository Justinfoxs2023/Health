export interface EmailService {
  sendEmail(options: EmailOptions): Promise<void>;
  sendVerificationEmail(to: string, code: string): Promise<void>;
  sendSecurityAlert(to: string, notification: SecurityNotification): Promise<void>;
}

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

export interface SecurityNotification {
  type: string;
  title: string;
  content?: string;
  metadata?: Record<string, any>;
} 