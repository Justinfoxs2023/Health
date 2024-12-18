import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1709001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 用户表
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR NOT NULL UNIQUE,
        email VARCHAR NOT NULL UNIQUE,
        role VARCHAR NOT NULL,
        profile JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // 健康记录表
    await queryRunner.query(`
      CREATE TABLE health_records (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id),
        vital_signs JSONB NOT NULL,
        exercise_data JSONB NOT NULL,
        dietary_data JSONB NOT NULL,
        sleep_data JSONB NOT NULL,
        recorded_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 社交互动表
    await queryRunner.query(`
      CREATE TABLE social_interactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id),
        type VARCHAR NOT NULL,
        content JSONB NOT NULL,
        engagement JSONB NOT NULL DEFAULT '{"likes": 0, "comments": 0, "shares": 0, "views": 0}',
        visibility JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 交易表
    await queryRunner.query(`
      CREATE TABLE transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id),
        type VARCHAR NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        items JSONB NOT NULL,
        payment JSONB NOT NULL,
        shipping JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 成就表
    await queryRunner.query(`
      CREATE TABLE achievements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id),
        type VARCHAR NOT NULL,
        progress JSONB NOT NULL,
        rewards JSONB NOT NULL,
        conditions JSONB NOT NULL,
        unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS achievements;`);
    await queryRunner.query(`DROP TABLE IF EXISTS transactions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS social_interactions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS health_records;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
