import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { DataAnalysisService } from '../data-analysis/DataAnalysisService';
import { DatabaseService } from '../database/DatabaseService';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/Logger';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);

export interface IReportTemplate {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** type 的描述 */
    type: string;
  /** sections 的描述 */
    sections: IReportSection;
  /** style 的描述 */
    style: IReportStyle;
}

export interface IReportSection {
  /** type 的描述 */
    type: text  table  chart  image;
  title: string;
  content: any;
  options: any;
}

export interface IReportStyle {
  /** font 的描述 */
    font: string;
  /** fontSize 的描述 */
    fontSize: number;
  /** color 的描述 */
    color: string;
  /** spacing 的描述 */
    spacing: number;
  /** margins 的描述 */
    margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface IReportData {
  /** template 的描述 */
    template: string;
  /** data 的描述 */
    data: any;
  /** options 的描述 */
    options: {
    format: pdf  html  word;
    filename: string;
    watermark: string;
  };
}

@Injectable()
export class ReportGenerationService {
  constructor(
    private readonly logger: Logger,
    private readonly databaseService: DatabaseService,
    private readonly dataAnalysisService: DataAnalysisService,
  ) {}

  async generateReport(reportData: IReportData): Promise<string> {
    try {
      const template = await this.getTemplate(reportData.template);
      const reportPath = await this.ensureReportDirectory();
      const filename = reportData.options?.filename || `report_${Date.now()}`;

      switch (reportData.options?.format || 'pdf') {
        case 'pdf':
          return await this.generatePDFReport(template, reportData.data, filename, reportPath);
        case 'html':
          return await this.generateHTMLReport(template, reportData.data, filename, reportPath);
        case 'word':
          return await this.generateWordReport(template, reportData.data, filename, reportPath);
        default:
          throw new Error('不支持的报表格式');
      }
    } catch (error) {
      this.logger.error('报表生成失败', error);
      throw error;
    }
  }

  private async getTemplate(templateId: string): Promise<IReportTemplate> {
    const template = await this.databaseService.findOne('report_templates', { id: templateId });
    if (!template) {
      throw new Error(`报表模板不存在: ${templateId}`);
    }
    return template;
  }

  private async ensureReportDirectory(): Promise<string> {
    const reportPath = path.join(process.cwd(), 'reports');
    await mkdir(reportPath, { recursive: true });
    return reportPath;
  }

