import { LocalDatabase } from '../utils/local-database';

interface ModelVersion {
  id: string;
  version: string;
  url: string;
  size: number;
  checksum: string;
  releaseDate: Date;
  changes: string[];
}

export class ModelAutoUpdateService {
  private db: LocalDatabase;
  private updateInterval: number = 24 * 60 * 60 * 1000; // 24小时
  private lastCheck: Date | null = null;

  constructor() {
    this.db = new LocalDatabase('model-updates');
    this.initializeAutoUpdate();
  }

  private async initializeAutoUpdate() {
    // 读取上次检查时间
    this.lastCheck = await this.db.get('last-update-check');
    
    // 设置定期检查
    setInterval(() => this.checkForUpdates(), this.updateInterval);
    
    // 首次检查
    await this.checkForUpdates();
  }

  private async checkForUpdates() {
    try {
      const currentVersions = await this.getCurrentVersions();
      const availableUpdates = await this.getAvailableUpdates(currentVersions);

      if (availableUpdates.length > 0) {
        await this.downloadAndInstallUpdates(availableUpdates);
      }

      this.lastCheck = new Date();
      await this.db.put('last-update-check', this.lastCheck);
    } catch (error) {
      console.error('检查更新失败:', error);
    }
  }

  private async getCurrentVersions(): Promise<Map<string, string>> {
    const versions = new Map<string, string>();
    
    try {
      const storedVersions = await this.db.get('model-versions');
      if (storedVersions) {
        return new Map(storedVersions);
      }
    } catch (error) {
      console.error('获取当前版本信息失败:', error);
    }

    return versions;
  }

  private async getAvailableUpdates(currentVersions: Map<string, string>): Promise<ModelVersion[]> {
    try {
      const response = await fetch('/api/models/versions');
      const availableVersions: ModelVersion[] = await response.json();

      return availableVersions.filter(version => 
        !currentVersions.has(version.id) || 
        currentVersions.get(version.id) !== version.version
      );
    } catch (error) {
      console.error('获取可用更新失败:', error);
      return [];
    }
  }

  private async downloadAndInstallUpdates(updates: ModelVersion[]) {
    for (const update of updates) {
      try {
        // 下载模型
        const modelData = await this.downloadModel(update);
        
        // 验证校验和
        if (await this.verifyChecksum(modelData, update.checksum)) {
          // 安装更新
          await this.installUpdate(update.id, modelData);
          
          // 更新版本信息
          await this.updateVersionInfo(update);
        }
      } catch (error) {
        console.error(`更新模型失败: ${update.id}`, error);
      }
    }
  }

  private async downloadModel(version: ModelVersion): Promise<ArrayBuffer> {
    const response = await fetch(version.url);
    return await response.arrayBuffer();
  }

  private async verifyChecksum(data: ArrayBuffer, expectedChecksum: string): Promise<boolean> {
    const checksum = await this.calculateChecksum(data);
    return checksum === expectedChecksum;
  }

  private async calculateChecksum(data: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async installUpdate(modelId: string, modelData: ArrayBuffer) {
    await this.db.put(`model-${modelId}`, modelData);
  }

  private async updateVersionInfo(version: ModelVersion) {
    const versions = await this.getCurrentVersions();
    versions.set(version.id, version.version);
    await this.db.put('model-versions', Array.from(versions.entries()));
  }
} 