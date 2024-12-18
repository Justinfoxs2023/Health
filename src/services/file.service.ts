export class FileService {
  async writeFile(path: string, content: string): Promise<void> {
    if (typeof window === 'undefined') {
      // 服务器端
      const fs = require('fs').promises;
      await fs.writeFile(path, content);
    } else {
      // 客户端
      // 使用替代方案，如 localStorage 或 IndexedDB
      localStorage.setItem(path, content);
    }
  }
} 