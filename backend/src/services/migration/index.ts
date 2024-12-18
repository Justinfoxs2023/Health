import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { logger } from '../logger';
import { transactionService } from '../transaction';

interface IMigration {
  /** version 的描述 */
  version: string;
  /** description 的描述 */
  description: string;
  /** up 的描述 */
  up: (session: mongoose.ClientSession) => Promise<void>;
  /** down 的描述 */
  down: (session: mongoose.ClientSession) => Promise<void>;
}

class MigrationService {
  private readonly migrationsDir: string;
  private readonly migrationCollection = 'migrations';

  constructor() {
    this.migrationsDir = path.join(process.cwd(), 'migrations');
    if (!fs.existsSync(this.migrationsDir)) {
      fs.mkdirSync(this.migrationsDir, { recursive: true });
    }
  }

  /**
   * 获取已执行的迁移列表
   */
  private async getAppliedMigrations(): Promise<string[]> {
    const db = mongoose.connection.db;
    const migrations = await db
      .collection(this.migrationCollection)
      .find({})
      .sort({ version: 1 })
      .toArray();

    return migrations.map(m => m.version);
  }

  /**
   * 获取所有迁移文件
   */
  private async getAllMigrations(): Promise<IMigration[]> {
    const files = await fs.promises.readdir(this.migrationsDir);
    const migrations: IMigration[] = [];

    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.ts')) {
        const migration = require(path.join(this.migrationsDir, file));
        migrations.push(migration);
      }
    }

    return migrations.sort((a, b) => parseInt(a.version) - parseInt(b.version));
  }

  /**
   * 执行迁移
   */
  async migrate(targetVersion?: string): Promise<void> {
    const appliedMigrations = await this.getAppliedMigrations();
    const allMigrations = await this.getAllMigrations();

    const pendingMigrations = allMigrations.filter(
      migration =>
        !appliedMigrations.includes(migration.version) &&
        (!targetVersion || migration.version <= targetVersion),
    );

    if (pendingMigrations.length === 0) {
      logger.info('没有待执行的迁移');
      return;
    }

    for (const migration of pendingMigrations) {
      await this.executeMigration(migration);
    }
  }

  /**
   * 回滚迁移
   */
  async rollback(steps = 1): Promise<void> {
    const appliedMigrations = await this.getAppliedMigrations();
    const allMigrations = await this.getAllMigrations();

    const migrationsToRollback = allMigrations
      .filter(migration => appliedMigrations.includes(migration.version))
      .slice(-steps);

    if (migrationsToRollback.length === 0) {
      logger.info('没有可回滚的迁移');
      return;
    }

    for (const migration of migrationsToRollback.reverse()) {
      await this.rollbackMigration(migration);
    }
  }

  /**
   * 执行单个迁移
   */
  private async executeMigration(migration: IMigration): Promise<void> {
    logger.info(`开始执行迁移 ${migration.version}: ${migration.description}`);

    try {
      await transactionService.executeTransactionWithRetry(async session => {
        await migration.up(session);
        await this.recordMigration(migration, session);
      });

      logger.info(`迁移 ${migration.version} 执行成功`);
    } catch (error) {
      logger.error(`迁移 ${migration.version} 执行失败:`, error);
      throw error;
    }
  }

  /**
   * 回滚单个迁移
   */
  private async rollbackMigration(migration: IMigration): Promise<void> {
    logger.info(`开始回滚迁移 ${migration.version}: ${migration.description}`);

    try {
      await transactionService.executeTransactionWithRetry(async session => {
        await migration.down(session);
        await this.removeMigrationRecord(migration, session);
      });

      logger.info(`迁移 ${migration.version} 回滚成功`);
    } catch (error) {
      logger.error(`迁移 ${migration.version} 回滚失败:`, error);
      throw error;
    }
  }

  /**
   * 记录迁移执行
   */
  private async recordMigration(
    migration: IMigration,
    session: mongoose.ClientSession,
  ): Promise<void> {
    const db = mongoose.connection.db;
    await db.collection(this.migrationCollection).insertOne(
      {
        version: migration.version,
        description: migration.description,
        executed_at: new Date(),
      },
      { session },
    );
  }

  /**
   * 删除迁移记录
   */
  private async removeMigrationRecord(
    migration: IMigration,
    session: mongoose.ClientSession,
  ): Promise<void> {
    const db = mongoose.connection.db;
    await db.collection(this.migrationCollection).deleteOne(
      {
        version: migration.version,
      },
      { session },
    );
  }

  /**
   * 创建新的迁移文件
   */
  async createMigration(description: string): Promise<string> {
    const version = new Date().getTime().toString();
    const filename = `${version}_${description.toLowerCase().replace(/\s+/g, '_')}.ts`;
    const filePath = path.join(this.migrationsDir, filename);

    const template = `
import mongoose from 'mongoose';

export const version = '${version}';
export const description = '${description}';

export async function up(session: mongoose.ClientSession): Promise<void> {
  // 在这里���现迁移逻辑
}

export async function down(session: mongoose.ClientSession): Promise<void> {
  // 在这里实现回滚逻辑
}
`;

    await fs.promises.writeFile(filePath, template);
    logger.info(`创建迁移文件: ${filename}`);
    return filePath;
  }

  /**
   * 获取迁移状态
   */
  async getMigrationStatus(): Promise<{
    total: number;
    applied: number;
    pending: number;
    lastMigration?: {
      version: string;
      description: string;
      executed_at: Date;
    };
  }> {
    const appliedMigrations = await this.getAppliedMigrations();
    const allMigrations = await this.getAllMigrations();

    const db = mongoose.connection.db;
    const lastMigration = await db
      .collection(this.migrationCollection)
      .findOne({}, { sort: { executed_at: -1 } });

    return {
      total: allMigrations.length,
      applied: appliedMigrations.length,
      pending: allMigrations.length - appliedMigrations.length,
      lastMigration: lastMigration
        ? {
            version: lastMigration.version,
            description: lastMigration.description,
            executed_at: lastMigration.executed_at,
          }
        : undefined,
    };
  }

  /**
   * 验证迁移文件
   */
  async validateMigrations(): Promise<boolean> {
    try {
      const allMigrations = await this.getAllMigrations();

      // 检查版本号唯一性
      const versions = allMigrations.map(m => m.version);
      const uniqueVersions = new Set(versions);
      if (versions.length !== uniqueVersions.size) {
        throw new Error('存在重复的迁移版本号');
      }

      // 检查必要的函数
      for (const migration of allMigrations) {
        if (typeof migration.up !== 'function') {
          throw new Error(`迁移 ${migration.version} 缺少 up 函数`);
        }
        if (typeof migration.down !== 'function') {
          throw new Error(`迁移 ${migration.version} 缺少 down 函数`);
        }
      }

      return true;
    } catch (error) {
      logger.error('迁移验证失败:', error);
      return false;
    }
  }
}

export const migrationService = new MigrationService();
