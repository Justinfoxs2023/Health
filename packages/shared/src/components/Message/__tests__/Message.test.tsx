import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { message } from '../index';

describe('Message', () => {
  beforeEach(() => {
    // 清理DOM
    document.body.innerHTML = '';
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('应该显示信息提示', () => {
    message.info('测试信息');
    expect(screen.getByText('测试信息')).toBeInTheDocument();
  });

  it('应该显示成功提示', () => {
    message.success('操作成功');
    expect(screen.getByText('操作成功')).toBeInTheDocument();
  });

  it('应该显示警告提示', () => {
    message.warning('警告信息');
    expect(screen.getByText('警告信息')).toBeInTheDocument();
  });

  it('应该显示错误提示', () => {
    message.error('错误信息');
    expect(screen.getByText('错误信息')).toBeInTheDocument();
  });

  it('应该在指定时间后自动关闭', () => {
    message.info('自动关闭', 1000);
    expect(screen.getByText('自动关闭')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByText('自动关闭')).not.toBeInTheDocument();
  });

  it('应该支持手动关闭', () => {
    const close = message.info('手动关闭', 0);
    expect(screen.getByText('手动关闭')).toBeInTheDocument();

    act(() => {
      close();
    });

    expect(screen.queryByText('手动关闭')).not.toBeInTheDocument();
  });

  it('应该支持多个消息同时显示', () => {
    message.info('消息1');
    message.success('消息2');
    message.warning('消息3');

    expect(screen.getByText('消息1')).toBeInTheDocument();
    expect(screen.getByText('消息2')).toBeInTheDocument();
    expect(screen.getByText('消息3')).toBeInTheDocument();
  });

  it('应该按顺序关闭消息', () => {
    message.info('消息1', 1000);
    message.info('消息2', 2000);

    expect(screen.getByText('消息1')).toBeInTheDocument();
    expect(screen.getByText('消息2')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByText('消息1')).not.toBeInTheDocument();
    expect(screen.getByText('消息2')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByText('消息2')).not.toBeInTheDocument();
  });
}); 