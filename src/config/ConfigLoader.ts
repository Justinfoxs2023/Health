import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { injectable } from 'inversify';

export interface IConfig {
  /** database 的描述 */
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  /** redis 的描述 */
  redis: {
    host: string;
    port: number;
    password: string;
  };
  /** app 的描述 */
  app: {
    port: number;
    env: string;
    name: string;
    url: string;
  };
  /** jwt 的描述 */
  jwt: {
    secret: string;
    expiresIn: string;
  };
  /** services 的描述 */
  services: Record<string, any>;
  [key: string]: any;
}

@injectable()
export class ConfigLoader {
  private config: IConfig;
  private envPath: string;
  private configPath: string;

  constructor() {
    this.envPath = path.resolve(process.cwd(), '.env');
    this.configPath = path.resolve(process.cwd(), 'config');
    this.config = this.loadConfig();
  }

  /**
   * 加载配置
   */
  private loadConfig(): IConfig {
    // 加载环境变量
    this.loadEnv();

    // 基础配置
    const config: IConfig = {
      database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '27017', 10),
        name: process.env.DB_NAME || 'health_db',
        user: process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD || 'password',
      },
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || 'password',
      },
      app: {
        port: parseInt(process.env.APP_PORT || '3000', 10),
        env: process.env.APP_ENV || 'development',
        name: process.env.APP_NAME || '健康管理系统',
        url: process.env.APP_URL || 'http://localhost:3000',
      },
      jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
      services: {},
    };

    // 加载配置文件
    this.loadConfigFiles(config);

    return config;
  }

  /**
   * 加载环境变量
   */
  private loadEnv(): void {
    if (fs.existsSync(this.envPath)) {
      dotenv.config({ path: this.envPath });
    } else if (fs.existsSync(`${this.envPath}.example`)) {
      dotenv.config({ path: `${this.envPath}.example` });
    }
  }

  /**
   * 加载配置文件
   */
  private loadConfigFiles(config: IConfig): void {
    if (!fs.existsSync(this.configPath)) {
      return;
    }

    const files = fs.readdirSync(this.configPath);
    for (const file of files) {
      if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        const filePath = path.join(this.configPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(content) as Record<string, any>;
        const key = path.basename(file, path.extname(file));

        // 替换环境变量
        const processedData = this.processEnvVars(data);
        config[key] = processedData;

        if (key === 'third_party_services') {
          config.services = processedData;
        }
      }
    }
  }

  /**
   * 处理配置中的环境变量
   */
  private processEnvVars(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.processEnvVars(item));
    }

    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
        const envKey = value.slice(2, -1);
        result[key] = process.env[envKey] || value;
      } else if (typeof value === 'object') {
        result[key] = this.processEnvVars(value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * 获取配置值
   */
  public get<T = any>(key: string): T {
    return this.getNestedValue(this.config, key);
  }

  /**
   * 获取嵌套配置值
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : undefined;
    }, obj);
  }

  /**
   * 设置配置值
   */
  public set(key: string, value: any): void {
    this.setNestedValue(this.config, key, value);
  }

  /**
   * 设置嵌套配置值
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    const lastKey = parts.pop()!;
    const target = parts.reduce((prev, curr) => {
      prev[curr] = prev[curr] || {};
      return prev[curr];
    }, obj);
    target[lastKey] = value;
  }

  /**
   * 获取所有配置
   */
  public getAll(): IConfig {
    return this.config;
  }

  /**
   * 重新加载配置
   */
  public reload(): void {
    this.config = this.loadConfig();
  }

  /**
   * 验证配置
   */
  public validate(): string[] {
    const errors: string[] = [];

    // 验证必要的配置项
    const requiredConfigs = [
      'database.host',
      'database.port',
      'database.name',
      'app.port',
      'app.env',
      'jwt.secret',
    ];

    for (const path of requiredConfigs) {
      const value = this.get(path);
      if (!value) {
        errors.push(`Missing required config: ${path}`);
      }
    }

    // 验证服务配置
    const services = this.get<Record<string, any>>('services');
    if (services) {
      for (const [name, config] of Object.entries(services)) {
        if (!config.endpoint) {
          errors.push(`Missing endpoint for service: ${name}`);
        }
        if (!config.type) {
          errors.push(`Missing type for service: ${name}`);
        }
      }
    }

    return errors;
  }

  /**
   * 获取环境变量
   */
  public getEnv(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }

  /**
   * 是否为开发环境
   */
  public isDevelopment(): boolean {
    return this.get<string>('app.env') === 'development';
  }

  /**
   * 是否为生产环境
   */
  public isProduction(): boolean {
    return this.get<string>('app.env') === 'production';
  }

  /**
   * 是否为测试环境
   */
  public isTest(): boolean {
    return this.get<string>('app.env') === 'test';
  }
}
