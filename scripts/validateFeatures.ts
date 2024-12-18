import * as fs from 'fs/promises';
import * as path from 'path';
import { CodeValidationService } from '../services/system/CodeValidationService';
import { FeatureValidationService } from '../services/system/FeatureValidationService';

import { Logger } from '@/utils/Logger';

class FeatureValidationScript {
  private logger: Logger;
  private codeValidation: CodeValidationService;
  private featureValidation: FeatureValidationService;

  constructor() {
    this.logger = new Logger('FeatureValidation');
    this.codeValidation = new CodeValidationService();
    this.featureValidation = new FeatureValidationService();
  }

  /**
   * 执行功能验证
   */
  async validate(): Promise<void> {
    try {
      // 1. 读取开发文档
      const docs = await this.readDevelopmentDocs();

      // 2. 执行代码验证
      const codeReport = await this.codeValidation.validateCodebase();

      // 3. 执行功能验证
      const featureReports = await this.validateAllFeatures();

      // 4. 生成验证报告
      const report = this.generateReport(docs, codeReport, featureReports);

      // 5. 保存报告
      await this.saveReport(report);

      // 6. 输出结果
      this.displayResults(report);
    } catch (error) {
      this.logger.error('功能验证失败', error);
      throw error;
    }
  }

  /**
   * 验证所有功能
   */
  private async validateAllFeatures() {
    return {
      health: await this.featureValidation.validateHealthFeatures(),
      ai: await this.featureValidation.validateAIFeatures(),
      community: await this.featureValidation.validateCommunityFeatures(),
    };
  }

  /**
   * 生成验证报告
   */
  private generateReport(docs: any, codeReport: any, featureReports: any) {
    const report = {
      timestamp: new Date(),
      summary: {
        totalFeatures: 0,
        implementedFeatures: 0,
        partialFeatures: 0,
        missingFeatures: 0,
      },
      codebase: {
        modulesChecked: codeReport.modulesChecked,
        missingModules: codeReport.missingModules,
        suggestions: codeReport.suggestions,
      },
      features: {
        health: this.summarizeFeatureReport(featureReports.health),
        ai: this.summarizeFeatureReport(featureReports.ai),
        community: this.summarizeFeatureReport(featureReports.community),
      },
      recommendations: this.generateRecommendations(codeReport, featureReports),
    };

    // 计算总数
    for (const category of Object.values(report.features)) {
      report.summary.totalFeatures += category.total;
      report.summary.implementedFeatures += category.implemented;
      report.summary.partialFeatures += category.partial;
      report.summary.missingFeatures += category.missing;
    }

    return report;
  }

  /**
   * 总结功能报告
   */
  private summarizeFeatureReport(report: any) {
    return {
      total:
        report.validatedFeatures.length +
        report.missingFeatures.length +
        report.partialFeatures.length,
      implemented: report.validatedFeatures.length,
      partial: report.partialFeatures.length,
      missing: report.missingFeatures.length,
      details: {
        implemented: report.validatedFeatures,
        partial: report.partialFeatures,
        missing: report.missingFeatures,
      },
    };
  }

  /**
   * 生成建议
   */
  private generateRecommendations(codeReport: any, featureReports: any) {
    const recommendations = [];

    // 添加代码相关建议
    recommendations.push(...codeReport.suggestions);

    // 添加功能相关建议
    for (const [category, report] of Object.entries(featureReports)) {
      for (const feature of report.missingFeatures) {
        recommendations.push(`实现缺失功能: ${category}/${feature}`);
      }
      for (const partial of report.partialFeatures) {
        recommendations.push(
          `完善部分实现功能: ${category}/${
            partial.feature
          } (缺失方法: ${partial.missingMethods.join(', ')})`,
        );
      }
    }

    return recommendations;
  }

  /**
   * 保存报告
   */
  private async saveReport(report: any): Promise<void> {
    const reportDir = path.join(process.cwd(), 'reports');
    const filename = `validation-report-${new Date().toISOString()}.json`;

    try {
      await fs.mkdir(reportDir, { recursive: true });
      await fs.writeFile(path.join(reportDir, filename), JSON.stringify(report, null, 2));
    } catch (error) {
      this.logger.error('保存报告失败', error);
      throw error;
    }
  }

  /**
   * 显示结果
   */
  private displayResults(report: any): void {
    console.log('\n=== 功能验证报告 ===\n');

    // 显示摘要
    console.log('功能完成情况:');
    console.log(`总功能数: ${report.summary.totalFeatures}`);
    console.log(`已实现: ${report.summary.implementedFeatures}`);
    console.log(`部分实现: ${report.summary.partialFeatures}`);
    console.log(`未实现: ${report.summary.missingFeatures}`);

    // 显示各模块详情
    console.log('\n模块详情:');
    for (const [category, details] of Object.entries(report.features)) {
      console.log(`\n${category}模块:`);
      console.log(`- 已实现: ${details.implemented}`);
      console.log(`- 部分实现: ${details.partial}`);
      console.log(`- 未实现: ${details.missing}`);
    }

    // 显示建议
    console.log('\n改进建议:');
    report.recommendations.forEach((recommendation: string, index: number) => {
      console.log(`${index + 1}. ${recommendation}`);
    });

    console.log(
      '\n报告已保存至:',
      path.join('reports', `validation-report-${report.timestamp}.json`),
    );
  }

  /**
   * 读取开发文档
   */
  private async readDevelopmentDocs() {
    try {
      const docPath = path.join(process.cwd(), '健康管理软件开发文档.md');
      return await fs.readFile(docPath, 'utf-8');
    } catch (error) {
      this.logger.error('读取开发文档失败', error);
      throw error;
    }
  }
}

// 执行验证
async function runValidation(): Promise<void> {
  const validator = new FeatureValidationScript();
  try {
    await validator.validate();
  } catch (error) {
    console.error('Error in validateFeatures.ts:', '验证失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runValidation();
}
