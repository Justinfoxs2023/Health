import { useState, useEffect } from 'react';

import { BehaviorSubject } from 'rxjs';

export type LocaleType = 'zh-CN' | 'en-US';

interface I18nConfig {
  /** dateFormat 的描述 */
  dateFormat: string;
  /** timeFormat 的描述 */
  timeFormat: string;
  /** numberFormat 的描述 */
  numberFormat: Record<LocaleType, Intl.NumberFormatOptions>;
  /** dateTimeFormat 的描述 */
  dateTimeFormat: Record<LocaleType, Intl.DateTimeFormatOptions>;
}

const defaultConfig: I18nConfig = {
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm:ss',
  numberFormat: {
    'zh-CN': {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    'en-US': {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
  dateTimeFormat: {
    'zh-CN': {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    },
    'en-US': {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    },
  },
};

class I18nService {
  private locale$ = new BehaviorSubject<LocaleType>('zh-CN');
  private config$ = new BehaviorSubject<I18nConfig>(defaultConfig);
  private messages: Record<LocaleType, Record<string, string>> = {
    'zh-CN': {},
    'en-US': {},
  };

  constructor() {
    this.initI18n();
  }

  private initI18n() {
    // 从localStorage读取语言设置
    const savedLocale = localStorage.getItem('locale') as LocaleType;
    if (savedLocale) {
      this.setLocale(savedLocale);
    } else {
      // 使用浏览器默认语言
      const browserLocale = navigator.language;
      this.setLocale(browserLocale.startsWith('zh') ? 'zh-CN' : 'en-US');
    }

    // 从localStorage读取配置
    const savedConfig = localStorage.getItem('i18nConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        this.setConfig(config);
      } catch (error) {
        console.error('Error in index.ts:', 'Failed to parse i18n config:', error);
      }
    }
  }

  getLocale() {
    return this.locale$.value;
  }

  getConfig() {
    return this.config$.value;
  }

  setLocale(locale: LocaleType) {
    this.locale$.next(locale);
    localStorage.setItem('locale', locale);
    document.documentElement.setAttribute('lang', locale);

    // 触发自定义事件
    window.dispatchEvent(
      new CustomEvent('localechange', {
        detail: {
          locale: this.locale$.value,
          config: this.config$.value,
        },
      }),
    );
  }

  setConfig(config: Partial<I18nConfig>) {
    const newConfig = {
      ...this.config$.value,
      ...config,
    };
    this.config$.next(newConfig);
    localStorage.setItem('i18nConfig', JSON.stringify(newConfig));

    // 触发自定义事件
    window.dispatchEvent(
      new CustomEvent('localechange', {
        detail: {
          locale: this.locale$.value,
          config: newConfig,
        },
      }),
    );
  }

  async loadMessages(locale: LocaleType, messages: Record<string, string>) {
    this.messages[locale] = {
      ...this.messages[locale],
      ...messages,
    };
  }

  translate(key: string, params?: Record<string, string | number>) {
    const message = this.messages[this.locale$.value][key];
    if (!message) return key;

    if (!params) return message;

    return message.replace(/\{(\w+)\}/g, (_, key) => {
      return String(params[key] ?? `{${key}}`);
    });
  }

  formatNumber(value: number) {
    const locale = this.locale$.value;
    const options = this.config$.value.numberFormat[locale];
    return new Intl.NumberFormat(locale, options).format(value);
  }

  formatDate(date: Date | number) {
    const locale = this.locale$.value;
    const options = this.config$.value.dateTimeFormat[locale];
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  formatCurrency(value: number, currency = 'CNY') {
    const locale = this.locale$.value;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  }

  formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit) {
    const locale = this.locale$.value;
    return new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
    }).format(value, unit);
  }
}

export const i18n = new I18nService();

/** 国际化Hook */
export function useI18n(): {
  locale: any;
  config: any;
  t: (key: string, params?: Record<string, string | number> | undefined) => any;
  setLocale: (
    locale: import('D:/Health/packages/shared/src/services/i18n/index').LocaleType,
  ) => void;
  setConfig: (config: Partial<I18nConfig>) => void;
  formatNumber: (value: number) => string;
  formatDate: (date: number | Date) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit) => string;
} {
  const [locale, setLocale] = useState(i18n.getLocale());
  const [config, setConfig] = useState(i18n.getConfig());

  useEffect(() => {
    const handleLocaleChange = (e: CustomEvent) => {
      setLocale(e.detail.locale);
      setConfig(e.detail.config);
    };

    window.addEventListener('localechange', handleLocaleChange as EventListener);
    return () => {
      window.removeEventListener('localechange', handleLocaleChange as EventListener);
    };
  }, []);

  return {
    locale,
    config,
    t: i18n.translate.bind(i18n),
    setLocale: i18n.setLocale.bind(i18n),
    setConfig: i18n.setConfig.bind(i18n),
    formatNumber: i18n.formatNumber.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatRelativeTime: i18n.formatRelativeTime.bind(i18n),
  };
}
