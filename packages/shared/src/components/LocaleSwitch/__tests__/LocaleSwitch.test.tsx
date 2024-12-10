import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { LocaleSwitch } from '../index';
import { i18n } from '../../../services/i18n';

describe('LocaleSwitch', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('应该正确渲染语言选择器', () => {
    render(<LocaleSwitch />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('应该显示所有支持的语言', () => {
    render(<LocaleSwitch />);
    const options = screen.getAllByRole('option');
    const locales = i18n.getSupportedLocales();
    expect(options).toHaveLength(locales.length);
    options.forEach((option, index) => {
      expect(option).toHaveTextContent(locales[index].name);
    });
  });

  it('应该显示当前选中的语言', () => {
    i18n.setLocale('zh-CN');
    render(<LocaleSwitch />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('zh-CN');
  });

  it('应该能够切换语言', () => {
    render(<LocaleSwitch />);
    const select = screen.getByRole('combobox');
    
    fireEvent.change(select, { target: { value: 'en-US' } });
    expect(i18n.getLocale()).toBe('en-US');
    
    fireEvent.change(select, { target: { value: 'zh-CN' } });
    expect(i18n.getLocale()).toBe('zh-CN');
  });

  it('应该应用自定义类名和样式', () => {
    const className = 'custom-class';
    const style = { margin: '10px' };
    
    render(<LocaleSwitch className={className} style={style} />);
    const container = screen.getByRole('combobox').parentElement;
    
    expect(container).toHaveClass('locale-switch', className);
    expect(container).toHaveStyle(style);
  });

  it('应该在语言切换时更新DOM', () => {
    render(<LocaleSwitch />);
    const select = screen.getByRole('combobox');
    
    fireEvent.change(select, { target: { value: 'en-US' } });
    expect(document.documentElement.getAttribute('lang')).toBe('en-US');
    
    fireEvent.change(select, { target: { value: 'zh-CN' } });
    expect(document.documentElement.getAttribute('lang')).toBe('zh-CN');
  });

  it('应该在语言切换时保存到localStorage', () => {
    render(<LocaleSwitch />);
    const select = screen.getByRole('combobox');
    
    fireEvent.change(select, { target: { value: 'en-US' } });
    expect(localStorage.getItem('language')).toBe('en-US');
    
    fireEvent.change(select, { target: { value: 'zh-CN' } });
    expect(localStorage.getItem('language')).toBe('zh-CN');
  });
}); 