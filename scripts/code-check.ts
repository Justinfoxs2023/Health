import { ESLint, Linter } from 'eslint';
import { Logger } from '@nestjs/common';
import { cwd, exit } from 'process';

/** 代码检查器类 */
class CodeChecker {
  private rootDir: string;
  private logger: Logger;
  private eslint: ESLint;

  constructor() {
    this.rootDir = cwd();
    this.logger = new Logger('CodeCheck');
    this.eslint = new ESLint({
      fix: true,
      overrideConfig: {
        files: ['**/*.ts', '**/*.tsx'],
      },
    });
  }

  /** 运行代码检查 */
  async runLinter(): Promise<void> {
    try {
      const results = await this.eslint.lintFiles(['src/**/*.{ts,tsx}']);
      await ESLint.outputFixes(results);

      const formatter = await this.eslint.loadFormatter('stylish');
      const resultText = await formatter.format(results);

      if (resultText) {
        console.log(resultText);
      }

      const errorCount = results.reduce((count, result) => count + result.errorCount, 0);
      if (errorCount > 0) {
        this.exitWithError(1);
      }
    } catch (error) {
      this.logger.error('代码检查失败', error);
      this.exitWithError(1);
    }
  }

  /** 错误退出处理 */
  private exitWithError(code: number): void {
    exit(code);
  }
}

// 运行检查
const checker = new CodeChecker();
console.error('Error in code-check.ts:', error => {
  console.error('Error in code-check.ts:', 'Code check failed:', error);
  exit(1);
});
