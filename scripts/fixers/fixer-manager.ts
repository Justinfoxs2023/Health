import { Project, SourceFile } from 'ts-morph';
import { CodeIssue } from '../types/code-issues';
import { UnusedCodeFixer } from './unused-code-fixer';
import { TypeFixer } from './type-fixer';
import { StyleFixer } from './style-fixer';

export class FixerManager {
  private fixers: Map<string, BaseFixer>;
  private project: Project;

  constructor(project: Project) {
    this.project = project;
    this.initializeFixers();
  }

  async fixIssues(issues: CodeIssue[]): Promise<void> {
    for (const issue of issues) {
      const fixer = this.fixers.get(issue.type);
      if (fixer) {
        await fixer.fix(issue);
      }
    }
    
    await this.project.save();
  }

  private initializeFixers(): void {
    this.fixers = new Map([
      ['unused-code', new UnusedCodeFixer(this.project)],
      ['type-error', new TypeFixer(this.project)],
      ['style-issue', new StyleFixer(this.project)]
    ]);
  }
} 