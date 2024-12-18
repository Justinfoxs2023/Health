import { CodeIssue, IssueSeverity } from '../types/code-issues';
import * as fs from 'fs/promises';
import * as path from 'path';

export class ReportGenerator {
  async generateAnalysisReport(issues: CodeIssue[]): Promise<void> {
    const report = this.createReport(issues, 'analysis');
    await this.saveReport(report, 'analysis');
  }

  async generateFixReport(issues: CodeIssue[]): Promise<void> {
    const report = this.createReport(issues, 'fix');
    await this.saveReport(report, 'fix');
  }

  private createReport(issues: CodeIssue[], type: 'analysis' | 'fix'): object {
    return {
      timestamp: new Date().toISOString(),
      type,
      summary: {
        total: issues.length,
        errors: issues.filter(i => i.severity === IssueSeverity.Error).length,
        warnings: issues.filter(i => i.severity === IssueSeverity.Warning).length,
        info: issues.filter(i => i.severity === IssueSeverity.Info).length,
      },
      issues: issues.map(issue => ({
        ...issue,
        fix: issue.fix ? { description: issue.fix.description } : undefined,
      })),
    };
  }

  private async saveReport(report: object, type: string): Promise<void> {
    const reportsDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(reportsDir, { recursive: true });
    
    const filename = `${type}-report-${Date.now()}.json`;
    await fs.writeFile(
      path.join(reportsDir, filename),
      JSON.stringify(report, null, 2)
    );
  }
} 