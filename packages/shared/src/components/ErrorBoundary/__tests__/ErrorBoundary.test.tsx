import React from 'react';

import { ErrorBoundary } from '../index';
import { i18n } from '../../../services/i18n';
import { logger } from '../../../services/logger';
import { render, screen, fireEvent } from '@testing-library/react';

// 模拟日志服务
jest.mock('../../../services/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

// 模拟国际化服务
jest.mock('../../../services/i18n', () => ({
  i18n: {
    t: (key: string) => key,
  },
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('应该正常渲染子组件', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>正常内容</div>
      </ErrorBoundary>,
    );

    expect(container).toHaveTextContent('正常内容');
  });

  it('应该捕获错误并显示错误UI', () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText('errorBoundary.title')).toBeInTheDocument();
    expect(screen.getByText('errorBoundary.message')).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      'React error boundary caught error',
      expect.any(Object),
    );
  });

  it('应该使用自定义错误UI', () => {
    const fallback = <div>自定义错误UI</div>;

    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText('自定义错误UI')).toBeInTheDocument();
  });

  it('应该支持刷新页面', () => {
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByText('errorBoundary.reload'));
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('应该正确处理错误回调', () => {
    const onError = jest.fn();
    const error = new Error('Test error');

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledWith(
      error,
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
  });

  it('应该显示错误详情', () => {
    const error = new Error('Test error');
    error.stack = 'Error stack trace';

    const ThrowSpecificError = () => {
      throw error;
    };

    render(
      <ErrorBoundary>
        <ThrowSpecificError />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/Test error/)).toBeInTheDocument();
    expect(screen.getByText(/Error stack trace/)).toBeInTheDocument();
  });

  it('应该应用正确的样式', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    const container = screen.getByText('errorBoundary.title').closest('.error-boundary');
    expect(container).toHaveClass('error-boundary');
    expect(container).toMatchSnapshot();
  });
});
