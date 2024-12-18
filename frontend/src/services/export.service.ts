import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export class ExportService {
  // 导出Excel格式的健康报告
  async exportToExcel(healthData: any) {
    const workbook = XLSX.utils.book_new();

    // 基础信息表
    const basicInfo = XLSX.utils.json_to_sheet([
      {
        年龄: healthData.age,
        身高: healthData.height,
        体重: healthData.weight,
        BMI: healthData.bmi,
      },
    ]);
    XLSX.utils.book_append_sheet(workbook, basicInfo, '基础信息');

    // 健康指标表
    const healthMetrics = XLSX.utils.json_to_sheet(healthData.metrics);
    XLSX.utils.book_append_sheet(workbook, healthMetrics, '健康指标');

    // 生成并下载文件
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, `健康报告_${new Date().toLocaleDateString()}.xlsx`);
  }

  // 导出PDF格式的健康报告
  async exportToPDF(reportId: string) {
    const response = await fetch(`/api/health/report/${reportId}/pdf`);
    const blob = await response.blob();
    saveAs(blob, `健康报告_${new Date().toLocaleDateString()}.pdf`);
  }
}
