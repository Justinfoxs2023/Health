import { Project } from 'ts-morph';
import { CodeIssue } from '../types/code-issues';

export abstract class BaseFixer {
  constructor(protected project: Project) {}
  
  abstract fix(issue: CodeIssue): Promise<void>;
  
  protected async saveChanges(): Promise<void> {
    await this.project.save();
  }
} 