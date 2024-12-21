import React from 'react';

import Loading, { loading } from '../index';
import { render, screen } from '@testing-library/react';

describe('Loading Component', () => {
  it('应该在visible为true时显示', () => {
    render(<Loading visible={true} />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('应该在visible为false时不显示', () => {
    render(<Loading visible={false} />);
    expect(screen.queryByText('加载中...')).not.toBeInTheDocument();
  });

  it('应该显示自定义提示文本', () => {
    render(<Loading visible={true} tip="自定义提示" />);
    expect(screen.getByText('自定义提示')).toBeInTheDocument();
  });

  it('应该支持全屏模式', () => {
    render(<Loading visible={true} fullscreen={true} />);
    expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument();
  });
});

describe('Loading Service', () => {
  beforeEach(() => {
    // 清理DOM
    document.body.innerHTML = '';
  });

  it('应该显示加载状态', () => {
    loading.show();
    expect(screen.getByText('加载中...(1)')).toBeInTheDocument();
  });

  it('应���显示自定义提示', () => {
    loading.show('自定义提示');
    expect(screen.getByText('自定义提示')).toBeInTheDocument();
  });

  it('应该支持多个加载状态', () => {
    loading.show('加载1');
    loading.show('加载2');
    expect(screen.getByText('加载中...(2)')).toBeInTheDocument();
  });

  it('应该正确关闭加载状态', () => {
    const hide1 = loading.show();
    const hide2 = loading.show();

    expect(screen.getByText('加载中...(2)')).toBeInTheDocument();

    hide1();
    expect(screen.getByText('加载中...(1)')).toBeInTheDocument();

    hide2();
    expect(screen.queryByText('加载中...')).not.toBeInTheDocument();
  });

  it('应该一次性关闭所有加载状态', () => {
    loading.show();
    loading.show();
    loading.show();

    expect(screen.getByText('加载中...(3)')).toBeInTheDocument();

    loading.hideAll();
    expect(screen.queryByText('加载中...')).not.toBeInTheDocument();
  });
});