  private async generatePDFReport(
    template: IReportTemplate,
    data: any,
    filename: string,
    reportPath: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(reportPath, `${filename}.pdf`);
      const doc = new PDFDocument({
        size: 'A4',
        margins: template.style.margins,
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // 添加水印
      if (data.options?.watermark) {
        doc
          .save()
          .translate(doc.page.width / 2, doc.page.height / 2)
          .rotate(-45)
          .fontSize(60)
          .fillOpacity(0.1)
          .text(data.options.watermark, 0, 0, { align: 'center' })
          .restore();
      }

      // 生成报表内容
      for (const section of template.sections) {
        this.generatePDFSection(doc, section, data);
      }

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  private generatePDFSection(doc: PDFKit.PDFDocument, section: IReportSection, data: any): void {
    switch (section.type) {
      case 'text':
        this.generatePDFText(doc, section, data);
        break;
      case 'table':
        this.generatePDFTable(doc, section, data);
        break;
      case 'chart':
        this.generatePDFChart(doc, section, data);
        break;
      case 'image':
        this.generatePDFImage(doc, section, data);
        break;
    }
  }

  private generatePDFText(doc: PDFKit.PDFDocument, section: IReportSection, data: any): void {
    if (section.title) {
      doc.fontSize(14).text(section.title, { underline: true });
      doc.moveDown();
    }
    doc.fontSize(12).text(this.interpolateContent(section.content, data));
    doc.moveDown();
  }

  private generatePDFTable(doc: PDFKit.PDFDocument, section: IReportSection, data: any): void {
    if (section.title) {
      doc.fontSize(14).text(section.title, { underline: true });
      doc.moveDown();
    }

    const tableData = this.getTableData(section.content, data);
    const startX = doc.page.margins.left;
    let startY = doc.y;
    const cellPadding = 5;
    const cellWidth =
      (doc.page.width - doc.page.margins.left - doc.page.margins.right) / tableData[0].length;

    // 绘制表头
    doc.fontSize(12);
    tableData[0].forEach((header, i) => {
      doc.rect(startX + i * cellWidth, startY, cellWidth, 30).stroke();
      doc.text(header, startX + i * cellWidth + cellPadding, startY + cellPadding);
    });

    startY += 30;

    // 绘制数据行
    tableData.slice(1).forEach(row => {
      row.forEach((cell, i) => {
        doc.rect(startX + i * cellWidth, startY, cellWidth, 25).stroke();
        doc.text(cell.toString(), startX + i * cellWidth + cellPadding, startY + cellPadding);
      });
      startY += 25;
    });

    doc.moveDown();
  }

  private generatePDFChart(doc: PDFKit.PDFDocument, section: IReportSection, data: any): void {
    // TODO: 实现图表生成
    this.logger.warn('PDF图表生成功能尚未实现');
  }

  private generatePDFImage(doc: PDFKit.PDFDocument, section: IReportSection, data: any): void {
    if (section.content) {
      doc.image(section.content, {
        fit: [500, 300],
        align: 'center',
        valign: 'center',
      });
      doc.moveDown();
    }
  }

  private async generateHTMLReport(
    template: IReportTemplate,
    data: any,
    filename: string,
    reportPath: string,
  ): Promise<string> {
    // TODO: 实现HTML报表生成
    throw new Error('HTML报表生成功能尚未实现');
  }

  private async generateWordReport(
    template: IReportTemplate,
    data: any,
    filename: string,
    reportPath: string,
  ): Promise<string> {
    // TODO: 实现Word报表生成
    throw new Error('Word报表生成功能尚��实现');
  }

  private interpolateContent(content: string, data: any): string {
    return content.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      return this.getNestedValue(data, key.trim()) || '';
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((value, key) => {
      return value ? value[key] : undefined;
    }, obj);
  }

  private getTableData(content: any, data: any): any[][] {
    if (Array.isArray(content)) {
      return content;
    }
    if (typeof content === 'string') {
      const tableData = this.getNestedValue(data, content);
      return Array.isArray(tableData) ? tableData : [];
    }
    return [];
  }

  async getReportHistory(): Promise<
    {
      filename: string;
      format: string;
      size: number;
      createdAt: Date;
    }[]
  > {
    try {
      const reportPath = path.join(process.cwd(), 'reports');
      const files = await promisify(fs.readdir)(reportPath);

      const history = await Promise.all(
        files.map(async file => {
          const stats = await promisify(fs.stat)(path.join(reportPath, file));
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
      this.logger.error('获取报表历史失败', error);
      throw error;
    }
  }

  async deleteReport(filename: string): Promise<void> {
    try {
      const reportPath = path.join(process.cwd(), 'reports');
      const filePath = path.join(reportPath, filename);
      await promisify(fs.unlink)(filePath);
      this.logger.info(`删除报表成功: ${filename}`);
    } catch (error) {
      this.logger.error(`删除报表失败: ${filename}`, error);
      throw error;
    }
  }

  async cleanupOldReports(days: number): Promise<void> {
    try {
      const reportPath = path.join(process.cwd(), 'reports');
      const files = await promisify(fs.readdir)(reportPath);
      const now = Date.now();
      const maxAge = days * 24 * 60 * 60 * 1000;

      await Promise.all(
        files.map(async file => {
          const filePath = path.join(reportPath, file);
          const stats = await promisify(fs.stat)(filePath);
          if (now - stats.birthtime.getTime() > maxAge) {
            await promisify(fs.unlink)(filePath);
            this.logger.info(`清理过期报表: ${file}`);
          }
        }),
      );
    } catch (error) {
      this.logger.error('清理过期报表失败', error);
      throw error;
    }
  }
}
