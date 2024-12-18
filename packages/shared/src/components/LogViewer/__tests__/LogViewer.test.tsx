import React from 'react';

import { LogViewer } from '../index';
import { i18n } from '../../../services/i18n';
import { logger } from '../../../services/logger';
import { render, screen, act } from '@testing-library/react';

// 模拟日志数据
const mockLogs = [
  {
    timestamp: 1609459200000, // 2021-01-01T00:00:00.000Z
    level: 'info' as const,
    message: 'Info message',
    source: 'test.ts',
  },
  {
    timestamp: 1609459201000,
    level: 'error' as const,
    message: 'Error message',
    stack: 'Error stack trace',
    data: { error: true },
  },
  {
    timestamp: 1609459202000,
    level: 'warn' as const,
    message: 'Warning message',
    data: { warning: true },
  },
];

jest.mock('../../../services/logger', () => ({
  logger: {
    getLogs: jest.fn(),
  },
}));

describe('LogViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (logger.getLogs as jest.Mock).mockResolvedValue(mockLogs);
  });

  it('应该渲染日志条目', async () => {
    render(<LogViewer />);

    // 等待日志加载
    await screen.findByText('Info message');

    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('应该显示加载状态', () => {
    render(<LogViewer />);
    expect(screen.getByText('logViewer.loading')).toBeInTheDocument();
  });

  it('应该显示错误状态', async () => {
    const error = new Error('Failed to load logs');
    (logger.getLogs as jest.Mock).mockRejectedValue(error);

    render(<LogViewer />);

    await screen.findByText(/logViewer.error/);
    expect(screen.getByText(/Failed to load logs/)).toBeInTheDocument();
  });

  it('应该根据级别过滤日志', async () => {
    render(<LogViewer levelFilter={['error']} />);

    await screen.findByText('Error message');

    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning message')).not.toBeInTheDocument();
  });

  it('应该限制显示条数', async () => {
    render(<LogViewer maxEntries={2} />);

    await screen.findByText('Warning message');

    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('应该显示/隐藏时间戳', async () => {
    const { rerender } = render(<LogViewer showTimestamp={true} />);
    await screen.findByText('Info message');
    expect(screen.getByText(/2021-01-01/)).toBeInTheDocument();

    rerender(<LogViewer showTimestamp={false} />);
    expect(screen.queryByText(/2021-01-01/)).not.toBeInTheDocument();
  });

  it('应该显示/隐藏日志级别', async () => {
    const { rerender } = render(<LogViewer showLevel={true} />);
    await screen.findByText('Info message');
    expect(screen.getByText(/\[INFO\]/)).toBeInTheDocument();

    rerender(<LogViewer showLevel={false} />);
    expect(screen.queryByText(/\[INFO\]/)).not.toBeInTheDocument();
  });

  it('应该显示/隐藏源代码信息', async () => {
    const { rerender } = render(<LogViewer showSource={true} />);
    await screen.findByText('Info message');
    expect(screen.getByText(/@test\.ts/)).toBeInTheDocument();

    rerender(<LogViewer showSource={false} />);
    expect(screen.queryByText(/@test\.ts/)).not.toBeInTheDocument();
  });

  it('应该显示/隐藏额外数据', async () => {
    const { rerender } = render(<LogViewer showData={true} />);
    await screen.findByText('Error message');
    expect(screen.getByText(/"error": true/)).toBeInTheDocument();

    rerender(<LogViewer showData={false} />);
    expect(screen.queryByText(/"error": true/)).not.toBeInTheDocument();
  });

  it('应该显示/隐藏堆栈信息', async () => {
    const { rerender } = render(<LogViewer showStack={true} />);
    await screen.findByText('Error message');
    expect(screen.getByText('Error stack trace')).toBeInTheDocument();

    rerender(<LogViewer showStack={false} />);
    expect(screen.queryByText('Error stack trace')).not.toBeInTheDocument();
  });

  it('应该自动刷新日志', async () => {
    jest.useFakeTimers();

    render(<LogViewer refreshInterval={1000} />);
    await screen.findByText('Info message');

    const newLogs = [
      ...mockLogs,
      {
        timestamp: 1609459203000,
        level: 'info' as const,
        message: 'New message',
      },
    ];
    (logger.getLogs as jest.Mock).mockResolvedValue(newLogs);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await screen.findByText('New message');

    jest.useRealTimers();
  });

  it('应该应用自定义类名和样式', async () => {
    const className = 'custom-class';
    const style = { width: '500px' };

    render(<LogViewer className={className} style={style} />);
    await screen.findByText('Info message');

    const container = screen.getByText('Info message').closest('.log-viewer');
    expect(container).toHaveClass(className);
    expect(container).toHaveStyle(style);
  });
});
