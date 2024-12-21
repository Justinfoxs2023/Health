import { EnhancedVoiceRecognitionService } from './voice-recognition-enhanced.service';
import { ILocalDatabase } from '../utils/local-database';

interface IDialectModel {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** region 的描述 */
  region: string;
  /** modelUrl 的描述 */
  modelUrl: string;
  /** vocabulary 的描述 */
  vocabulary: string[];
  /** patterns 的描述 */
  patterns: Array<{
    standard: string;
    dialect: string[];
  }>;
}

export class DialectRecognitionService extends EnhancedVoiceRecognitionService {
  private db: ILocalDatabase;
  private activeDialects: Set<string> = new Set();
  private dialectModels: Map<string, IDialectModel> = new Map();
  private userDialectPatterns: Map<string, string[]> = new Map();

  constructor() {
    super();
    this.db = new LocalDatabase('dialect-recognition');
    this.initializeDialectSupport();
  }

  // 初始化方言支持
  private async initializeDialectSupport() {
    await this.loadDialectModels();
    await this.loadUserPatterns();
  }

  // 加载方言模型
  private async loadDialectModels() {
    try {
      // 从本地加载
      const storedModels = await this.db.get('dialect-models');
      if (storedModels) {
        this.dialectModels = new Map(storedModels);
      }

      // 从服务器同步
      const response = await fetch('/api/dialects/models');
      const models = await response.json();

      // 更新模型
      for (const model of models) {
        this.dialectModels.set(model.id, model);
      }

      // 保存到本地
      await this.db.put('dialect-models', Array.from(this.dialectModels.entries()));
    } catch (error) {
      console.error('Error in dialect-recognition.service.ts:', '加载方言模型失败:', error);
    }
  }

  // 启用方言识别
  async enableDialect(dialectId: string) {
    const model = this.dialectModels.get(dialectId);
    if (!model) {
      throw new Error(`未找到方言模型: ${dialectId}`);
    }

    this.activeDialects.add(dialectId);
    await this.loadDialectModel(model);
  }

  // 加载方言模型
  private async loadDialectModel(model: IDialectModel) {
    try {
      const modelResponse = await fetch(model.modelUrl);
      const modelData = await modelResponse.arrayBuffer();

      // 保存到本地
      await this.db.put(`dialect-model-${model.id}`, modelData);

      // 加载词汇和模式
      await this.loadDialectVocabulary(model);
    } catch (error) {
      console.error(
        'Error in dialect-recognition.service.ts:',
        `加载方言模型失败: ${model.id}`,
        error,
      );
    }
  }

  // 加载方言词汇
  private async loadDialectVocabulary(model: IDialectModel) {
    try {
      // 加载标准词汇对应的方言表达
      for (const pattern of model.patterns) {
        this.userDialectPatterns.set(pattern.standard, pattern.dialect);
      }
    } catch (error) {
      console.error(
        'Error in dialect-recognition.service.ts:',
        `加载方言词汇失败: ${model.id}`,
        error,
      );
    }
  }

  // 方言转换
  private async convertDialectToStandard(text: string): Promise<string> {
    let standardText = text;

    for (const [standard, dialects] of this.userDialectPatterns.entries()) {
      for (const dialect of dialects) {
        const regex = new RegExp(dialect, 'gi');
        standardText = standardText.replace(regex, standard);
      }
    }

    return standardText;
  }

  // 重写语音识别方法
  async startRecording(): Promise<any> {
    const result = await super.startRecording();

    // 如果启用了方言识别，进行转换
    if (this.activeDialects.size > 0) {
      const standardText = await this.convertDialectToStandard(result.text);
      return {
        ...result,
        text: standardText,
        originalDialect: result.text,
      };
    }

    return result;
  }

  // 学习新的方言表达
  async learnDialectPattern(standard: string, dialect: string) {
    const patterns = this.userDialectPatterns.get(standard) || [];
    if (!patterns.includes(dialect)) {
      patterns.push(dialect);
      this.userDialectPatterns.set(standard, patterns);

      // 保存到本地
      await this.db.put('user-dialect-patterns', Array.from(this.userDialectPatterns.entries()));
    }
  }

  // 加载用户自定义的方言模式
  private async loadUserPatterns() {
    try {
      const patterns = await this.db.get('user-dialect-patterns');
      if (patterns) {
        this.userDialectPatterns = new Map(patterns);
      }
    } catch (error) {
      console.error('Error in dialect-recognition.service.ts:', '加载用户方言模式失败:', error);
    }
  }
}
