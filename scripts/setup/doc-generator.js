const fs = require('fs');
const path = require('path');

class DocumentationGenerator {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.docMap = new Map();
  }

  // 扫描项目结构
  async scanProject() {
    const scanDir = async (dir, relativePath = '') => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const docPath = path.join(relativePath, entry.name);
        
        if (entry.isDirectory()) {
          // 检查是否存在文档
          const docFile = path.join(fullPath, 'README.md');
          if (fs.existsSync(docFile)) {
            this.docMap.set(docPath, docFile);
          }
          await scanDir(fullPath, docPath);
        } else if (entry.name.endsWith('.md')) {
          this.docMap.set(docPath, fullPath);
        }
      }
    };
    
    await scanDir(this.rootDir);
  }

  // 生成文档索引
  generateIndex() {
    let index = '# 项目文档索引\n\n';
    
    for (const [path, file] of this.docMap) {
      index += `- [${path}](${file})\n`;
    }
    
    return index;
  }

  // 更新文档结构
  async updateDocStructure() {
    const docsDir = path.join(this.rootDir, 'docs');
    
    // 确保文档目录存在
    if (!fs.existsSync(docsDir)) {
      await fs.promises.mkdir(docsDir, { recursive: true });
    }
    
    // 写入索引文件
    const indexPath = path.join(docsDir, 'INDEX.md');
    await fs.promises.writeFile(indexPath, this.generateIndex());
  }
} 