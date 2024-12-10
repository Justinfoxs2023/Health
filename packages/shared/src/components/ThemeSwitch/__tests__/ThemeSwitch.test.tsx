import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeSwitch } from '..';
import { themeService } from '../../../services/theme';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ThemeSwitch', () => {
  beforeEach(() => {
    // 重置主题为light
    themeService.setMode('light');
  });

  it('应该正确渲染主题切换按钮', () => {
    render(<ThemeSwitch />);
    
    // 检查按钮是否存在
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // 检查图标和文本是否存在
    expect(screen.getByText('🌞')).toBeInTheDocument();
    expect(screen.getByText('theme.light')).toBeInTheDocument();
  });

  it('应该正确切换主题模式', () => {
    render(<ThemeSwitch />);
    const button = screen.getByRole('button');

    // 点击按钮切换到dark模式
    fireEvent.click(button);
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(screen.getByText('theme.dark')).toBeInTheDocument();
    expect(themeService.getMode()).toBe('dark');

    // 点击按钮切换到system模式
    fireEvent.click(button);
    expect(screen.getByText('💻')).toBeInTheDocument();
    expect(screen.getByText('theme.system')).toBeInTheDocument();
    expect(themeService.getMode()).toBe('system');

    // 点击按钮切换回light模式
    fireEvent.click(button);
    expect(screen.getByText('🌞')).toBeInTheDocument();
    expect(screen.getByText('theme.light')).toBeInTheDocument();
    expect(themeService.getMode()).toBe('light');
  });

  it('应该支持不同的按钮大小', () => {
    const { rerender } = render(<ThemeSwitch size="small" />);
    expect(screen.getByRole('button')).toHaveClass('small');

    rerender(<ThemeSwitch size="medium" />);
    expect(screen.getByRole('button')).toHaveClass('medium');

    rerender(<ThemeSwitch size="large" />);
    expect(screen.getByRole('button')).toHaveClass('large');
  });

  it('应该支持自定义类名和样式', () => {
    const customClass = 'custom-theme-switch';
    const customStyle = { marginTop: '10px' };

    render(<ThemeSwitch className={customClass} style={customStyle} />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass(customClass);
    expect(button).toHaveStyle(customStyle);
  });

  it('应该正确处理键盘事件', () => {
    render(<ThemeSwitch />);
    const button = screen.getByRole('button');

    // 使用空格键切换主题
    fireEvent.keyDown(button, { key: ' ' });
    expect(themeService.getMode()).toBe('dark');

    // 使用回车键切换主题
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(themeService.getMode()).toBe('system');
  });
}); 