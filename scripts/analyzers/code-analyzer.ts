import { Project, SourceFile, Node, SyntaxKind } from 'ts-morph';
import { IssueCollector } from './issue-collector';
import { CodeIssue, IssueType, IssueSeverity } from '../types/code-issues';

export class CodeAnalyzer {
  private project: Project;
  private issueCollector: IssueCollector;

  constructor(tsConfigPath: string) {
    this.project = new Project({
      tsConfigFilePath: tsConfigPath,
      manipulationSettings: { useTrailingCommas: true }
    });
    this.issueCollector = new IssueCollector();
  }

  async analyzeProject(): Promise<CodeIssue[]> {
    const sourceFiles = this.project.getSourceFiles();
    
    for (const sourceFile of sourceFiles) {
      await this.analyzeFile(sourceFile);
    }

    return this.issueCollector.getIssues();
  }

  private async analyzeFile(sourceFile: SourceFile): Promise<void> {
    await Promise.all([
      this.checkUnusedCode(sourceFile),
      this.checkTypeIssues(sourceFile),
      this.checkCodeStyle(sourceFile),
      this.checkPerformance(sourceFile),
      this.checkSecurity(sourceFile)
    ]);
  }

  private async checkUnusedCode(sourceFile: SourceFile): Promise<void> {
    // 检查未使用的导入
    this.checkUnusedImports(sourceFile);
    
    // 检查未使用的变量
    this.checkUnusedVariables(sourceFile);
    
    // 检查未使用的函数
    this.checkUnusedFunctions(sourceFile);
  }

  private checkUnusedImports(sourceFile: SourceFile): void {
    const imports = sourceFile.getImportDeclarations();
    for (const importDecl of imports) {
      this.analyzeImportUsage(importDecl);
    }
  }

  // ... 其他检查方法
} 