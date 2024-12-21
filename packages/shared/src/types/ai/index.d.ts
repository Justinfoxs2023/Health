/**
 * @fileoverview TS 文件 index.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 代码分析相关类型
export interface ICodeAnalysis {
  /** qualityScore 的描述 */
  qualityScore: number;
  /** securityIssues 的描述 */
  securityIssues: ISecurityIssue[];
  /** performanceSuggestions 的描述 */
  performanceSuggestions: ISuggestion[];
  /** codeSmells 的描述 */
  codeSmells: ICodeSmell[];
  /** coverage 的描述 */
  coverage: ICoverage;
}

export interface ISecurityIssue {
  /** type 的描述 */
  type: string;
  /** severity 的描述 */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** location 的描述 */
  location: CodeLocation;
  /** description 的描述 */
  description: string;
  /** suggestion 的描述 */
  suggestion: string;
}

export interface ISuggestion {
  /** type 的描述 */
  type: string;
  /** impact 的描述 */
  impact: 'low' | 'medium' | 'high';
  /** description 的描述 */
  description: string;
  /** example 的描述 */
  example?: string;
}

export interface ICodeSmell {
  /** type 的描述 */
  type: string;
  /** location 的描述 */
  location: CodeLocation;
  /** description 的描述 */
  description: string;
  /** refactoringProposal 的描述 */
  refactoringProposal: string;
}

export interface ICoverage {
  /** lines 的描述 */
  lines: number;
  /** functions 的描述 */
  functions: number;
  /** branches 的描述 */
  branches: number;
  /** statements 的描述 */
  statements: number;
}

// 测试相关类型
export interface ITestCase {
  /** name 的描述 */
  name: string;
  /** type 的描述 */
  type: 'unit' | 'integration' | 'e2e';
  /** inputs 的描述 */
  inputs: any[];
  /** expectedOutput 的描述 */
  expectedOutput: any;
  /** setup 的描述 */
  setup?: string;
  /** teardown 的描述 */
  teardown?: string;
}

// 文档相关类型
export interface IDocumentation {
  /** api 的描述 */
  api: APIDoc[];
  /** components 的描述 */
  components: ComponentDoc[];
  /** guides 的描述 */
  guides: Guide[];
  /** examples 的描述 */
  examples: Example[];
}
