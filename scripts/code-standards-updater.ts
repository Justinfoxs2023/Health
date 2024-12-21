import * as glob from 'glob';
import * as path from 'path';
import chalk from 'chalk';
import { Project, Node, SyntaxKind } from 'ts-morph';
import { execSync } from 'child_process';

export class CodeStandardsUpdater {
  private project: Project;
  private readonly rootDir: string;
  private modifiedFiles: Set<string> = new Set();

  constructor() {
    this.rootDir = process.cwd();

    // 扩展项目配置以包含所有 TypeScript 文件
    const tsFiles = glob.sync('**/*.{ts,tsx}', {
      ignore: ['node_modules/**', 'dist/**', 'build/**'],
      cwd: this.rootDir,
    });

    this.project = new Project({
      tsConfigFilePath: path.join(this.rootDir, 'tsconfig.json'),
      compilerOptions: {
        incremental: true,
      },
    });

    // 手动添加找到的所有 TypeScript 文件
    tsFiles.forEach(file => {
      const filePath = path.join(this.rootDir, file);
      if (!this.project.getSourceFile(filePath)) {
        try {
          this.project.addSourceFileAtPath(filePath);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.warn(chalk.yellow(`无法添加文件 ${filePath}: ${err.message}`));
          }
        }
      }
    });
  }

  async updateAll(): Promise<void> {
    console.log(chalk.blue('开始更新代码规范...'));

    try {
      // 1. 更新文件头部注释
      await this.updateFileHeaders();

      // 2. 更新导入语句规范
      await this.standardizeImports();

      // 3. 更新类型定义规范
      await this.standardizeTypeDefinitions();

      // 4. 更新函数规范
      await this.standardizeFunctions();

      // 5. 更新错误处理规范
      await this.standardizeErrorHandling();

      // 6. 更新测试规范
      await this.standardizeTests();

      // 7. 保存更改
      await this.project.save();

      // 8. 运行代码格式化
      this.runCodeFormatting();

      console.log(chalk.green('代码规范更新完成！'));
      this.printSummary();
    } catch (error) {
      console.error('Error in code-standards-updater.ts:', chalk.red('代码规范更新失败:'), error);
      throw error;
    }
  }

  private async updateFileHeaders(): Promise<void> {
    const sourceFiles = this.project.getSourceFiles();
    const headerTemplate = `/**
 * @fileoverview {{description}}
 * @author {{author}}
 * @copyright {{year}} {{organization}}
 * @license {{license}}
 */\n\n`;

    sourceFiles.forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      const existingText = sourceFile.getFullText();

      if (!existingText.includes('@fileoverview')) {
        const description = this.generateFileDescription(filePath);
        const header = headerTemplate
          .replace('{{description}}', description)
          .replace('{{author}}', process.env.GIT_USER_NAME || 'Team')
          .replace('{{year}}', new Date().getFullYear().toString())
          .replace('{{organization}}', '组织名称')
          .replace('{{license}}', 'ISC');

        sourceFile.insertText(0, header);
        this.modifiedFiles.add(filePath);
      }
    });
  }

  private async standardizeImports(): Promise<void> {
    const sourceFiles = this.project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      const imports = sourceFile.getImportDeclarations();

      // 按类型分组导入
      const groupedImports = {
        react: [] as string[],
        thirdParty: [] as string[],
        internal: [] as string[],
        types: [] as string[],
      };

      imports.forEach(imp => {
        const moduleSpecifier = imp.getModuleSpecifierValue();
        const importText = imp.getText();

        if (moduleSpecifier === 'react') {
          groupedImports.react.push(importText);
        } else if (moduleSpecifier.startsWith('@/')) {
          groupedImports.internal.push(importText);
        } else if (moduleSpecifier.startsWith('@types/')) {
          groupedImports.types.push(importText);
        } else {
          groupedImports.thirdParty.push(importText);
        }
      });

      // 删除现有导入
      imports.forEach(imp => imp.remove());

      // 按组重新插入导入
      let insertPos = 0;
      Object.values(groupedImports).forEach((group, index) => {
        if (group.length > 0) {
          const groupText = group.sort().join('\n') + '\n';
          sourceFile.insertText(insertPos, groupText);
          insertPos += groupText.length;

          // 在组之间添加空行
          if (index < Object.values(groupedImports).length - 1) {
            sourceFile.insertText(insertPos, '\n');
            insertPos += 1;
          }
        }
      });

      if (imports.length > 0) {
        this.modifiedFiles.add(sourceFile.getFilePath());
      }
    });
  }

  private async standardizeTypeDefinitions(): Promise<void> {
    const sourceFiles = this.project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      // 规范化接口定义
      sourceFile.getInterfaces().forEach(interfaceDecl => {
        const name = interfaceDecl.getName();
        if (!name.startsWith('I')) {
          interfaceDecl.rename(`I${name}`);
          this.modifiedFiles.add(sourceFile.getFilePath());
        }

        // 确保所有属性都有类型注释
        interfaceDecl.getProperties().forEach(prop => {
          if (!prop.getJsDocs().length) {
            prop.addJsDoc({ description: `${prop.getName()} 的描述` });
            this.modifiedFiles.add(sourceFile.getFilePath());
          }
        });
      });

      // 规范化类型别名
      sourceFile.getTypeAliases().forEach(typeAlias => {
        const name = typeAlias.getName();
        if (!name.endsWith('Type')) {
          typeAlias.rename(`${name}Type`);
          this.modifiedFiles.add(sourceFile.getFilePath());
        }
      });
    });
  }

  private async standardizeFunctions(): Promise<void> {
    const sourceFiles = this.project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      sourceFile.getFunctions().forEach(func => {
        // 确保函数有返回类型
        if (!func.getReturnTypeNode()) {
          const inferredType = func.getReturnType().getText();
          func.setReturnType(inferredType);
          this.modifiedFiles.add(sourceFile.getFilePath());
        }

        // 确保异步函数使用 try-catch
        if (func.isAsync() && !func.getBodyText()?.includes('try')) {
          const bodyText = func.getBodyText();
          if (bodyText) {
            func.setBodyText(`
              try {
                ${bodyText}
              } catch (error) {
                console.error('Error in ${func.getName()}:', error);
                throw error;
              }
            `);
            this.modifiedFiles.add(sourceFile.getFilePath());
          }
        }
      });
    });
  }

  private async standardizeErrorHandling(): Promise<void> {
    const sourceFiles = this.project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      try {
        // 1. 规范化 catch 子句中的错误变量名
        sourceFile.forEachDescendant(node => {
          if (Node.isCatchClause(node)) {
            const errorVar = node.getVariableDeclaration();
            if (errorVar && !errorVar.wasForgotten() && errorVar.getName() === 'e') {
              errorVar.rename('error');
              this.modifiedFiles.add(sourceFile.getFilePath());
            }
          }
        });

        // 2. 确保异步函数有错误处理
        sourceFile.getFunctions().forEach(func => {
          if (!func.wasForgotten() && func.isAsync()) {
            const body = func.getBody();
            if (body && !body.wasForgotten() && !body.getText().includes('try')) {
              const bodyText = body.getText();
              func.setBodyText(`
                try {
                  ${bodyText}
                } catch (error) {
                  console.error('Error in ${path.basename(sourceFile.getFilePath())}:', error);
                  throw error;
                }
              `);
              this.modifiedFiles.add(sourceFile.getFilePath());
            }
          }
        });

        // 3. 添加错误日志记录
        sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).forEach(call => {
          if (!call.wasForgotten()) {
            const text = call.getText();
            if (text.includes('console.error(') && !text.includes('Error in')) {
              const args = call.getArguments();
              if (args.length > 0) {
                const fileName = path.basename(sourceFile.getFilePath());
                const newText = `console.error('Error in ${fileName}:', ${args
                  .map(arg => (!arg.wasForgotten() ? arg.getText() : ''))
                  .filter(Boolean)
                  .join(', ')})`;

                call.replaceWithText(newText);
                this.modifiedFiles.add(sourceFile.getFilePath());
              }
            }
          }
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(chalk.yellow(`处理文件 ${sourceFile.getFilePath()} 时出错: ${errorMessage}`));
      }
    });
  }

  private async standardizeTests(): Promise<void> {
    const testFiles = this.project
      .getSourceFiles()
      .filter(
        file => file.getFilePath().includes('.test.') || file.getFilePath().includes('.spec.'),
      );

    testFiles.forEach(file => {
      try {
        file.getDescendantsOfKind(SyntaxKind.CallExpression).forEach(call => {
          if (!call.wasForgotten()) {
            const text = call.getText();
            if (text.startsWith('describe(') || text.startsWith('it(')) {
              const args = call.getArguments();
              if (args.length > 0 && !args[0].wasForgotten()) {
                const description = args[0].getText();
                if (description.includes('should')) {
                  const newDesc = description.replace(/should\s+/, '');
                  args[0].replaceWithText(newDesc);
                  this.modifiedFiles.add(file.getFilePath());
                }
              }
            }
          }
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(chalk.yellow(`处理测试文件 ${file.getFilePath()} 时出错: ${errorMessage}`));
      }
    });
  }

  private runCodeFormatting(): void {
    console.log(chalk.yellow('运行代码格式化...'));
    try {
      execSync('prettier --write "**/*.{ts,tsx}"', {
        stdio: 'inherit',
        cwd: this.rootDir,
      });

      execSync('eslint --fix "**/*.{ts,tsx}"', {
        stdio: 'inherit',
        cwd: this.rootDir,
      });
    } catch (error) {
      console.warn(chalk.yellow('代码格式化过程中出现警告，请手动检查'));
    }
  }

  private generateFileDescription(filePath: string): string {
    const fileName = path.basename(filePath);
    const fileType = path.extname(filePath).slice(1).toUpperCase();
    return `${fileType} 文件 ${fileName} 的功能描述`;
  }

  private printSummary(): void {
    console.log(chalk.blue('\n代码规范更新摘要:'));
    console.log(chalk.yellow(`修改的文件数量: ${this.modifiedFiles.size}`));
    this.modifiedFiles.forEach(file => {
      console.log(chalk.gray(`- ${path.relative(this.rootDir, file)}`));
    });
  }
}

// 运行更新器
async function main(): Promise<void> {
  try {
    const updater = new CodeStandardsUpdater();
    await updater.updateAll();
  } catch (error) {
    console.error('Error in main:', error);
    throw error;
  }
}

main().catch(console.error);
