/**
 * @fileoverview TS 文件 index.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IFileInfo {
  /** imports 的描述 */
  imports: string[];
  /** exports 的描述 */
  exports: string[];
  /** dependencies 的描述 */
  dependencies: string[];
}

export interface IProjectFile extends IFileInfo {
  /** path 的描述 */
  path: string;
}

export interface IProjectAnalysis {
  /** files 的描述 */
  files: IProjectFile[];
  /** dependencies 的描述 */
  dependencies: Map<string, string[]>;
  /** timestamp 的描述 */
  timestamp: number;
}
