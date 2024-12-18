import { CodeGenerator } from './CodeGenerator';
import { Debugger } from 'debug';
import { Injectable } from '@nestjs/common';
import { PerformanceAnalyzer } from './PerformanceAnalyzer';

@Injectable()
export class DevelopmentToolService {
  constructor(
    private readonly debuggerService: Debugger,
    private readonly codeGenerator: CodeGenerator,
    private readonly performanceAnalyzer: PerformanceAnalyzer,
  ) {}

  /** 生成代码模板 */
  async generateCode(template: string, config: any): Promise<string> {
    try {
      return await this.codeGenerator.generate(template, config);
    } catch (error) {
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  /** 生成CRUD操作 */
  async generateCRUD(entity: string, options: any): Promise<void> {
    await this.codeGenerator.generateCRUD(entity, options);
  }

  /** 调试支持 */
  async debug(processId: string): Promise<void> {
    await this.debuggerService.attach(processId);
  }

  /** 设置断点 */
  async setBreakpoint(file: string, line: number): Promise<void> {
    await this.debuggerService.setBreakpoint(file, line);
  }

  /** 性能分析 */
  async analyzePerformance(target: string): Promise<any> {
    return this.performanceAnalyzer.analyze(target);
  }

  /** 内存分析 */
  async analyzeMemory(processId: string) {
    return this.performanceAnalyzer.analyzeMemory(processId);
  }

  /** 代码重构建议 */
  async getRefactoringTips(sourcePath: string) {
    return this.codeGenerator.analyzeForRefactoring(sourcePath);
  }

  /** 代码质量检查 */
  async checkCodeQuality(sourcePath: string) {
    return this.performanceAnalyzer.checkQuality(sourcePath);
  }

  /** 依赖分析 */
  async analyzeDependencies(projectPath: string) {
    return this.performanceAnalyzer.analyzeDependencies(projectPath);
  }

  /** 开发环境配置 */
  async setupDevEnvironment(config: any) {
    return this.codeGenerator.setupEnvironment(config);
  }

  /** 热重载支持 */
  async enableHotReload(target: string) {
    return this.debuggerService.setupHotReload(target);
  }

  /** 开发工具插件管理 */
  async managePlugins(action: 'install' | 'remove' | 'update', pluginName: string) {
    return this.codeGenerator.managePlugins(action, pluginName);
  }
}
