import { Injectable } from '@nestjs/common';
import { TestCoverage } from './TestCoverage';
import { TestReporter } from './TestReporter';
import { TestRunner } from './TestRunner';

@Injectable()
export class AutomatedTestService {
  constructor(
    private readonly testRunner: TestRunner,
    private readonly testReporter: TestReporter,
    private readonly testCoverage: TestCoverage,
  ) {}

  /** 运行单元测试 */
  async runUnitTests(testPath: string) {
    const results = await this.testRunner.runTests({
      type: 'unit',
      path: testPath,
      config: {
        timeout: 5000,
        parallel: true,
      },
    });

    await this.testReporter.generateReport(results);
    return results;
  }

  /** 运行集成测试 */
  async runIntegrationTests(testPath: string) {
    const results = await this.testRunner.runTests({
      type: 'integration',
      path: testPath,
      config: {
        timeout: 10000,
        parallel: false,
      },
    });

    await this.testReporter.generateReport(results);
    return results;
  }

  /** 运行端到端测试 */
  async runE2ETests(testPath: string) {
    const results = await this.testRunner.runTests({
      type: 'e2e',
      path: testPath,
      config: {
        timeout: 30000,
        parallel: false,
        browser: true,
      },
    });

    await this.testReporter.generateReport(results);
    return results;
  }

  /** 生成测试覆盖率报告 */
  async generateCoverageReport() {
    const coverage = await this.testCoverage.collect();
    return this.testCoverage.generateReport(coverage);
  }

  /** 自动生成测试用例 */
  async generateTestCases(sourcePath: string) {
    return this.testRunner.generateTests(sourcePath);
  }

  /** 持续测试监控 */
  async watchTests(testPath: string) {
    return this.testRunner.watchMode(testPath);
  }

  /** 性能测试 */
  async runPerformanceTests(testPath: string) {
    const results = await this.testRunner.runTests({
      type: 'performance',
      path: testPath,
      config: {
        duration: '1m',
        vus: 10,
        rampUp: '30s',
      },
    });

    await this.testReporter.generateReport(results);
    return results;
  }
}
