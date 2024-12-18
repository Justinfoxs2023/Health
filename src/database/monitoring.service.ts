import { AlertService } from '../alert/alert.service';
import { Connection } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { monitoringConfig } from '../config/monitoring.config';

@Injectable()
export class DatabaseMonitoringService {
  private readonly logger = new Logger(DatabaseMonitoringService.name);

  constructor(private connection: Connection, private alertService: AlertService) {}

  @Cron() // 每5分钟执行一次
  async checkDatabaseHealth() {
    try {
      // 检查连接状态
      if (!this.connection.isConnected) {
        this.logger.error('数据库连接已断开');
        return;
      }

      // 检查连接池状态
      const poolStats = await this.getConnectionPoolStats();
      this.logger.log(`连接池状态: ${JSON.stringify(poolStats)}`);

      // 检查慢查询
      await this.checkSlowQueries();

      // 检查表大小
      await this.checkTableSizes();
    } catch (error) {
      this.logger.error('数据库健康检查失败', error);
    }
  }

  private async getConnectionPoolStats() {
    const pool = (this.connection.driver as any).pool;
    return {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    };
  }

  private async checkSlowQueries() {
    const slowQueries = await this.connection.query(`
      SELECT * FROM pg_stat_activity 
      WHERE state = 'active'
      AND now() - query_start > interval '${monitoringConfig.slowQueryThreshold} milliseconds'
    `);

    if (slowQueries.length > 0) {
      this.logger.warn(`发现${slowQueries.length}个慢查询`);
      // 发送告警
      await this.alertService.sendAlert('slow_query', slowQueries);
    }
  }

  private async checkTableSizes() {
    const tableSizes = await this.connection.query(`
      SELECT relname as table_name,
        pg_size_pretty(pg_total_relation_size(relid)) as total_size,
        pg_size_pretty(pg_relation_size(relid)) as table_size,
        pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as index_size
      FROM pg_catalog.pg_statio_user_tables
      ORDER BY pg_total_relation_size(relid) DESC
    `);

    for (const table of tableSizes) {
      if (parseInt(table.total_size) > monitoringConfig.tableSizeWarning) {
        this.logger.warn(`表${table.table_name}大小超过警告阈值`);
        await this.alertService.sendAlert('table_size', table);
      }
    }
  }
}
