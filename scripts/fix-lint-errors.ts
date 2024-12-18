import { Project, SourceFile } from 'ts-morph';
import chalk from 'chalk';
import * as path from 'path';

class LintErrorFixer {
  private project: Project;
  private fixedFiles: Set<string> = new Set();
  private errorCount = 0;

  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      manipulationSettings: {
        useTrailingCommas: true,
      },
    });
  }

  async fixAll(): Promise<void> {
    console.log(chalk.blue('开始修复 lint 错误...'));

    try {
      await this.loadSourceFiles();
      await this.analyzeAndFixErrors();
      await this.project.save();
      await this.runEslintFix();

      this.printSummary();
    } catch (error) {
      console.error(chalk.red('修复过程中出现错误:'), error);
      throw error;
    }
  }

  private async loadSourceFiles(): Promise<void> {
    const tsFiles = this.project.getSourceFiles();
    if (tsFiles.length === 0) {
      console.log(chalk.yellow('正在添加源文件...'));
      this.project.addSourceFilesAtPaths(['src/**/*.ts', 'scripts/**/*.ts']);
    }
  }

  private async analyzeAndFixErrors(): Promise<void> {
    const sourceFiles = this.project.getSourceFiles();
    for (const sourceFile of sourceFiles) {
      try {
        let hasChanges = false;
        hasChanges = await this.fixTrailingSpaces(sourceFile) || hasChanges;
        hasChanges = await this.fixNewlines(sourceFile) || hasChanges;

        if (hasChanges) {
          this.fixedFiles.add(sourceFile.getFilePath());
        }
      } catch (err) {
        console.error(chalk.red(`处理文件 ${sourceFile.getFilePath()} 时出错:`), err);
      }
    }
  }

  private async fixTrailingSpaces(sourceFile: SourceFile): Promise<boolean> {
    let hasChanges = false;
    const fileText = sourceFile.getFullText();
    const lines = fileText.split('\n');
    const fixedLines = lines.map(line => line.trimEnd());
    const newText = fixedLines.join('\n');
    if (newText !== fileText) {
      sourceFile.replaceWithText(newText);
      hasChanges = true;
      this.errorCount++;
    }
    return hasChanges;
  }

  private async fixNewlines(sourceFile: SourceFile): Promise<boolean> {
    let hasChanges = false;
    const fileText = sourceFile.getFullText();
    if (!fileText.endsWith('\n')) {
      sourceFile.replaceWithText(fileText + '\n');
      hasChanges = true;
      this.errorCount++;
    }
    return hasChanges;
  }

  private async runEslintFix(): Promise<void> {
    const { execSync } = await import('child_process');
    try {
      execSync('npx eslint . --ext .ts --fix', { stdio: 'inherit' });
    } catch (err) {
      console.warn(chalk.yellow('ESLint 修复过程中出现警告，请检查输出'));
    }
  }

  private printSummary(): void {
    console.log(chalk.blue('\n修复摘要:'));
    console.log(chalk.yellow(`修改的文件数量: ${this.fixedFiles.size}`));
    console.log(chalk.yellow(`修复的错误数量: ${this.errorCount}`));
    this.fixedFiles.forEach(file => {
      console.log(chalk.gray(`- ${path.relative(process.cwd(), file)}`));
    });
  }
}

async function main(): Promise<void> {
  const fixer = new LintErrorFixer();
  await fixer.fixAll();
}

main().catch(error => {
  const errMsg = error instanceof Error ? error.message : String(error);
  console.error(chalk.red('程序执行失败:'), errMsg);
  process.exit(1);
}); 