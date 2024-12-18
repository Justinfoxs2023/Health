import * as path from 'path';
import { Project, SyntaxKind, Node } from 'ts-morph';

class TypeErrorFixer {
  private project: Project;

  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    });
  }

  async fix(): Promise<void> {
    // 1. 修复接口定义中的类型错误
    this.fixInterfaceTypes();

    // 2. 修复枚举类型错误
    this.fixEnumTypes();

    // 3. 修复数组类型错误
    this.fixArrayTypes();

    // 4. 修复缺失的属性
    this.fixMissingProperties();

    // 5. 保存修改
    await this.project.save();
  }

  private fixInterfaceTypes(): void {
    const sourceFiles = this.project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      // 修复接口定义
      sourceFile.getInterfaces().forEach(interfaceDecl => {
        interfaceDecl.getProperties().forEach(prop => {
          const type = prop.getType();

          // 修复基础类型
          if (type.isString() || type.isNumber() || type.isBoolean()) {
            prop.setType(type.getText());
          }

          // 修复联合类型
          if (type.isUnion()) {
            const unionTypes = type.getUnionTypes();
            const fixedType = unionTypes.map(t => t.getText()).join(' | ');
            prop.setType(fixedType);
          }
        });
      });
    });
  }

  private fixEnumTypes(): void {
    const sourceFiles = this.project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      sourceFile.getEnums().forEach(enumDecl => {
        // 确保枚举成员有正确的类型
        enumDecl.getMembers().forEach(member => {
          if (!member.getValue()) {
            member.setValue('0');
          }
        });
      });
    });
  }

  private fixArrayTypes(): void {
    const sourceFiles = this.project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      sourceFile.forEachDescendant(node => {
        if (Node.isArrayTypeNode(node)) {
          const elementType = node.getElementType();
          if (elementType.getText() === 'never') {
            node.replaceWithText(`${elementType.getText()}[]`);
          }
        }
      });
    });
  }

  private fixMissingProperties(): void {
    const sourceFiles = this.project.getSourceFiles();

    sourceFiles.forEach(sourceFile => {
      sourceFile.getClasses().forEach(classDecl => {
        // 检查并添加缺失的必需属性
        const baseTypes = classDecl.getBaseTypes();
        baseTypes.forEach(baseType => {
          const properties = baseType.getProperties();
          properties.forEach(prop => {
            if (!classDecl.getProperty(prop.getName())) {
              classDecl.addProperty({
                name: prop.getName(),
                type: prop.getTypeNode()?.getText() || 'any',
              });
            }
          });
        });
      });
    });
  }
}

// 运行修复程序
async function main(): Promise<void> {
  try {
    const fixer = new TypeErrorFixer();
    await fixer.fix();
    console.log('类型错误修复完成');
  } catch (error) {
    console.error('Error in main:', error);
    throw error;
  }
}

main().catch(console.error);
