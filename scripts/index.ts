import { CodeHealthManager } from './code-health-manager';

async function main(): Promise<void> {
  const manager = new CodeHealthManager('tsconfig.json');
  await manager.run();
}

main().catch(error => {
  console.error('程序执行失败:', error);
  process.exit(1);
}); 