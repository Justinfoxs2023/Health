/**
 * @fileoverview TS 文件 DataSyncService.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

@Injectable()
export class DataSyncService {
  constructor(
    private readonly conflictResolver: ConflictResolver,
    private readonly versionControl: VersionControl,
    private readonly syncStorage: SyncStorage,
  ) {}

  async sync(deviceId: string, changes: Change[]): Promise<SyncResult> {
    // 获取最后同步版本
    const lastSync = await this.versionControl.getLastSync(deviceId);

    // 检查冲突
    const conflicts = await this.detectConflicts(changes, lastSync);

    if (conflicts.length > 0) {
      // 解决冲突
      const resolved = await this.conflictResolver.resolve(conflicts);
      await this.applyResolutions(resolved);
    }

    // 应用变更
    await this.applyChanges(changes);

    // 更新版本
    await this.versionControl.updateVersion(deviceId);

    return {
      success: true,
      syncedAt: new Date(),
      changes: changes.length,
    };
  }

  private async detectConflicts(changes: Change[], lastSync: number): Promise<Conflict[]> {
    const conflicts = [];

    for (const change of changes) {
      const serverVersion = await this.versionControl.getVersion(change.id);

      if (serverVersion > lastSync) {
        conflicts.push({
          id: change.id,
          clientChange: change,
          serverVersion,
        });
      }
    }

    return conflicts;
  }
}
