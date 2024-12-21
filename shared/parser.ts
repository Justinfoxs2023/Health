import { IFileInfo } from '../types';

export class CodeParser {
  constructor() {
    this.cache = new Map();
  }

  parseFile(content: string): IFileInfo {
    // 检查缓存
    const cacheKey = this.generateCacheKey(content);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 统一的文件解析逻辑
    const result = {
      imports: this.parseImports(content),
      exports: this.parseExports(content),
      dependencies: this.analyzeDependency(content),
    };

    // 存入缓存
    this.cache.set(cacheKey, result);
    return result;
  }

  private parseImports(content: string) {
    // 解析import语句
    const importRegex = /import\s+.*\s+from\s+['"](.+)['"]/g;
    const imports = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    return imports;
  }

  private parseExports(content: string) {
    // 解析export语句
    const exportRegex = /export\s+(?:default\s+)?(?:class|const|function|let|var)\s+(\w+)/g;
    const exports = [];
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    return exports;
  }

  private analyzeDependency(content: string) {
    // 统一的依赖分析逻辑
    const dependencies = new Set();

    // 分析import依赖
    this.parseImports(content).forEach(imp => {
      dependencies.add(imp);
    });

    // 分析require依赖
    const requireRegex = /require\(['"](.+)['"]\)/g;
    let match;
    while ((match = requireRegex.exec(content)) !== null) {
      dependencies.add(match[1]);
    }

    return Array.from(dependencies);
  }

  private generateCacheKey(content: string): string {
    // 简单的内容hash
    return Buffer.from(content).toString('base64');
  }
}
