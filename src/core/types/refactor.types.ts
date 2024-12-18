/**
 * @fileoverview TS 文件 refactor.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IPathMapping {
  /** oldPath 的描述 */
    oldPath: string;
  /** newPath 的描述 */
    newPath: string;
  /** patterns 的描述 */
    patterns: string;
}

export interface IRefactorRule {
  /** patterns 的描述 */
    patterns: string;
  /** replacements 的描述 */
    replacements: {
    from: string  RegExp;
    to: string;
  }[];
}

export interface IRefactorConfig {
  /** corePath 的描述 */
    corePath: string;
  /** directories 的描述 */
    directories: string;
  /** pathMappings 的描述 */
    pathMappings: IPathMapping;
  /** rules 的描述 */
    rules: IRefactorRule;
}

export interface IRefactorResult {
  /** success 的描述 */
    success: false | true;
  /** modifiedFiles 的描述 */
    modifiedFiles: string;
  /** errors 的描述 */
    errors: string;
}

export enum ServiceType {
  Core = 'core',
  Auth = 'auth',
  User = 'user',
  Health = 'health',
  AI = 'ai',
  Mobile = 'mobile',
  Web = 'web',
}
