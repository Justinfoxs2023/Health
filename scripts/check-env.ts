import * as chalk from 'chalk';
import { ConfigService } from '../src/services/config.service';

async function checkEnvironmentConfig(): Promise<void> {
  console.log(chalk.blue('开始检查环境配置...'));

  try {
    const configService = new ConfigService();
    const environment = configService.getEnvironment();

    console.log(chalk.yellow(`当前环境: ${environment}`));

    // 检查基础配置
    console.log(chalk.cyan('\n检查基础配置:'));
    const basicChecks = ['APP_NAME', 'APP_ENV', 'APP_PORT', 'SERVICE_NAME', 'SERVICE_VERSION'];
    checkConfigGroup(configService, basicChecks);

    // 检查数据库配置
    console.log(chalk.cyan('\n检查数据库配置:'));
    const dbConfig = configService.getDatabaseConfig();
    checkObjectValues(dbConfig, ['type', 'host', 'port', 'database']);

    // 检查Redis配置
    console.log(chalk.cyan('\n检查Redis配置:'));
    const redisConfig = configService.getRedisConfig();
    if (redisConfig.cluster) {
      checkObjectValues(redisConfig, ['nodes', 'password']);
    } else {
      const redisChecks = ['REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD'];
      checkConfigGroup(configService, redisChecks);
    }

    // 检查安全配置
    console.log(chalk.cyan('\n检查安全配置:'));
    const securityConfig = configService.getSecurityConfig();
    checkObjectValues(securityConfig, ['securityKey', 'encryptionKey']);

    // 检查JWT配置
    console.log(chalk.cyan('\n检查JWT配置:'));
    const jwtConfig = configService.getJwtConfig();
    checkObjectValues(jwtConfig, ['secret', 'expiresIn']);

    // 检查存储配置
    console.log(chalk.cyan('\n检查存储配置:'));
    const storageConfig = configService.getStorageConfig();
    if (storageConfig.driver === 's3') {
      checkObjectValues(storageConfig.aws, ['region', 'accessKeyId', 'secretAccessKey', 'bucket']);
    }

    // 检查监控配置
    console.log(chalk.cyan('\n检查监控配置:'));
    const monitoringConfig = configService.getMonitoringConfig();
    if (monitoringConfig.enabled) {
      checkObjectValues(monitoringConfig, ['sampleRate', 'metrics']);
    }

    // 检查AI服务配置
    console.log(chalk.cyan('\n检查AI服务配置:'));
    const aiConfig = configService.getAiServiceConfig();
    checkObjectValues(aiConfig, ['serviceUrl', 'serviceKey']);

    // 环境��定检查
    if (configService.isProduction()) {
      console.log(chalk.cyan('\n生产环境特定检查:'));
      const productionChecks = [
        'SENTRY_DSN',
        'AWS_CLOUDWATCH_GROUP',
        'DDOS_PROTECTION_ENABLED',
        'BACKUP_ENABLED',
        'CDN_ENABLED',
      ];
      checkConfigGroup(configService, productionChecks);
    }

    console.log(chalk.green('\n✓ 环境配置检查完成'));
  } catch (error) {
    console.error('Error in check-env.ts:', chalk.red('\n✗ 环境配置检查失败:'), error.message);
    process.exit(1);
  }
}

function checkConfigGroup(configService: ConfigService, keys: string[]): void {
  keys.forEach(key => {
    const value = configService.get(key);
    if (value) {
      console.log(chalk.green(`✓ ${key}`));
    } else {
      console.log(chalk.yellow(`⚠ ${key} 未配置`));
    }
  });
}

function checkObjectValues(obj: any, requiredKeys: string[]): void {
  requiredKeys.forEach(key => {
    if (obj[key]) {
      console.log(chalk.green(`✓ ${key}`));
    } else {
      console.log(chalk.yellow(`⚠ ${key} 未配置`));
    }
  });
}

// 检查环境变量值的有效性
function validateEnvironmentValues(configService: ConfigService): void {
  const validations = [
    {
      key: 'APP_PORT',
      validate: (value: number) => value > 0 && value < 65536,
      message: 'APP_PORT ���须是有效的端口号 (1-65535)',
    },
    {
      key: 'DB_PORT',
      validate: (value: number) => value > 0 && value < 65536,
      message: 'DB_PORT 必须是有效的端口号 (1-65535)',
    },
    {
      key: 'REDIS_PORT',
      validate: (value: number) => value > 0 && value < 65536,
      message: 'REDIS_PORT 必须是有效的端口号 (1-65535)',
    },
    {
      key: 'API_RATE_LIMIT',
      validate: (value: number) => value > 0,
      message: 'API_RATE_LIMIT 必须大于0',
    },
    {
      key: 'FILE_MAX_SIZE',
      validate: (value: number) => value > 0,
      message: 'FILE_MAX_SIZE 必须大于0',
    },
  ];

  validations.forEach(({ key, validate, message }) => {
    const value = configService.getNumber(key);
    if (value && !validate(value)) {
      throw new Error(`配置错误: ${message}`);
    }
  });
}

// 检查URL格式
function validateUrls(configService: ConfigService): void {
  const urlConfigs = ['APP_URL', 'AI_SERVICE_URL', 'AWS_S3_ENDPOINT', 'CDN_URL'];

  urlConfigs.forEach(key => {
    const url = configService.get(key);
    if (url) {
      try {
        new URL(url);
      } catch {
        throw new Error(`配置错误: ${key} 不是有效的URL格式`);
      }
    }
  });
}

// 检查敏感配置的加密
function checkSensitiveConfigs(configService: ConfigService): void {
  const sensitiveKeys = [
    'DB_PASS',
    'REDIS_PASSWORD',
    'JWT_SECRET',
    'AWS_SECRET_ACCESS_KEY',
    'DEEPSEEK_API_KEY',
  ];

  sensitiveKeys.forEach(key => {
    const value = configService.get(key);
    if (value && value.length < 16) {
      console.log(chalk.yellow(`⚠ 警告: ${key} 可能不够安全`));
    }
  });
}

// 主函数
async function main(): Promise<void> {
  try {
    await checkEnvironmentConfig();

    const configService = new ConfigService();
    validateEnvironmentValues(configService);
    validateUrls(configService);
    checkSensitiveConfigs(configService);

    console.log(chalk.green('\n✓ 所有检查通过'));
  } catch (error) {
    console.error('Error in check-env.ts:', chalk.red('\n✗ 检查失败:'), error.message);
    process.exit(1);
  }
}

// 运行检查
if (require.main === module) {
  main();
}
