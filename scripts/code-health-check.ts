import { CodeAuditor } from './interfaces/code-audit.interface';
import { CodeQualityFixer } from './interfaces/code-quality.interface';
import { CodeStandardsEnforcer } from './interfaces/code-standards.interface';
import { PerformanceMonitor } from './interfaces/performance.interface';
import { CodeAuditImpl } from './code-audit';
import { CodeQualityFixerImpl } from './code-quality-fixer';
import { CodeStandardsEnforcerImpl } from './code-standards';
import { PerformanceMonitorImpl } from './utils/performance-monitoring';

// 定义报告接口
interface CodeError {
  type: string;
  file: string;
  message: string;
  line?: undefined | number;
}

interface HealthReport {
  timestamp: string;
  errors: {
    total: number;
    details: CodeError[];
  };
  fixes: {
    total: number;
    details: string[];
  };
  standards: {
    complianceRate: number;
    violations: string[];
  };
  performance: {
    metrics: Array<{
      name: string;
      value: number;
      threshold: number;
      description: string;
    }>;
    issues: string[];
  };
}

export class CodeHealthCheck {
  constructor(
    private readonly auditor: CodeAuditor,
    private readonly qualityFixer: CodeQualityFixer,
    private readonly standardsEnforcer: CodeStandardsEnforcer,
    private readonly monitor: PerformanceMonitor,
  ) {
    // 验证依赖项
    if (!this.auditor || !this.qualityFixer || !this.standardsEnforcer || !this.monitor) {
      throw new Error('Required dependencies are not initialized');
    }
  }

  async runFullCheck(): Promise<void> {
    try {
      const errors = await this.auditor.analyzeCode();
      console.log(`发现 ${errors.length} 个代码问题:`);
      errors.forEach((error: CodeError) => {
        console.log(
          `-·${error.type}: ${error.message} (文件: ${error.file}${
            error.line ? `, 行号: ${error.line}` : ''
          })`,
        );
      });
      await this.fixQualityIssues();
      const fixes = await this.qualityFixer.getFixSummary();
      await this.standardsEnforcer.enforceStandards();
      const standards = await this.standardsEnforcer.getStandardsSummary();
      await this.monitor.analyzeMetrics();
      const rawMetrics = await this.monitor.collectMetrics();
      const metrics = rawMetrics.map(metric => ({
        ...metric,
        description: this.getMetricDescription(metric.name),
      }));
      const performance = {
        metrics,
        issues: (await this.monitor.getMetricsSummary()).issues,
      };

      await this.generateReport({
        timestamp: new Date().toISOString(),
        errors: {
          total: errors.length,
          details: errors,
        },
        fixes,
        standards,
        performance,
      });
    } catch (error) {
      console.error('健康检查失败:', error);
      throw error;
    }
  }

  private getMetricDescription(metricName: string): string {
    const descriptions: Record<string, string> = {
      cpu: 'CPU 使用率',
      memory: '内存使用情况',
      disk: '磁盘使用情况',
      network: '网络性能',
      response: '响应时间',
      error_rate: '错误率',
      throughput: '吞吐量',
    };
    return descriptions[metricName] || `${metricName} 指标`;
  }

  private async fixQualityIssues(): Promise<void> {
    const errors = await this.auditor.analyzeCode();
    for (const error of errors) {
      await this.qualityFixer.fixTypeErrors(error.file);
      await this.qualityFixer.fixUnusedVars(error.file);
    }
  }

  private async generateReport(report: HealthReport): Promise<void> {
    const { writeFile } = await import('fs/promises');
    const reportContent = JSON.stringify(report, null, 2);
    await writeFile('health-check-report.json', reportContent);
  }
}

const healthCheck = new CodeHealthCheck(
  new CodeAuditImpl(),
  new CodeQualityFixerImpl(),
  new CodeStandardsEnforcerImpl(),
  new PerformanceMonitorImpl(),
);

healthCheck.runFullCheck().catch((error: unknown) => {
  console.error('健康检查失败:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
