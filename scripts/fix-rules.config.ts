/**
 * @fileoverview TS 文件 fix-rules.config.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const fixRules = {
  imports: {
    preferAbsolute: true,
    allowedRelativePaths: ['./types', './utils'],
    bannedImports: ['lodash/*', 'moment'],
  },

  types: {
    requireExplicitReturnType: true,
    noImplicitAny: true,
    strictNullChecks: true,
  },

  style: {
    maxLineLength: 100,
    indentSize: 2,
    quoteStyle: 'single',
  },

  performance: {
    maxComplexity: 10,
    maxFileSize: 400, // lines
    maxFunctionSize: 20, // lines
  },
};
