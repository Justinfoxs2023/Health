import { STORAGE_KEYS } from '../../../constants';
import { i18n, useI18n, LocaleType } from '../index';
import { renderHook, act } from '@testing-library/react';

describe('I18nService', () => {
  const mockMessages = {
    'zh-CN': {
      hello: '你好，{name}',
      nested: {
        key: '嵌套值',
      },
    },
    'en-US': {
      hello: 'Hello, {name}',
      nested: {
        key: 'Nested value',
      },
    },
  };

  beforeEach(() => {
    // 清理localStorage和DOM
    localStorage.clear();
    document.documentElement.removeAttribute('lang');
    // 加载测试消息
    Object.entries(mockMessages).forEach(([locale, messages]) => {
      i18n.loadMessages(locale as LocaleType, messages);
    });
  });

  it('应该使用默认语言', () => {
    const defaultLocale = navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US';
    expect(i18n.getLocale()).toBe(defaultLocale);
  });

  it('应该从localStorage加载语言设置', () => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'en-US');
    // 重新创建实例以触发从localStorage加载
    const instance = (i18n as any).constructor['instance'];
    (i18n as any).constructor['instance'] = undefined;
    const service = (i18n as any).constructor.getInstance();
    expect(service.getLocale()).toBe('en-US');
    // 恢复原始实例
    (i18n as any).constructor['instance'] = instance;
  });

  it('应该正确设置语言', () => {
    const locales: LocaleType[] = ['zh-CN', 'en-US'];
    locales.forEach(locale => {
      i18n.setLocale(locale);
      expect(i18n.getLocale()).toBe(locale);
      expect(localStorage.getItem(STORAGE_KEYS.LANGUAGE)).toBe(locale);
      expect(document.documentElement.getAttribute('lang')).toBe(locale);
    });
  });

  it('应该正确翻译文本', () => {
    i18n.setLocale('zh-CN');
    expect(i18n.t('hello', { name: '世界' })).toBe('你好，世界');

    i18n.setLocale('en-US');
    expect(i18n.t('hello', { name: 'world' })).toBe('Hello, world');
  });

  it('应该支持嵌套翻译', () => {
    i18n.setLocale('zh-CN');
    expect(i18n.t('nested.key')).toBe('嵌套值');

    i18n.setLocale('en-US');
    expect(i18n.t('nested.key')).toBe('Nested value');
  });

  it('应该在缺失翻译时返回键名', () => {
    expect(i18n.t('missing.key')).toBe('missing.key');
  });

  it('应该正确格式化日期', () => {
    const date = new Date('2024-01-01T12:00:00');

    i18n.setLocale('zh-CN');
    expect(i18n.formatDate(date)).toBe('2024-01-01');

    i18n.setLocale('en-US');
    expect(i18n.formatDate(date)).toBe('01/01/2024');
  });

  it('应该支持自定义日期格式', () => {
    const date = new Date('2024-01-01T12:00:00');
    expect(i18n.formatDate(date, 'YYYY年MM月DD日')).toBe('2024年01月01日');
  });

  it('应该正确格式化数字', () => {
    const number = 1234567.89;

    i18n.setLocale('zh-CN');
    expect(i18n.formatNumber(number)).toBe('1,234,567.89');

    i18n.setLocale('en-US');
    expect(i18n.formatNumber(number)).toBe('1,234,567.89');
  });

  it('应该正确格式化货币', () => {
    const amount = 1234.56;

    i18n.setLocale('zh-CN');
    expect(i18n.formatCurrency(amount)).toBe('¥1,234.56');

    i18n.setLocale('en-US');
    expect(i18n.formatCurrency(amount)).toBe('$1,234.56');
  });

  it('应该返回所有支持的语言', () => {
    const locales = i18n.getSupportedLocales();
    expect(locales).toHaveLength(2);
    expect(locales.map(l => l.code)).toEqual(['zh-CN', 'en-US']);
  });
});

describe('useI18n Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('应该返回当前语言状态', () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.locale).toBe(i18n.getLocale());
    expect(result.current.config).toEqual(i18n.getConfig());
  });

  it('应该响应语言变化', () => {
    const { result } = renderHook(() => useI18n());

    act(() => {
      result.current.setLocale('en-US');
    });

    expect(result.current.locale).toBe('en-US');
    expect(result.current.config).toEqual(i18n.getConfig());
  });

  it('应该提供翻译功能', () => {
    const { result } = renderHook(() => useI18n());
    const message = result.current.t('hello', { name: 'test' });
    expect(message).toBe(i18n.t('hello', { name: 'test' }));
  });

  it('应该提供格式化功能', () => {
    const { result } = renderHook(() => useI18n());
    const date = new Date();
    const number = 1234.56;

    expect(result.current.formatDate(date)).toBe(i18n.formatDate(date));
    expect(result.current.formatNumber(number)).toBe(i18n.formatNumber(number));
    expect(result.current.formatCurrency(number)).toBe(i18n.formatCurrency(number));
  });

  it('应该在组件卸载时清理事件监听', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useI18n());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('localeChange', expect.any(Function));
  });
});
