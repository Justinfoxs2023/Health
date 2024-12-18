export interface CodeAuditor {
  analyzeCode(): Promise<
    Array<{
      type: string;
      file: string;
      message: string;
    }>
  >;
  getErrorSummary(): Promise<{
    total: number;
    details: Array<{
      type: string;
      file: string;
      message: string;
      line?: number;
    }>;
  }>;
}
