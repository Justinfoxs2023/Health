import * as dotenv from 'dotenv';
import * as path from 'path';

export class ConfigLoader {
  private static instance: ConfigLoader;
  private config: Record<string, any> = {};

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  private loadConfig() {
    const env = process.env.NODE_ENV || 'development';
    const envFiles = [
      '.env',
      `.env.${env}`,
      `.env.${env}.local`
    ];

    envFiles.forEach(file => {
      try {
        const envPath = path.resolve(process.cwd(), file);
        const result = dotenv.config({ path: envPath });
        if (result.error) {
          console.warn(`Warning: ${file} not found`);
        } else {
          Object.assign(this.config, result.parsed);
        }
      } catch (error) {
        console.error(`Error loading ${file}:`, error);
      }
    });
  }

  get<T = string>(key: string, defaultValue?: T): T {
    return (this.config[key] ?? defaultValue) as T;
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = this.get(key);
    return value ? Number(value) : (defaultValue ?? 0);
  }

  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.get(key);
    if (value === undefined) return defaultValue ?? false;
    return value.toLowerCase() === 'true';
  }

  getArray(key: string, defaultValue: string[] = []): string[] {
    const value = this.get(key);
    return value ? value.split(',').map(item => item.trim()) : defaultValue;
  }
} 