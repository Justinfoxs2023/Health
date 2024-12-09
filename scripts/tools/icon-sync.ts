import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

interface IconSyncConfig {
  sourceDir: string;
  outputDir: string;
  sizes: number[];
}

class IconSyncTool {
  private config: IconSyncConfig;

  constructor(config: IconSyncConfig) {
    this.config = config;
  }

  /**
   * 同步图标资源
   */
  async syncIcons() {
    try {
      // 确保输出目录存在
      if (!fs.existsSync(this.config.outputDir)) {
        fs.mkdirSync(this.config.outputDir, { recursive: true });
      }

      // 读取源目录中的所有图标
      const files = fs.readdirSync(this.config.sourceDir);

      for (const file of files) {
        if (file.endsWith('.svg') || file.endsWith('.png')) {
          await this.processIcon(file);
        }
      }

      console.log('图标同步完成');
    } catch (error) {
      console.error('图标同步失败:', error);
    }
  }

  /**
   * 处理单个图标
   */
  private async processIcon(fileName: string) {
    const sourcePath = path.join(this.config.sourceDir, fileName);
    const baseName = path.basename(fileName, path.extname(fileName));

    // 为每个尺寸生成图标
    for (const size of this.config.sizes) {
      const outputFileName = `${baseName}_${size}.png`;
      const outputPath = path.join(this.config.outputDir, outputFileName);

      await sharp(sourcePath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
    }
  }
}

// 使用示例
const config: IconSyncConfig = {
  sourceDir: 'assets/icons/source',
  outputDir: 'assets/icons/generated',
  sizes: [16, 24, 32, 48]
};

const iconSync = new IconSyncTool(config);
iconSync.syncIcons(); 