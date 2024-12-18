import { BackupManager } from './BackupManager';
import { FailoverManager } from './FailoverManager';
import { Injectable } from '@nestjs/common';
import { RecoveryManager } from './RecoveryManager';

@Injectable()
export class DisasterRecoveryService {
  constructor(
    private readonly backupManager: BackupManager,
    private readonly failoverManager: FailoverManager,
    private readonly recoveryManager: RecoveryManager,
  ) {}

  /** 配置备份策略 */
  async configureBackup(config: any) {
    return this.backupManager.configure(config);
  }

  /** 执行数据备份 */
  async performBackup(target: string, type: 'full' | 'incremental') {
    return this.backupManager.backup(target, type);
  }

  /** 故障转移配置 */
  async configureFailover(config: any) {
    return this.failoverManager.configure(config);
  }

  /** 触发故障转移 */
  async triggerFailover(service: string) {
    return this.failoverManager.trigger(service);
  }

  /** 灾难恢复 */
  async performRecovery(backupId: string, target: string) {
    return this.recoveryManager.recover(backupId, target);
  }

  /** 备份验证 */
  async verifyBackup(backupId: string) {
    return this.backupManager.verify(backupId);
  }

  /** 恢复演练 */
  async performDrillTest(scenario: string) {
    return this.recoveryManager.runDrill(scenario);
  }

  /** 监控备份状态 */
  async monitorBackupStatus() {
    return this.backupManager.getStatus();
  }

  /** 数据一致性检查 */
  async checkConsistency(source: string, target: string) {
    return this.recoveryManager.checkConsistency(source, target);
  }

  /** 自动故障检测 */
  async detectFailures() {
    return this.failoverManager.detectFailures();
  }

  /** RTO/RPO分析 */
  async analyzeRecoveryMetrics() {
    return {
      rto: await this.recoveryManager.calculateRTO(),
      rpo: await this.recoveryManager.calculateRPO(),
    };
  }

  /** 灾备报告生成 */
  async generateReport(timeRange: any) {
    return {
      backups: await this.backupManager.generateReport(timeRange),
      failovers: await this.failoverManager.generateReport(timeRange),
      recoveries: await this.recoveryManager.generateReport(timeRange),
    };
  }
}
