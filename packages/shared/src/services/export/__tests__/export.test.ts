import { exportService } from '../index';
import { storage } from '../../storage';
import { logger } from '../../logger';
import { IHealthData, HealthDataType } from '../../../types';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Mock dependencies
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn(() => ({})),
    json_to_sheet: jest.fn(() => ({})),
    book_append_sheet: jest.fn()
  },
  writeFile: jest.fn()
}));

jest.mock('../../storage', () => ({
  storage: {
    setItem: jest.fn(),
    getItem: jest.fn()
  }
}));

jest.mock('../../logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('ExportService', () => {
  // 测试数据
  const mockHealthData: IHealthData[] = [
    {
      id: '1',
      type: HealthDataType.BLOOD_PRESSURE,
      value: 120,
      timestamp: new Date('2023-01-01'),
      userId: 'user1'
    },
    {
      id: '2',
      type: HealthDataType.HEART_RATE,
      value: 75,
      timestamp: new Date('2023-01-02'),
      userId: 'user1',
      deleted: true
    },
    {
      id: '3',
      type: HealthDataType.BLOOD_SUGAR,
      value: 5.5,
      timestamp: new Date('2023-01-03'),
      userId: 'user1'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始化', () => {
    it('应该是单例', () => {
      const instance1 = exportService;
      const instance2 = exportService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('数据过滤', () => {
    it('应该正确过滤已删除数据', async () => {
      await exportService.exportData(mockHealthData, {
        format: 'json',
        includeDeleted: false
      });

      const savedData = JSON.parse(
        (saveAs as jest.Mock).mock.calls[0][0].text()
      );
      expect(savedData.length).toBe(2);
      expect(savedData.every((item: IHealthData) => !item.deleted)).toBe(true);
    });

    it('应该正确过滤时间范围', async () => {
      await exportService.exportData(mockHealthData, {
        format: 'json',
        dateRange: {
          start: new Date('2023-01-01'),
          end: new Date('2023-01-02')
        }
      });

      const savedData = JSON.parse(
        (saveAs as jest.Mock).mock.calls[0][0].text()
      );
      expect(savedData.length).toBe(2);
    });

    it('应该正确过滤数据类型', async () => {
      await exportService.exportData(mockHealthData, {
        format: 'json',
        types: [HealthDataType.BLOOD_PRESSURE]
      });

      const savedData = JSON.parse(
        (saveAs as jest.Mock).mock.calls[0][0].text()
      );
      expect(savedData.length).toBe(1);
      expect(savedData[0].type).toBe(HealthDataType.BLOOD_PRESSURE);
    });
  });

  describe('导出格式', () => {
    it('应该正确导出JSON格式', async () => {
      await exportService.exportData(mockHealthData, {
        format: 'json',
        filename: 'test'
      });

      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        'test.json'
      );

      const savedData = JSON.parse(
        (saveAs as jest.Mock).mock.calls[0][0].text()
      );
      expect(Array.isArray(savedData)).toBe(true);
    });

    it('应该正确导出CSV格式', async () => {
      await exportService.exportData(mockHealthData, {
        format: 'csv',
        filename: 'test'
      });

      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        'test.csv'
      );

      const content = (saveAs as jest.Mock).mock.calls[0][0].text();
      const lines = content.split('\n');
      expect(lines[0]).toBe('ID,类型,数值,时间,用户ID');
      expect(lines.length).toBeGreaterThan(1);
    });

    it('应该正确导��Excel格式', async () => {
      await exportService.exportData(mockHealthData, {
        format: 'xlsx',
        filename: 'test'
      });

      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
      expect(XLSX.writeFile).toHaveBeenCalledWith(
        expect.any(Object),
        'test.xlsx'
      );
    });

    it('应该正确创建备份', async () => {
      await exportService.exportData(mockHealthData, {
        format: 'backup',
        filename: 'test',
        compress: false
      });

      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        'test.json'
      );

      const backup = JSON.parse(
        (saveAs as jest.Mock).mock.calls[0][0].text()
      );
      expect(backup.version).toBe('1.0');
      expect(backup.data).toEqual(mockHealthData);
      expect(backup.metadata).toBeDefined();
    });

    it('应该处理不支持的格式', async () => {
      await expect(
        exportService.exportData(mockHealthData, {
          format: 'invalid' as any
        })
      ).rejects.toThrow('不支持的导出格式');
    });
  });

  describe('备份导入', () => {
    it('应该正确导入有效的备份', async () => {
      const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: mockHealthData,
        metadata: {
          count: mockHealthData.length,
          types: [HealthDataType.BLOOD_PRESSURE]
        }
      };

      const file = new File(
        [JSON.stringify(backup)],
        'backup.json',
        { type: 'application/json' }
      );

      const result = await exportService.importBackup(file);

      expect(result).toEqual(mockHealthData);
      expect(storage.setItem).toHaveBeenCalledTimes(mockHealthData.length + 1);
    });

    it('应该拒绝无效的备份文件', async () => {
      const invalidBackup = {
        data: mockHealthData
      };

      const file = new File(
        [JSON.stringify(invalidBackup)],
        'invalid-backup.json',
        { type: 'application/json' }
      );

      await expect(exportService.importBackup(file)).rejects.toThrow(
        '无效的备份文件'
      );
    });

    it('应该处理文件读取错误', async () => {
      const file = new File(['invalid json'], 'invalid.json', {
        type: 'application/json'
      });

      await expect(exportService.importBackup(file)).rejects.toThrow();
    });
  });

  describe('错误处理', () => {
    it('应该记录导出错误', async () => {
      (saveAs as jest.Mock).mockImplementationOnce(() => {
        throw new Error('保存失败');
      });

      await expect(
        exportService.exportData(mockHealthData, { format: 'json' })
      ).rejects.toThrow();

      expect(logger.error).toHaveBeenCalled();
    });

    it('应该记录导入错误', async () => {
      const file = new File(['invalid json'], 'invalid.json', {
        type: 'application/json'
      });

      await expect(exportService.importBackup(file)).rejects.toThrow();
      expect(logger.error).toHaveBeenCalled();
    });
  });
}); 