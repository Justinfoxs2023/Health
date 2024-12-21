import React from 'react';

import { Input } from '../index';
import { render } from '@testing-library/react';

describe('Input 组件', () => {
  it('应该渲染基础输入框', () => {
    const { container } = render(<Input placeholder="请输入" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染带标签的输入框', () => {
    const { container } = render(<Input label="用户名" placeholder="请输入用户名" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染错误状态', () => {
    const { container } = render(
      <Input label="用户名" error="用户名不能为空" placeholder="请输入用户名" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染帮助文本', () => {
    const { container } = render(
      <Input label="用户名" helpText="请输入3-20个字符" placeholder="请输入用户名" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染不同尺寸', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    sizes.forEach(size => {
      const { container } = render(<Input size={size} placeholder={`${size} 输入框`} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('应该渲染前缀图标', () => {
    const { container } = render(<Input prefix={<span>@</span>} placeholder="请输入用户名" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染后缀图标', () => {
    const { container } = render(<Input suffix={<span>元</span>} placeholder="请输入金额" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染禁用状态', () => {
    const { container } = render(<Input disabled placeholder="禁用状态" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染块级输入框', () => {
    const { container } = render(<Input block placeholder="块级输入框" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该支持自定义类名', () => {
    const { container } = render(<Input className="custom-input" placeholder="自定义类名" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
