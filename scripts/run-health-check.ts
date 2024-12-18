import { CodeHealthManager } from './code-health-manager';
import chalk from 'chalk';

async function runHealthCheck(): Promise<void> {
  console.log(chalk.blue('开始执行代码健康检查...'));
  
  try {
    const manager = new CodeHealthManager('tsconfig.json');
    await manager.run();
    
    console.log(chalk.green('代码健康检查完成!'));
  } catch (error) {
    console.error(chalk.red('代码健康检查失败:'), error);
    process.exit(1);
  }
}

runHealthCheck(); 