export interface CodeQualityFixer {
  fixTypeErrors(file: string): Promise<void>;
  fixUnusedVars(file: string): Promise<void>;
  getFixSummary(): Promise<{
    total: number;
    details: string[];
  }>;
}
