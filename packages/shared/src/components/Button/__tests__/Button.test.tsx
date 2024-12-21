import React from 'react';

import { Button } from '../index';
import { render } from '@testing-library/react';

describe('Button 组件', () => {
  it('应该渲染基础按钮', () => {
    const { container } = render(<Button>按钮</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染不同变体', () => {
    const variants = ['primary', 'secondary', 'text'] as const;
    variants.forEach(variant => {
      const { container } = render(<Button variant={variant}>{variant} 按钮</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('应该渲染不同尺寸', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    sizes.forEach(size => {
      const { container } = render(<Button size={size}>{size} 按钮</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('应该渲染加载状态', () => {
    const { container } = render(<Button loading>加载中</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染禁用状态', () => {
    const { container } = render(<Button disabled>禁用按钮</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该渲染块级按钮', () => {
    const { container } = render(<Button block>块级按钮</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('应该支持自定义类名', () => {
    const { container } = render(<Button className="custom-class">自定义类名</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
