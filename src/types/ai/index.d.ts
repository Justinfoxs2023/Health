// 代码分析相关类型
export interface CodeAnalysis {
  qualityScore: number;
  securityIssues: SecurityIssue[];
  performanceSuggestions: Suggestion[];
  codeSmells: CodeSmell[];
  coverage: Coverage;
}

export interface SecurityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: CodeLocation;
  description: string;
  suggestion: string;
}

export interface Suggestion {
  type: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
  example?: string;
}

export interface CodeSmell {
  type: string;
  location: CodeLocation;
  description: string;
  refactoringProposal: string;
}

export interface Coverage {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
}

// 测试相关类型
export interface TestCase {
  name: string;
  type: 'unit' | 'integration' | 'e2e';
  inputs: any[];
  expectedOutput: any;
  setup?: string;
  teardown?: string;
}

// 文档相关类型
export interface Documentation {
  api: APIDoc[];
  components: ComponentDoc[];
  guides: Guide[];
  examples: Example[];
} 