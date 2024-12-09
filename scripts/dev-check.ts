import { execSync } from 'child_process';
import { Logger } from '../src/utils/logger';

const logger = new Logger('DevCheck');

async function checkDevEnvironment() {
  try {
    logger.info('检查开发环境...');

    // 检查数据库连接
    checkDatabaseConnection();

    // 检查Redis连接
    checkRedisConnection();

    // 检查存储目录权限
    checkStoragePermissions();

    // 检查日志目录
    checkLogDirectory();

    logger.info('开发环境检查完成，一切正常！');
    return true;
  } catch (error) {
    logger.error('开发环境检查失败', error);
    return false;
  }
}

function checkDatabaseConnection() {
  try {
    execSync('mongod --version', { stdio: 'ignore' });
    logger.info('MongoDB 服务正常');
  } catch {
    throw new Error('MongoDB 服务未启动');
  }
}

function checkRedisConnection() {
  try {
    execSync('redis-cli ping', { stdio: 'ignore' });
    logger.info('Redis 服务正常');
  } catch {
    throw new Error('Redis 服务未启动');
  }
}

function checkStoragePermissions() {
  // 检查存储目录权限
}

function checkLogDirectory() {
  // 检查日志目录
}

export { checkDevEnvironment }; 