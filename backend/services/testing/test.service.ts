import * as jest from 'jest';
import * as k6 from 'k6';
import { EventEmitter } from 'events';
import { Logger } from '../../utils/logger';
import { TestReport, TestCase, PerformanceMetrics } from './types';

interface ITestConfig {
  /** timeout 的描述 */
  timeout: number;
  /** coverage 的描述 */
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  /** performance 的描述 */
  performance: {
    maxResponseTime: number;
    maxErrorRate: number;
    targetRPS: number;
  };
}

export class TestService extends EventEmitter {
  private logger: Logger;
  private config: ITestConfig;

  constructor(config: ITestConfig) {
    super();
    this.logger = new Logger('TestService');
    this.config = config;
  }

  // 运行单元测试
  async runUnitTests(testFiles: string[]): Promise<TestReport> {
    try {
      const results = await jest.runCLI(
        {
          coverage: true,
          coverageThreshold: this.config.coverage,
          testTimeout: this.config.timeout,
          testFiles,
        },
        [process.cwd()],
      );

      return this.formatTestResults(results);
    } catch (error) {
      this.logger.error('单元测试失败:', error);
      throw error;
    }
  }

  // 运行集成测试
  async runIntegrationTests(testSuite: string): Promise<TestReport> {
    try {
      // 启动测试环境
      await this.setupTestEnvironment();

      const results = await jest.runCLI(
        {
          testRegex: testSuite,
          testEnvironment: 'node',
          setupFiles: ['./test/setup.ts'],
        },
        [process.cwd()],
      );

      return this.formatTestResults(results);
    } finally {
      // 清理测试环境
      await this.cleanupTestEnvironment();
    }
  }

  // 运行性能测试
  async runPerformanceTests(scenarios: any[]): Promise<PerformanceMetrics> {
    try {
      const options = {
        vus: 10,
        duration: '30s',
        thresholds: {
          http_req_duration: [`p(95)<${this.config.performance.maxResponseTime}`],
          http_req_failed: [`rate<${this.config.performance.maxErrorRate}`],
        },
      };

      const results = await k6.run(scenarios, options);
      return this.analyzePerformanceResults(results);
    } catch (error) {
      this.logger.error('性能测试失败:', error);
      throw error;
    }
  }

  // 生成测试报告
  private formatTestResults(results: any): TestReport {
    return {
      success: results.success,
      numPassedTests: results.numPassedTests,
      numFailedTests: results.numFailedTests,
      coverage: results.coverage,
      timestamp: new Date(),
      duration: results.testResults[0].perfStats.runtime,
    };
  }
}
