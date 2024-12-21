/**
 * @fileoverview TS 文件 eslint.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'eslint' {
  export interface LintResult {
    filePath: string;
    messages: Array<{
      ruleId: string | null;
      severity: number;
      message: string;
      line: number;
      column: number;
    }>;
    errorCount: number;
    warningCount: number;
    fixableErrorCount: number;
    fixableWarningCount: number;
    source: string;
  }

  export interface ESLintOptions {
    fix?: boolean;
    extensions?: string[];
    baseConfig?: any;
    useEslintrc?: boolean;
  }

  export class ESLint {
    constructor(options?: ESLintOptions);
    lintFiles(patterns: string[]): Promise<LintResult[]>;
    loadFormatter(name: string): Promise<{
      format: (results: LintResult[]) => Promise<string>;
    }>;
    static outputFixes(results: LintResult[]): Promise<void>;
  }

  export namespace ESLint {
    export type LintResult = {
      filePath: string;
      messages: Array<{
        ruleId: string | null;
        severity: number;
        message: string;
        line: number;
        column: number;
      }>;
      errorCount: number;
      warningCount: number;
      fixableErrorCount: number;
      fixableWarningCount: number;
      source: string;
    };
  }
}
