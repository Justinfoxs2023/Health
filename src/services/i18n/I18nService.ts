import { CacheManager } from '../cache/CacheManager';
import { ConfigService } from '../config/ConfigurationManager';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';

export interface I18nConfig {
  /** defaultLocale 的描述 */
    defaultLocale: string;
  /** supportedLocales 的描述 */
    supportedLocales: string;
  /** fallbackLocale 的描述 */
    fallbackLocale: string;
  /** loadPath 的描述 */
    loadPath: string;
  /** cacheEnabled 的描述 */
    cacheEnabled: false | true;
  /** cacheTTL 的描述 */
    cacheTTL: number;
}

export interface ITranslationData {
  /** key 的描述 */
    key: string: string  TranslationData;
}

@Injectable()
export class I18nService {
  private translations: Map<string, ITranslationData> = new Map();
  private readonly config: I18nConfig;

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly cacheManager: CacheManager,
  ) {
    this.config = this.configService.get('i18n');
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // 加载所有支持的语言
      for (const locale of this.config.supportedLocales) {
        await this.loadTranslations(locale);
      }
      this.logger.info('国际化服务初始化完成');
    } catch (error) {
      this.logger.error('国际化服务初始化失败', error);
      throw error;
    }
  }

  private async loadTranslations(locale: string): Promise<void> {
    try {
      // 首先尝试从缓存加载
      if (this.config.cacheEnabled) {
        const cached = await this.cacheManager.get(`i18n:${locale}`);
        if (cached) {
          this.translations.set(locale, cached);
          return;
        }
      }

      // 从文件加载翻译
      const translations = await this.loadTranslationFile(locale);
      this.translations.set(locale, translations);

      // 缓存翻译数据
      if (this.config.cacheEnabled) {
        await this.cacheManager.set(`i18n:${locale}`, translations, this.config.cacheTTL);
      }
    } catch (error) {
      this.logger.error(`加载语言 ${locale} 失败`, error);
      throw error;
    }
  }

  private async loadTranslationFile(locale: string): Promise<ITranslationData> {
    // 实现从文件加载翻译的逻辑
    return {};
  }

  async translate(
    key: string,
    locale: string = this.config.defaultLocale,
    params: Record<string, any> = {},
  ): Promise<string> {
    try {
      const translation = await this.getTranslation(key, locale);
      return this.interpolate(translation, params);
    } catch (error) {
      this.logger.error(`翻译键 ${key} 失败`, error);
      return key;
    }
  }

  private async getTranslation(key: string, locale: string): Promise<string> {
    const translations =
      this.translations.get(locale) || this.translations.get(this.config.fallbackLocale) || {};

    const value = this.getNestedValue(translations, key);
    if (!value && locale !== this.config.fallbackLocale) {
      return this.getTranslation(key, this.config.fallbackLocale);
    }

    return value || key;
  }

  private getNestedValue(obj: ITranslationData, path: string): string | undefined {
    return path.split('.').reduce((value: any, key: string) => {
      return value ? value[key] : undefined;
    }, obj) as string | undefined;
  }

  private interpolate(text: string, params: Record<string, any>): string {
    return text.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      return params[key.trim()] || `{{${key}}}`;
    });
  }

  async addTranslation(locale: string, key: string, value: string): Promise<void> {
    try {
      const translations = this.translations.get(locale) || {};
      this.setNestedValue(translations, key, value);
      this.translations.set(locale, translations);

      if (this.config.cacheEnabled) {
        await this.cacheManager.set(`i18n:${locale}`, translations, this.config.cacheTTL);
      }
    } catch (error) {
      this.logger.error(`添加翻译失败: ${locale}.${key}`, error);
      throw error;
    }
  }

  private setNestedValue(obj: ITranslationData, path: string, value: string): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((obj: any, key: string) => {
      obj[key] = obj[key] || {};
      return obj[key];
    }, obj);
    target[lastKey] = value;
  }

  async removeTranslation(locale: string, key: string): Promise<void> {
    try {
      const translations = this.translations.get(locale);
      if (translations) {
        this.deleteNestedValue(translations, key);
        this.translations.set(locale, translations);

        if (this.config.cacheEnabled) {
          await this.cacheManager.set(`i18n:${locale}`, translations, this.config.cacheTTL);
        }
      }
    } catch (error) {
      this.logger.error(`删除翻译失败: ${locale}.${key}`, error);
      throw error;
    }
  }

  private deleteNestedValue(obj: ITranslationData, path: string): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((obj: any, key: string) => {
      return obj ? obj[key] : undefined;
    }, obj);
    if (target) {
      delete target[lastKey];
    }
  }

  async reloadTranslations(): Promise<void> {
    try {
      this.translations.clear();
      await this.initialize();
    } catch (error) {
      this.logger.error('重新加载翻译失败', error);
      throw error;
    }
  }

  getSupportedLocales(): string[] {
    return this.config.supportedLocales;
  }

  getDefaultLocale(): string {
    return this.config.defaultLocale;
  }

  async validateTranslations(): Promise<{
    missingKeys: string[];
    invalidValues: string[];
  }> {
    const missingKeys: string[] = [];
    const invalidValues: string[] = [];

    const defaultTranslations = this.translations.get(this.config.defaultLocale) || {};
    const defaultKeys = this.getAllKeys(defaultTranslations);

    for (const locale of this.config.supportedLocales) {
      if (locale === this.config.defaultLocale) continue;

      const translations = this.translations.get(locale) || {};
      const localeKeys = this.getAllKeys(translations);

      // 检查缺失的键
      for (const key of defaultKeys) {
        if (!localeKeys.includes(key)) {
          missingKeys.push(`${locale}.${key}`);
        }
      }

      // 检查无效的值
      for (const key of localeKeys) {
        const value = await this.getTranslation(key, locale);
        if (!value || value === key) {
          invalidValues.push(`${locale}.${key}`);
        }
      }
    }

    return { missingKeys, invalidValues };
  }

  private getAllKeys(obj: ITranslationData, prefix = ''): string[] {
    return Object.entries(obj).reduce((keys: string[], [key, value]) => {
      const currentKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string') {
        keys.push(currentKey);
      } else {
        keys.push(...this.getAllKeys(value, currentKey));
      }
      return keys;
    }, []);
  }

  // AARRR模型相关的国际化支持
  async getAcquisitionTranslations(locale: string): Promise<ITranslationData> {
    return this.getModuleTranslations('acquisition', locale);
  }

  async getActivationTranslations(locale: string): Promise<ITranslationData> {
    return this.getModuleTranslations('activation', locale);
  }

  async getRetentionTranslations(locale: string): Promise<ITranslationData> {
    return this.getModuleTranslations('retention', locale);
  }

  async getRevenueTranslations(locale: string): Promise<ITranslationData> {
    return this.getModuleTranslations('revenue', locale);
  }

  async getReferralTranslations(locale: string): Promise<ITranslationData> {
    return this.getModuleTranslations('referral', locale);
  }

  private async getModuleTranslations(module: string, locale: string): Promise<ITranslationData> {
    const translations = this.translations.get(locale) || {};
    return translations[module] || {};
  }
}
