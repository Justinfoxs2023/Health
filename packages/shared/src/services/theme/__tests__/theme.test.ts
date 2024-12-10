import { renderHook, act } from '@testing-library/react';
import { themeService, useTheme, ThemeMode } from '../index';
import { STORAGE_KEYS } from '../../../constants';

describe('ThemeService', () => {
  beforeEach(() => {
    // 清理localStorage和DOM
    localStorage.clear();
    document.documentElement.style.cssText = '';
    document.documentElement.removeAttribute('data-theme');
  });

  afterAll(() => {
    themeService.destroy();
  });

  it('应该使用默认主题模式', () => {
    expect(themeService.getMode()).toBe('system');
  });

  it('应该从localStorage加载主题模式', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    // 重新创建实例以触发从localStorage加载
    const instance = ThemeService['instance'];
    ThemeService['instance'] = undefined as any;
    const service = ThemeService.getInstance();
    expect(service.getMode()).toBe('dark');
    // 恢复原始实例
    ThemeService['instance'] = instance;
  });

  it('应该正确设置主题模式', () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    modes.forEach(mode => {
      themeService.setMode(mode);
      expect(themeService.getMode()).toBe(mode);
      expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe(mode);
    });
  });

  it('应该正确切换主题模式', () => {
    themeService.setMode('light');
    themeService.toggleMode();
    expect(themeService.getMode()).toBe('dark');
    themeService.toggleMode();
    expect(themeService.getMode()).toBe('system');
    themeService.toggleMode();
    expect(themeService.getMode()).toBe('light');
  });

  it('应该正确应用主题CSS变量', () => {
    themeService.setMode('light');
    const config = themeService.getConfig();
    Object.entries(config).forEach(([key, value]) => {
      expect(document.documentElement.style.getPropertyValue(`--theme-${key}`)).toBe(value);
    });
  });

  it('应该正确设置data-theme属性', () => {
    themeService.setMode('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('应该响应系统主题变化', () => {
    // 模拟系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    themeService.setMode('system');
    
    // 模拟暗色主题
    Object.defineProperty(mediaQuery, 'matches', { value: true });
    mediaQuery.dispatchEvent(new MediaQueryListEvent('change', { matches: true }));
    expect(document.documentElement.dataset.theme).toBe('dark');

    // 模拟亮色主题
    Object.defineProperty(mediaQuery, 'matches', { value: false });
    mediaQuery.dispatchEvent(new MediaQueryListEvent('change', { matches: false }));
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});

describe('useTheme Hook', () => {
  it('应该返回当前主题状态', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.mode).toBe(themeService.getMode());
    expect(result.current.config).toEqual(themeService.getConfig());
  });

  it('应该响应主题变化', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setMode('dark');
    });
    
    expect(result.current.mode).toBe('dark');
    expect(result.current.config).toEqual(themeService.getConfig());
  });

  it('应该支持主题切换', () => {
    const { result } = renderHook(() => useTheme());
    const initialMode = result.current.mode;
    
    act(() => {
      result.current.toggleMode();
    });
    
    expect(result.current.mode).not.toBe(initialMode);
  });

  it('应该在组件卸载时清理事件监听', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useTheme());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'themeChange',
      expect.any(Function)
    );
  });
}); 