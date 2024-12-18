import React from 'react';

import { DataExport } from '../index';
import { Message } from '../../Message';
import { exportService } from '../../../services/export';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock services
jest.mock('../../../services/export');
jest.mock('../../Message');

describe('DataExport Component', () => {
  const mockData = [
    { id: 1, name: 'Test 1', value: 100 },
    { id: 2, name: 'Test 2', value: 200 },
  ];

  const mockExportSuccess = jest.fn();
  const mockExportError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (exportService.getBackupList as jest.Mock).mockResolvedValue([]);
  });

  it('renders export button with default text', () => {
    render(<DataExport data={mockData} />);
    expect(screen.getByText('导出数据')).toBeInTheDocument();
  });

  it('renders export button with custom text', () => {
    render(<DataExport data={mockData} buttonText="自定义导出" />);
    expect(screen.getByText('自定义导出')).toBeInTheDocument();
  });

  it('opens modal when clicking export button', () => {
    render(<DataExport data={mockData} />);
    fireEvent.click(screen.getByText('导出数据'));
    expect(screen.getByText('数据导出与备份')).toBeInTheDocument();
  });

  it('handles successful data export', async () => {
    const mockBlob = new Blob(['test'], { type: 'application/json' });
    (exportService.exportData as jest.Mock).mockResolvedValue(mockBlob);

    render(
      <DataExport
        data={mockData}
        onExportSuccess={mockExportSuccess}
        onExportError={mockExportError}
      />,
    );

    // 打开模态框
    fireEvent.click(screen.getByText('导出数据'));

    // 选择导出格式
    const formatSelect = screen.getByRole('combobox');
    fireEvent.change(formatSelect, { target: { value: 'json' } });

    // 点击导出按钮
    fireEvent.click(screen.getByText('导出'));

    await waitFor(() => {
      expect(exportService.exportData).toHaveBeenCalledWith(
        mockData,
        expect.objectContaining({
          format: 'json',
          includeMetadata: true,
        }),
      );
      expect(mockExportSuccess).toHaveBeenCalled();
      expect(Message.success).toHaveBeenCalledWith('数据导出成功');
    });
  });

  it('handles export error', async () => {
    const mockError = new Error('Export failed');
    (exportService.exportData as jest.Mock).mockRejectedValue(mockError);

    render(
      <DataExport
        data={mockData}
        onExportSuccess={mockExportSuccess}
        onExportError={mockExportError}
      />,
    );

    // 打开模态框
    fireEvent.click(screen.getByText('导出数据'));

    // 点击导出按钮
    fireEvent.click(screen.getByText('导出'));

    await waitFor(() => {
      expect(mockExportError).toHaveBeenCalledWith(mockError);
      expect(Message.error).toHaveBeenCalledWith('数据导出失败');
    });
  });

  it('handles successful backup creation', async () => {
    const mockMetadata = {
      id: 'backup_123',
      createdAt: new Date(),
      version: '1.0.0',
      size: 1000,
      encrypted: false,
      recordCount: 2,
    };
    (exportService.createBackup as jest.Mock).mockResolvedValue(mockMetadata);

    render(<DataExport data={mockData} />);

    // 打开模态框
    fireEvent.click(screen.getByText('导出数据'));

    // 点击创建备份按钮
    fireEvent.click(screen.getByText('创建备份'));

    await waitFor(() => {
      expect(exportService.createBackup).toHaveBeenCalledWith(mockData, expect.any(Object));
      expect(Message.success).toHaveBeenCalledWith('创建备份成功');
    });
  });

  it('handles backup creation error', async () => {
    const mockError = new Error('Backup failed');
    (exportService.createBackup as jest.Mock).mockRejectedValue(mockError);

    render(<DataExport data={mockData} />);

    // 打开模态框
    fireEvent.click(screen.getByText('导出数据'));

    // 点击创建备份按钮
    fireEvent.click(screen.getByText('创建备份'));

    await waitFor(() => {
      expect(Message.error).toHaveBeenCalledWith('创建备份失败');
    });
  });

  it('handles backup restoration', async () => {
    const mockBackups = [
      {
        id: 'backup_123',
        createdAt: new Date(),
        version: '1.0.0',
        description: 'Test Backup',
        size: 1000,
        encrypted: false,
        recordCount: 2,
      },
    ];
    (exportService.getBackupList as jest.Mock).mockResolvedValue(mockBackups);
    (exportService.restoreBackup as jest.Mock).mockResolvedValue(mockData);

    render(<DataExport data={mockData} />);

    // 打开模态框
    fireEvent.click(screen.getByText('导出数据'));

    // 选择备份
    const backupSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(backupSelect, { target: { value: 'backup_123' } });

    // 点击恢复备份按钮
    fireEvent.click(screen.getByText('恢复备份'));

    await waitFor(() => {
      expect(exportService.restoreBackup).toHaveBeenCalledWith('backup_123', undefined);
      expect(Message.success).toHaveBeenCalledWith('恢复备份成功');
    });
  });

  it('handles backup deletion', async () => {
    const mockBackups = [
      {
        id: 'backup_123',
        createdAt: new Date(),
        version: '1.0.0',
        description: 'Test Backup',
        size: 1000,
        encrypted: false,
        recordCount: 2,
      },
    ];
    (exportService.getBackupList as jest.Mock).mockResolvedValue(mockBackups);

    render(<DataExport data={mockData} />);

    // 打开模态框
    fireEvent.click(screen.getByText('导出数据'));

    // 选择备份
    const backupSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(backupSelect, { target: { value: 'backup_123' } });

    // 点击删除备份按钮
    fireEvent.click(screen.getByText('删除备份'));

    await waitFor(() => {
      expect(exportService.deleteBackup).toHaveBeenCalledWith('backup_123');
      expect(Message.success).toHaveBeenCalledWith('删除备份成功');
    });
  });

  it('handles encryption options', async () => {
    render(<DataExport data={mockData} />);

    // 打开模态框
    fireEvent.click(screen.getByText('导出数据'));

    // 启用加密
    const encryptCheckbox = screen.getByText('加密数据').previousElementSibling as HTMLInputElement;
    fireEvent.click(encryptCheckbox);

    // 验证密钥输入框出现
    expect(screen.getByPlaceholderText('请输入加密密钥')).toBeInTheDocument();

    // 输入密钥
    const keyInput = screen.getByPlaceholderText('请输入加密密钥') as HTMLInputElement;
    fireEvent.change(keyInput, { target: { value: 'test-key' } });

    // 点击导出按钮
    fireEvent.click(screen.getByText('导出'));

    await waitFor(() => {
      expect(exportService.exportData).toHaveBeenCalledWith(
        mockData,
        expect.objectContaining({
          encrypt: true,
          encryptionKey: 'test-key',
        }),
      );
    });
  });
});
