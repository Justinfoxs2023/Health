import { Project, SyntaxKind, TypeFormatFlags, Node } from 'ts-morph';
import * as path from 'path';
import chalk from 'chalk';

class TypeDefinitionFixer {
  private project: Project;
  private fixedFiles: Set<string> = new Set();

  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    });
  }

  async fixAll(): Promise<void> {
    console.log(chalk.blue('开始修复类型定义文件...'));

    try {
      // 加载所有类型定义文件
      this.project.addSourceFilesAtPaths([
        'src/types/**/*.ts',
        'src/types/**/*.d.ts'
      ]);
      
      const sourceFiles = this.project.getSourceFiles();
      for (const file of sourceFiles) {
        console.log(chalk.cyan(`处理文件: ${file.getFilePath()}`));
        
        // 1. 修复枚举类型语法
        this.fixEnums(file);

        // 2. 修复接口属性语法
        this.fixInterfaces(file);

        // 3. 修复联合类型语法
        this.fixUnionTypes(file);

        // 4. 修复数组类型语法
        this.fixArrayTypes(file);

        // 5. 修复类型别名
        this.fixTypeAliases(file);

        // 6. 修复函数类型
        this.fixFunctionTypes(file);

        // 7. 修复注释
        this.fixComments(file);

        // 8. 修复分号和逗号
        this.fixPunctuation(file);

        // 9. 修复文件结构
        this.fixFileStructure(file);

        if (this.hasChanges(file)) {
          this.fixedFiles.add(file.getFilePath());
        }
      }

      await this.project.save();
      this.printSummary();

    } catch (error) {
      console.error(chalk.red('修复过程中出现错误:'), error);
      throw error;
    }
  }

  private fixEnums(file: Node): void {
    file.getDescendantsOfKind(SyntaxKind.EnumDeclaration).forEach(enumDecl => {
      enumDecl.getMembers().forEach(member => {
        if (!member.hasInitializer()) {
          member.setInitializer(`'${member.getName()}'`);
        }
      });
    });
  }

  private fixInterfaces(file: Node): void {
    file.getDescendantsOfKind(SyntaxKind.InterfaceDeclaration).forEach(interfaceDecl => {
      interfaceDecl.getMembers().forEach(member => {
        if (Node.isPropertySignature(member)) {
          const type = member.getTypeNode();
          if (type) {
            try {
              // 处理复杂对象类型
              if (type.getKind() === SyntaxKind.TypeLiteral) {
                // 保持原始格式，只处理内部结构
                const originalText = type.getText();
                if (originalText.includes('\n')) {
                  // 多行对象类型保持原样
                  member.setType(originalText);
                } else {
                  // 单行对象类型进行格式化
                  const formattedText = originalText.replace(/\s+/g, ' ');
                  member.setType(formattedText);
                }
              }
              // 其他类型保持不变
              else {
                member.setType(type.getText());
              }
            } catch (error) {
              console.warn(`处理类型时出错: ${error.message}`);
              // 保持原始类型不变
            }
          }
        }
      });
    });
  }

  private fixUnionTypes(file: Node): void {
    file.getDescendantsOfKind(SyntaxKind.UnionType).forEach(unionType => {
      const types = unionType.getTypeNodes();
      const formattedType = types.map(t => t.getText()).join(' | ');
      unionType.replaceWithText(formattedType);
    });
  }

  private fixArrayTypes(file: Node): void {
    file.getDescendantsOfKind(SyntaxKind.ArrayType).forEach(arrayType => {
      const elementType = arrayType.getElementTypeNode();
      if (elementType) {
        arrayType.replaceWithText(`${elementType.getText()}[]`);
      }
    });
  }

  private fixTypeAliases(file: Node): void {
    file.getDescendantsOfKind(SyntaxKind.TypeAliasDeclaration).forEach(typeAlias => {
      const type = typeAlias.getType();
      typeAlias.setType(type.getText(undefined, TypeFormatFlags.None));
    });
  }

  private fixFunctionTypes(file: Node): void {
    file.getDescendantsOfKind(SyntaxKind.FunctionType).forEach(funcType => {
      const params = funcType.getParameters();
      const returnType = funcType.getReturnTypeNode();
      const formattedParams = params.map(p => `${p.getName()}: ${p.getTypeNode()?.getText()}`).join(', ');
      funcType.replaceWithText(`(${formattedParams}) => ${returnType?.getText()}`);
    });
  }

  private fixComments(file: Node): void {
    file.getDescendantsOfKind(SyntaxKind.JSDoc).forEach(jsDoc => {
      const text = jsDoc.getText();
      if (text.includes('/**') && !text.includes('*/')) {
        jsDoc.replaceWithText(`${text} */`);
      }
    });
  }

  private fixPunctuation(file: Node): void {
    file.forEachDescendant(node => {
      if (Node.isPropertySignature(node)) {
        const text = node.getText();
        if (!text.includes(';') && !text.includes(',')) {
          node.replaceWithText(`${text};`);
        }
      }
    });
  }

  private fixFileStructure(file: Node): void {
    const text = file.getFullText();
    if (!text.endsWith('\n')) {
      file.replaceWithText(`${text}\n`);
    }
  }

  private hasChanges(file: Node): boolean {
    const currentText = file.getFullText();
    const originalText = file.compilerNode.getFullText();
    return currentText !== originalText;
  }

  private printSummary(): void {
    console.log(chalk.green('\n类型定义修复完成'));
    console.log(chalk.yellow(`修改的文件数量: ${this.fixedFiles.size}`));
    this.fixedFiles.forEach(file => {
      console.log(chalk.gray(`- ${path.relative(process.cwd(), file)}`));
    });
  }
}

async function main(): Promise<void> {
  const fixer = new TypeDefinitionFixer();
  await fixer.fixAll();
}

main().catch(error => {
  console.error(chalk.red('程序执行失败:'), error);
  process.exit(1);
}); 