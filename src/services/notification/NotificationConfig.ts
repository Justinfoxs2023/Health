import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Logger } from '../logger/Logger';
import { injectable, inject } from 'inversify';

export interface INotificationProviderConfig {
  /** email 的描述 */
  email: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
  };
  /** slack 的描述 */
  slack: {
    token: string;
    defaultChannel: string;
  };
  /** webhook 的描述 */
  webhook: {
    url: string;
    method: string;
    headers: Record<string, string>;
    timeout: number;
    retryCount: number;
    retryDelay: number;
    validateSSL: boolean;
  };
  /** sms 的描述 */
  sms: {
    provider: string;
    credentials: {
      accountSid?: string;
      authToken?: string;
      accessKeyId?: string;
      accessKeySecret?: string;
    };
    from: string;
    region?: string;
  };
}

export interface INotificationTemplate {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** type 的描述 */
  type: string;
  /** subject 的描述 */
  subject: string;
  /** content 的描述 */
  content: string;
  /** variables 的描述 */
  variables: string;
}

export interface INotificationChannel {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** type 的描述 */
  type: string;
  /** config 的描述 */
  config: Recordstring /** any 的描述 */;
  /** any 的描述 */
  any;
  /** templates 的描述 */
  templates: string;
}

@injectable()
export class NotificationConfig {
  private config: {
    providers: INotificationProviderConfig;
    templates: Record<string, INotificationTemplate>;
    channels: Record<string, INotificationChannel>;
  };

  constructor(@inject() private readonly logger: Logger) {
    this.config = {
      providers: {} as INotificationProviderConfig,
      templates: {},
      channels: {},
    };
  }

  /**
   * 加载配置
   */
  public async load(configPath = 'config/notification/providers.yaml'): Promise<void> {
    try {
      const fullPath = path.resolve(process.cwd(), configPath);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const config = yaml.load(fileContent) as any;

      // 处理环境变量
      this.config = this.processEnvVars(config);

      this.logger.info('通知服务配置加载成功');
    } catch (error) {
      this.logger.error('通知服务配置加载失败', error as Error);
      throw error;
    }
  }

  /**
   * 处理环境变量
   */
  private processEnvVars(config: any): any {
    const processValue = (value: any): any => {
      if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
        const envVar = value.slice(2, -1);
        const envValue = process.env[envVar];
        if (!envValue) {
          this.logger.warn(`环境变量 ${envVar} 未定义`);
        }
        return envValue || value;
      }

      if (Array.isArray(value)) {
        return value.map(processValue);
      }

      if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, processValue(v)]));
      }

      return value;
    };

    return processValue(config);
  }

  /**
   * 获取提供者配置
   */
  public getProviderConfig<T extends keyof INotificationProviderConfig>(
    provider: T,
  ): INotificationProviderConfig[T] {
    const config = this.config.providers[provider];
    if (!config) {
      throw new Error(`提供者 ${provider} 配置不存在`);
    }
    return config;
  }

  /**
   * 获取模板
   */
  public getTemplate(templateId: string): INotificationTemplate {
    const template = this.config.templates[templateId];
    if (!template) {
      throw new Error(`模板 ${templateId} 不存在`);
    }
    return template;
  }

  /**
   * 获取渠道
   */
  public getChannel(channelId: string): INotificationChannel {
    const channel = this.config.channels[channelId];
    if (!channel) {
      throw new Error(`渠道 ${channelId} 不存在`);
    }
    return channel;
  }

  /**
   * 获取渠道模板
   */
  public getChannelTemplates(channelId: string): INotificationTemplate[] {
    const channel = this.getChannel(channelId);
    if (!channel.templates) {
      return [];
    }

    return channel.templates.map(templateId => this.getTemplate(templateId));
  }

  /**
   * 验证配置
   */
  public validate(): string[] {
    const errors: string[] = [];

    // 验证提供者配置
    if (!this.config.providers.email?.host) {
      errors.push('邮件服务器主机未配置');
    }
    if (!this.config.providers.slack?.token) {
      errors.push('Slack令牌未配置');
    }
    if (!this.config.providers.webhook?.url) {
      errors.push('Webhook URL未配置');
    }
    if (!this.config.providers.sms?.credentials) {
      errors.push('短信服务凭证未配置');
    }

    // 验证模板
    for (const [id, template] of Object.entries(this.config.templates)) {
      if (!template.content) {
        errors.push(`模板 ${id} 内容为空`);
      }
      if (!template.variables?.length) {
        errors.push(`模板 ${id} 未定义变量`);
      }
    }

    // 验证渠道
    for (const [id, channel] of Object.entries(this.config.channels)) {
      if (!channel.type) {
        errors.push(`渠道 ${id} 类型未定义`);
      }
      if (!channel.config) {
        errors.push(`渠道 ${id} 配置为空`);
      }
      if (channel.templates) {
        for (const templateId of channel.templates) {
          if (!this.config.templates[templateId]) {
            errors.push(`渠道 ${id} 引用的模板 ${templateId} 不存在`);
          }
        }
      }
    }

    return errors;
  }
}
