export interface CodeStandardsEnforcer {
  formatCode(): Promise<void>;
  fixWhitespace(): Promise<void>;
  fixIndentation(): Promise<void>;
  enforceStandards(): Promise<void>;
  getStandardsSummary(): Promise<{
    complianceRate: number;
    violations: string[];
  }>;
}
