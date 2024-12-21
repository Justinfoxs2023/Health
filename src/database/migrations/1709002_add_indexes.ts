import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1709002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 用户表索引
    await queryRunner.query(`
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_role ON users(role);
    `);

    // 健康记录表索引
    await queryRunner.query(`
      CREATE INDEX idx_health_records_user_id ON health_records(user_id);
      CREATE INDEX idx_health_records_recorded_at ON health_records(recorded_at);
    `);

    // 社交互动表索引
    await queryRunner.query(`
      CREATE INDEX idx_social_interactions_user_id ON social_interactions(user_id);
      CREATE INDEX idx_social_interactions_type ON social_interactions(type);
      CREATE INDEX idx_social_interactions_created_at ON social_interactions(created_at);
    `);

    // 交易表索引
    await queryRunner.query(`
      CREATE INDEX idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX idx_transactions_type ON transactions(type);
      CREATE INDEX idx_transactions_created_at ON transactions(created_at);
    `);

    // 成就表索引
    await queryRunner.query(`
      CREATE INDEX idx_achievements_user_id ON achievements(user_id);
      CREATE INDEX idx_achievements_type ON achievements(type);
      CREATE INDEX idx_achievements_unlocked_at ON achievements(unlocked_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除索引
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_users_email;
      DROP INDEX IF EXISTS idx_users_role;
      DROP INDEX IF EXISTS idx_health_records_user_id;
      DROP INDEX IF EXISTS idx_health_records_recorded_at;
      DROP INDEX IF EXISTS idx_social_interactions_user_id;
      DROP INDEX IF EXISTS idx_social_interactions_type;
      DROP INDEX IF EXISTS idx_social_interactions_created_at;
      DROP INDEX IF EXISTS idx_transactions_user_id;
      DROP INDEX IF EXISTS idx_transactions_type;
      DROP INDEX IF EXISTS idx_transactions_created_at;
      DROP INDEX IF EXISTS idx_achievements_user_id;
      DROP INDEX IF EXISTS idx_achievements_type;
      DROP INDEX IF EXISTS idx_achievements_unlocked_at;
    `);
  }
}
