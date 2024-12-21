import * as fs from 'fs-extra';
import glob from 'glob';
import path from 'path';
import {
  IRefactorConfig,
  IRefactorResult,
  ServiceType,
  IPathMapping,
} from '../src/core/types/refactor.types';
import { refactorConfig } from './refactor-config';

expor
t class Refactorer {
  private config: IRefactorConfig;
  private result: IRefactorResult;

  constructor(config: IRefactorConfig) {
    this.config = config;
    this.result = {
      success: false,
      modifiedFiles: [],
      errors: [],
    };
  }

  public async execute(): Promise<IRefactorResult> {
    try {
      await this.createDirectoryStructure();
      await this.migrateFiles();
      await this.applyRefactoringRules();
      this.result.success = true;
    } catch (error) {
      if (error instanceof Error) {
        this.result.errors.push(error.message);
      } else {
        this.result.errors.push('Unknown error occurred');
      }
    }
    return this.result;
  }

  private async createDirectoryStructure(): Promise<void> {
    try {
      const { corePath, directories } = this.config;
      for (const dir of directories) {
        const fullPath = path.join(corePath, dir);
        await fs.mkdirp(fullPath);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`创建目录结构失败: ${error.message}`);
      }
      throw new Error('创建目录结构时发生未知错误');
    }
  }

  private async migrateFiles(): Promise<void> {
    try {
      for (const mapping of this.config.pathMappings) {
        for (const pattern of mapping.patterns) {
          const files = glob.sync(path.join(mapping.oldPath, pattern));

          for (const file of files) {
            const relativePath = path.relative(mapping.oldPath, file);
            const newFilePath = path.join(mapping.newPath, relativePath);

            await fs.mkdirp(path.dirname(newFilePath));
            await fs.copyFile(file, newFilePath);

            this.result.modifiedFiles.push(newFilePath);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`迁移文件失败: ${error.message}`);
      }
      throw new Error('迁移文件时发生未知错误');
    }
  }

  private async applyRefactoringRules(): Promise<void> {
    try {
      for (const rule of this.config.rules) {
        const files = rule.patterns.reduce<string[]>((acc, pattern) => {
          return [...acc, ...glob.sync(pattern)];
        }, []);

        for (const file of files) {
          const content = await fs.readFile(file, 'utf-8');

          let newContent = content;
          for (const replacement of rule.replacements) {
            newContent = newContent.replace(replacement.from, replacement.to);
          }

          await fs.outputFile(file, newContent, { encoding: 'utf-8' });
          this.result.modifiedFiles.push(file);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`应用重构规则失败: ${error.message}`);
      }
      throw new Error('应用重构规则时发生未知错误');
    }
  }
}
