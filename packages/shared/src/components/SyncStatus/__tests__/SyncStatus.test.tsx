import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SyncStatus } from '../index';
import { syncService } from '../../../services/sync';
import { Message } from '../../Message';

// Mock syncService
jest.mock('../../../services/sync', () => ({
  syncService: {
    getState: jest.fn(),
    sync: jest.fn()
  }
}));

// Mock Message
jest.mock('../../Message', () => ({
  Message: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      const translations: { [key: string]: string } = {
        'sync.offline': '离线',
        'sync.syncing': '同步中',
        'sync.pending': `待同步: ${params?.count || 0}`,
        'sync.synced': '已同步',
        'sync.button': '同步',
        'sync.success': '同步成功',
        'sync.error': '同步失败',
        'sync.lastSync': `上次同步: ${params?.time || ''}`,
        'sync.pendingDetails': `${params?.count || 0} 条数据待同步`
      };
      return translations[key] || key;
    }
  })
}));

describe('SyncStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 默认在线状态
    (syncService.getState as jest.Mock).mockReturnValue({
      syncing: false,
      lastSyncTime: new Date(),
      pendingCount: 0,
      offline: false
    });
  });

  it('应该正确渲染基本状态', () => {
    render(<SyncStatus />);
    expect(screen.getByText('已同步')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '同步' })).toBeInTheDocument();
  });

  it('应该显示离线状态', () => {
    (syncService.getState as jest.Mock).mockReturnValue({
      syncing: false,
      lastSyncTime: null,
      pendingCount: 0,
      offline: true
    });

    render(<SyncStatus />);
    expect(screen.getByText('离线')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('应该显示同步中状态', () => {
    (syncService.getState as jest.Mock).mockReturnValue({
      syncing: true,
      lastSyncTime: new Date(),
      pendingCount: 0,
      offline: false
    });

    render(<SyncStatus />);
    expect(screen.getByText('同步中')).toBeInTheDocument();
  });

  it('应该显示待同步状态', () => {
    (syncService.getState as jest.Mock).mockReturnValue({
      syncing: false,
      lastSyncTime: new Date(),
      pendingCount: 5,
      offline: false
    });

    render(<SyncStatus />);
    expect(screen.getByText('待同步: 5')).toBeInTheDocument();
  });

  it('应该正确处理手动同步', async () => {
    (syncService.sync as jest.Mock).mockResolvedValueOnce(undefined);

    render(<SyncStatus />);
    const syncButton = screen.getByRole('button', { name: '同步' });

    await act(async () => {
      fireEvent.click(syncButton);
    });

    expect(syncService.sync).toHaveBeenCalled();
    expect(Message.success).toHaveBeenCalledWith('同步成功');
  });

  it('应该正确处理同步错误', async () => {
    const error = new Error('同步失败');
    (syncService.sync as jest.Mock).mockRejectedValueOnce(error);

    render(<SyncStatus />);
    const syncButton = screen.getByRole('button', { name: '同步' });

    await act(async () => {
      fireEvent.click(syncButton);
    });

    expect(syncService.sync).toHaveBeenCalled();
    expect(Message.error).toHaveBeenCalledWith('同步失败');
  });

  it('应该正确显示详细信息', () => {
    const lastSyncTime = new Date();
    (syncService.getState as jest.Mock).mockReturnValue({
      syncing: false,
      lastSyncTime,
      pendingCount: 3,
      offline: false
    });

    render(<SyncStatus showDetails />);
    expect(screen.getByText(/上次同步:/)).toBeInTheDocument();
    expect(screen.getByText('3 条数据待同步')).toBeInTheDocument();
  });

  it('应该响应状态变化事件', () => {
    render(<SyncStatus />);

    // 模拟状态变化事件
    act(() => {
      window.dispatchEvent(
        new CustomEvent('syncStateChange', {
          detail: {
            syncing: true,
            lastSyncTime: new Date(),
            pendingCount: 0,
            offline: false
          }
        })
      );
    });

    expect(screen.getByText('同步中')).toBeInTheDocument();
  });

  it('应该根据props控制按钮显示', () => {
    const { rerender } = render(<SyncStatus showSyncButton={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<SyncStatus showSyncButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('应该应用自定义类名', () => {
    render(<SyncStatus className="custom-class" />);
    expect(screen.getByText('已同步').parentElement?.parentElement).toHaveClass(
      'custom-class'
    );
  });
}); 