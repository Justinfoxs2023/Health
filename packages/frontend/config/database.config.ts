import mongoose from 'mongoose';
import { Logger } from '../utils/logger';

const logger = new Logger('Database');

export async function connectDatabase(): Promise<void> {
  try {
    const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

    const uri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

    await mongoose.connect(uri, {
      authSource: 'admin',
      retryWrites: true,
      w: 'majority',
    });

    logger.info('数据库连接成功');
  } catch (error) {
    logger.error('数据库连接失败', error);
    process.exit(1);
  }
}
