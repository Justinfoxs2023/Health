import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseService } from '../database/DatabaseService';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export interface IExportOptions {
  /** format 的描述 */
    format: excel  csv  json;
  filters: Recordstring, any;
  fields: string;
  sortBy: Recordstring, 1  1;
  filename: string;
}

@Injectable()
export class DataExportService {
  constructor(private readonly logger: Logger, private readonly databaseService: DatabaseService) {}

  async exportData(collection: string, options: IExportOptions): Promise<string> {
    try {
      const data = await this.fetchData(collection, options);
      const exportPath = await this.ensureExportDirectory();
      const filename = options.filename || `export_${Date.now()}`;

      switch (options.format) {
        case 'excel':
          return await this.exportToExcel(data, filename, exportPath);
        case 'csv':
          return await this.exportToCsv(data, filename, exportPath);
        case 'json':
          return await this.exportToJson(data, filename, exportPath);
        default:
          throw new Error('不支持的导出格式');
      }
    } catch (error) {
      this.logger.error('数据导出失败', error);
      throw error;
    }
  }

  private async fetchData(collection: string, options: IExportOptions): Promise<any[]> {
    const query = options.filters || {};
    const projection = options.fields
      ? options.fields.reduce((acc, field) => ({ ...acc, [field]: 1 }), {})
      : {};
    const sort = options.sortBy || { _id: 1 };

    return await this.databaseService.find(collection, query, {
      projection,
      sort,
    });
  }

  private async ensureExportDirectory(): Promise<string> {
    const exportPath = path.join(process.cwd(), 'exports');
    await mkdir(exportPath, { recursive: true });
    return exportPath;
  }

  private async exportToExcel(data: any[], filename: string, exportPath: string): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    if (data.length > 0) {
      // 设置表头
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      // 添加数据
      data.forEach(item => {
        worksheet.addRow(headers.map(header => item[header]));
      });
    }

    const filePath = path.join(exportPath, `${filename}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }

  private async exportToCsv(data: any[], filename: string, exportPath: string): Promise<string> {
    if (data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(item =>
        headers
          .map(header => {
            const value = item[header];
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
          })
          .join(','),
      ),
    ].join('\n');

    const filePath = path.join(exportPath, `${filename}.csv`);
    await writeFile(filePath, csvContent);
    return filePath;
  }

  private async exportToJson(data: any[], filename: string, exportPath: string): Promise<string> {
    const filePath = path.join(exportPath, `${filename}.json`);
    await writeFile(filePath, JSON.stringify(data, null, 2));
    return filePath;
  }

  async getExportHistory(): Promise<
    {
      filename: string;
      format: string;
      size: number;
      createdAt: Date;
    }[]
  > {
    try {
      const exportPath = path.join(process.cwd(), 'exports');
      const files = await promisify(fs.readdir)(exportPath);

      const history = await Promise.all(
        files.map(async file => {
          const stats = await promisify(fs.stat)(path.join(exportPath, file));
          return {
            filename: file,
            format: path.extname(file).slice(1),
            size: stats.size,
            createdAt: stats.birthtime,
          };
        }),
      );

      return history.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      this.logger.error('获取导出历史失败', error);
      throw error;
    }
  }

  async deleteExportFile(filename: string): Promise<void> {
    try {
      const exportPath = path.join(process.cwd(), 'exports');
      const filePath = path.join(exportPath, filename);
      await promisify(fs.unlink)(filePath);
      this.logger.info(`删除导出文件成功: ${filename}`);
    } catch (error) {
      this.logger.error(`删除导出文件失败: ${filename}`, error);
      throw error;
    }
  }

  async cleanupOldExports(days: number): Promise<void> {
    try {
      const exportPath = path.join(process.cwd(), 'exports');
      const files = await promisify(fs.readdir)(exportPath);
      const now = Date.now();
      const maxAge = days * 24 * 60 * 60 * 1000;

      await Promise.all(
        files.map(async file => {
          const filePath = path.join(exportPath, file);
          const stats = await promisify(fs.stat)(filePath);
          if (now - stats.birthtime.getTime() > maxAge) {
            await promisify(fs.unlink)(filePath);
            this.logger.info(`清理过期导出文件: ${file}`);
          }
        }),
      );
    } catch (error) {
      this.logger.error('清理过期导出文件失败', error);
      throw error;
    }
  }
}
