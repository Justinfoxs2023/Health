const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config({
  path: path.resolve(process.cwd(), '.env.development'),
  encoding: 'utf8',
  debug: process.env.APP_DEBUG === 'true'
});

// 验证必需的环境变量
const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASS',
  'REDIS_HOST',
  'REDIS_PORT'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}); 