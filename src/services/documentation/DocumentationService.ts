import { APIDocGenerator } from './APIDocGenerator';
import { DocumentVersionControl } from './DocumentVersionControl';
import { Injectable } from '@nestjs/common';
import { MarkdownParser } from './MarkdownParser';

@Injectable()
export class DocumentationService {
  constructor(
    private readonly markdownParser: MarkdownParser,
    private readonly apiDocGenerator: APIDocGenerator,
    private readonly versionControl: DocumentVersionControl,
  ) {}

  /** 生成API文档 */
  async generateAPIDoc(sourcePath: string) {
    const apiSpec = await this.apiDocGenerator.analyze(sourcePath);
    return this.apiDocGenerator.generate(apiSpec);
  }

  /** 更新开发文档 */
  async updateDevelopmentDoc(content: string, path: string) {
    const parsed = await this.markdownParser.parse(content);
    await this.versionControl.saveVersion(path, parsed);
    return parsed;
  }

  /** 生成用户指南 */
  async generateUserGuide(config: any) {
    const content = await this.markdownParser.generateFromTemplate('user-guide', config);
    return this.markdownParser.convertToHTML(content);
  }

  /** 搜索文档 */
  async searchDocs(keyword: string) {
    return this.markdownParser.search(keyword);
  }

  /** 导出文档 */
  async exportDocs(format: 'pdf' | 'html' | 'markdown') {
    const content = await this.versionControl.getLatestContent();
    return this.markdownParser.export(content, format);
  }

  /** 文档版本管理 */
  async manageVersions(path: string) {
    return {
      versions: await this.versionControl.listVersions(path),
      latest: await this.versionControl.getLatestVersion(path),
    };
  }

  /** 自动生成代码注释文档 */
  async generateCodeDocs(sourcePath: string) {
    const codeAnalysis = await this.apiDocGenerator.analyzeCode(sourcePath);
    return this.markdownParser.generateCodeDocs(codeAnalysis);
  }

  /** 生成架构文档 */
  async generateArchitectureDocs() {
    const architecture = await this.apiDocGenerator.analyzeArchitecture();
    return this.markdownParser.generateArchitectureDocs(architecture);
  }

  /** 实时预览文档 */
  async previewDoc(content: string) {
    return this.markdownParser.renderPreview(content);
  }

  /** 文档协作编辑 */
  async enableCollaboration(docId: string) {
    return this.versionControl.initializeCollaboration(docId);
  }
}
