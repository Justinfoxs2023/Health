import { Refactorer } from './refactor';
import { refactorConfig } from './refactor-config';

async function main(): Promise<void> {
  try {
    console.log('开始执行代码重构...');

    const refactorer = new Refactorer(refactorConfig);
    const result = await refactorer.execute();

    console.log('\n重构结果:');
    console.log('----------------------------------------');
    console.log(`状态: ${result.success ? '成功' : '失败'}`);
    console.log(`修改的文件数: ${result.modifiedFiles.length}`);

    if (result.modifiedFiles.length > 0) {
      console.log('\n修改的文件:');
      result.modifiedFiles.forEach(file => console.log(`- ${file}`));
    }

    if (result.errors.length > 0) {
      console.log('\n错误:');
      result.errors.forEach(error => console.log(`- ${error}`));
    }

    console.log('----------------------------------------');
  } catch (error) {
    console.error('Error in main:', error);
    throw error;
  }
}

console.error('Error in refactor-main.ts:', error => {
  console.error('Error in refactor-main.ts:', '重构过程发生错误:', error);
  process.exit(1);
});
