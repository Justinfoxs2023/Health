import fs from 'fs-extra';
import path from 'path';
import { Logger } from '../src/utils/logger';
import { execSync } from 'child_process';

const logger = new Logger('DevSetup');

async function setupDevEnvironment(): Promise<void> {
  try {
    logger.info('开始配置开发环境...');

    // 1. 创建必要的目录
    const dirs = ['logs/dev', 'storage', 'storage/uploads', 'storage/temp'];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(process.cwd(), dir));
      logger.info(`创建目录: ${dir}`);
    }

    // 2. 检查并安装依赖
    logger.info('检查并安装依赖...');
    execSync('npm install', { stdio: 'inherit' });

    // 3. 检查必要的服务
    checkRequiredServices();

    // 4. 设置环境变量
    await setupEnvironmentVariables();

    logger.info('开发环境配置完成!');
    logger.info('你现在可以运行 npm run dev 启动开发服务器');
  } catch (error) {
    logger.error('开发环境配置失败', error);
    process.exit(1);
  }
}

function checkRequiredServices(): void {
  logger.info('检查必要的服务...');

  try {
    // 检查 MongoDB
    execSync('mongod --version', { stdio: 'ignore' });
    logger.info('MongoDB 已安装');
  } catch {
    logger.error('请安装 MongoDB');
  }

  try {
    // 检查 Redis
    execSync('redis-cli --version', { stdio: 'ignore' });
    logger.info('Redis 已安装');
  } catch {
    logger.error('请安装 Redis');
  }
}

async function setupEnvironmentVariables(): Promise<void> {
  try {
    const envPath = path.join(process.cwd(), '.env.development');

    if (!(await fs.pathExists(envPath))) {
      logger.info('创建开发环境配置文件...');
      await fs.copy(path.join(process.cwd(), '.env.example'), envPath);
    }

    logger.info('环境变量配置完成');
  } catch (error) {
    console.error('Error in setupEnvironmentVariables:', error);
    throw error;
  }
}

setupDevEnvironment();
