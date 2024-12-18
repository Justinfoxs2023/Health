export type IssueType = 
  | 'unused-code'
  | 'type-error'
  | 'style-issue'
  | 'performance-issue'
  | 'security-issue';

export type IssueSubType =
  | 'unused-import'
  | 'unused-variable'
  | 'unused-function'
  | 'missing-type'
  | 'implicit-any'
  | 'style-format'
  | 'semicolon-missing';

export enum IssueSeverity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

export interface CodeIssue {
  type: IssueType;
  subType: IssueSubType;
  severity: IssueSeverity;
  filePath: string;
  line: number;
  column: number;
  message: string;
  code: string;
  fix?: {
    description: string;
    action: () => Promise<void>;
  };
} 