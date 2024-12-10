import { ESLint } from 'eslint';
import * as prettier from 'prettier';
import * as fs from 'fs-extra';
import * as path from 'path';

export class CodeStandards {
  private static readonly eslint = new ESLint({
    fix: true,
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  });

  static async lint(files: string[]) {
    const results = await this.eslint.lintFiles(files);
    await ESLint.outputFixes(results);
    return results;
  }

  static async format(filePath: string) {
    const content = await fs.readFile(filePath, 'utf8');
    const options = await prettier.resolveConfig(filePath);
    
    const formatted = await prettier.format(content, {
      ...options,
      filepath: filePath
    });

    await fs.writeFile(filePath, formatted);
  }

  static async validateImports(filePath: string) {
    const content = await fs.readFile(filePath, 'utf8');
    const importRegex = /import\s+(?:{[\s\w,]+}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    const imports = [...content.matchAll(importRegex)];

    for (const match of imports) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        const absolutePath = path.resolve(path.dirname(filePath), importPath);
        if (!await fs.pathExists(absolutePath)) {
          throw new Error(`Invalid import path: ${importPath} in ${filePath}`);
        }
      }
    }
  }
} 