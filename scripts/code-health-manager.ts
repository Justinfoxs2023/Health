import { CodeAnalyzer } from './analyzers/code-analyzer';
import { FixerManager } from './fixers/fixer-manager';
import { ReportGenerator } from './reporters/report-generator';
import { Project } from 'ts-morph';
import chalk from 'chalk';

export class CodeHealthManager {
  private analyzer: CodeAnalyzer;
  private fixerManager: FixerManager;
  private reportGenerator: ReportGenerator;

  constructor(tsConfigPath: string) {
    const project = new Project({ tsConfigFilePath });
    this.analyzer = new CodeAnalyzer(tsConfigPath);
    this.fixerManager = new FixerManager(project);
    this.reportGenerator = new ReportGenerator();
  }

  async run(): Promise<void> {
    try {
      // 1. 分析代码
      console.log(chalk.blue('开始代码分析...'));
      const issues = await this.analyzer.analyzeProject();

      // 2. 生成分析报告
      console.log(chalk.blue('生成分析报告...'));
      await this.reportGenerator.generateAnalysisReport(issues);

      // 3. 修复问题
      console.log(chalk.blue('开始修复问题...'));
      await this.fixerManager.fixIssues(issues);

      // 4. 生成修复报告
      console.log(chalk.blue('生成修复报告...'));
      await this.reportGenerator.generateFixReport(issues);

    } catch (error) {
      console.error(chalk.red('执行过程中出现错误:'), error);
      throw error;
    }
  }
} 