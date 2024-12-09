const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

class DocSynchronizer {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.watcher = null;
  }

  // 启动文档监听
  startWatch() {
    const watchPaths = [
      path.join(this.rootDir, 'backend/**/src/**/*.js'),
      path.join(this.rootDir, 'frontend/**/src/**/*.{js,tsx}'),
      path.join(this.rootDir, 'ai-services/**/src/**/*.{py,yml}'),
    ];

    this.watcher = chokidar.watch(watchPaths, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    this.watcher
      .on('add', path => this.handleFileChange('add', path))
      .on('change', path => this.handleFileChange('change', path))
      .on('unlink', path => this.handleFileChange('delete', path));
  }

  // 处理文件变更
  async handleFileChange(event, filePath) {
    const relativePath = path.relative(this.rootDir, filePath);
    const docDir = path.join(this.rootDir, 'docs');
    const docPath = path.join(docDir, relativePath + '.md');

    switch (event) {
      case 'add':
      case 'change':
        await this.updateDocumentation(filePath, docPath);
        break;
      case 'delete':
        await this.removeDocumentation(docPath);
        break;
    }
  }

  // 更新文档
  async updateDocumentation(sourcePath, docPath) {
    // 确保目录存在
    await fs.promises.mkdir(path.dirname(docPath), { recursive: true });
    
    // 生成文档内容
    const content = await this.generateDocContent(sourcePath);
    await fs.promises.writeFile(docPath, content);
  }

  // 移除文档
  async removeDocumentation(docPath) {
    if (fs.existsSync(docPath)) {
      await fs.promises.unlink(docPath);
    }
  }
} 