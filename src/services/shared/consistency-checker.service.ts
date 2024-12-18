import { DataHashService } from './data-hash.service';
import { Logger } from '../../utils/logger';
import { PlatformStateService } from './platform-state.service';

export class ConsistencyCheckerService {
  private logger: Logger;
  private platformState: PlatformStateService;
  private dataHash: DataHashService;

  constructor() {
    this.logger = new Logger('ConsistencyChecker');
    this.platformState = new PlatformStateService();
    this.dataHash = new DataHashService();
  }

  // 检查数据一致性
  async checkConsistency(platforms: string[]): Promise<ConsistencyReport> {
    try {
      // 1. 收集状态快照
      const snapshots = await this.collectSnapshots(platforms);

      // 2. 生成数据哈希
      const hashes = await this.generateHashes(snapshots);

      // 3. 比较差异
      const differences = this.compareDifferences(hashes);

      // 4. 生成报告
      return this.generateReport(differences);
    } catch (error) {
      this.logger.error('一致性检查失败', error);
      throw error;
    }
  }

  // 修复不一致
  async repairInconsistency(source: string, target: string, data: any): Promise<void> {
    try {
      // 1. 验证源数据
      await this.validateSourceData(source, data);

      // 2. 准备修复
      const repairPlan = await this.prepareRepair(source, target, data);

      // 3. 执行修复
      await this.executeRepair(repairPlan);

      // 4. 验证修复
      await this.verifyRepair(source, target);
    } catch (error) {
      this.logger.error('不一致修复失败', error);
      throw error;
    }
  }

  // 监控一致性
  startConsistencyMonitor(platforms: string[], interval: number): () => void {
    const timer = setInterval(async () => {
      try {
        const report = await this.checkConsistency(platforms);
        if (report.hasDifferences) {
          this.logger.warn('检测到数据不一致', report);
          // 触发修复流程
          await this.handleInconsistency(report);
        }
      } catch (error) {
        this.logger.error('一致性监控失败', error);
      }
    }, interval);

    return () => clearInterval(timer);
  }

  // 生成一致性报告
  private generateReport(differences: any[]): ConsistencyReport {
    return {
      timestamp: new Date(),
      hasDifferences: differences.length > 0,
      differences,
      recommendations: this.generateRecommendations(differences),
      summary: this.generateSummary(differences),
    };
  }
}
