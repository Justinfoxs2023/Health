import { CodeIssue, IssueType, IssueSeverity } from '../types/code-issues';

export class IssueCollector {
  private issues: CodeIssue[] = [];

  addIssue(issue: CodeIssue): void {
    this.issues.push(issue);
  }

  getIssues(): CodeIssue[] {
    return this.issues;
  }

  getIssuesByType(type: IssueType): CodeIssue[] {
    return this.issues.filter(issue => issue.type === type);
  }

  getIssuesBySeverity(severity: IssueSeverity): CodeIssue[] {
    return this.issues.filter(issue => issue.severity === severity);
  }
} 