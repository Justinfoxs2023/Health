import { VoiceRecognitionService, VoiceRecognitionResult } from './voice-recognition.service';
import { LocalDatabase } from '../utils/local-database';

export class EnhancedVoiceRecognitionService extends VoiceRecognitionService {
  private db: LocalDatabase;
  private noiseReductionEnabled: boolean = true;
  private customVocabulary: Set<string> = new Set();

  constructor() {
    super();
    this.db = new LocalDatabase('voice-recognition');
    this.initializeCustomVocabulary();
  }

  // 噪音抑制
  private async applyNoiseReduction(audioData: AudioBuffer): Promise<AudioBuffer> {
    const context = new AudioContext();
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.7;

    source.buffer = audioData;
    source.connect(filter);
    filter.connect(context.destination);

    return audioData; // 返回处理后的音频
  }

  // 自定义词汇表
  private async initializeCustomVocabulary(): Promise<void> {
    try {
      // 从本地数据库加载自定义词汇
      const vocabulary = await this.db.get('custom-vocabulary');
      if (vocabulary) {
        this.customVocabulary = new Set(vocabulary);
      }

      // 从服务器同步最新的食物词汇
      const response = await fetch('/api/food/vocabulary');
      const foodVocabulary = await response.json();
      foodVocabulary.forEach((word: string) => this.customVocabulary.add(word));

      // 保存更新后的词汇表
      await this.db.put('custom-vocabulary', Array.from(this.customVocabulary));
    } catch (error) {
      console.error('初始化词汇表失败:', error);
    }
  }

  // 语音识别结果优化
  private async optimizeRecognitionResult(result: VoiceRecognitionResult): Promise<VoiceRecognitionResult> {
    // 应用自定义词汇表纠正
    const correctedText = this.applyVocabularyCorrection(result.text);
    
    // 上下文理解优化
    const enhancedResult = await this.enhanceWithContext(correctedText);

    return {
      ...result,
      text: enhancedResult.text,
      confidence: enhancedResult.confidence,
      foodItems: enhancedResult.foodItems
    };
  }

  // 词汇纠正
  private applyVocabularyCorrection(text: string): string {
    let correctedText = text;
    this.customVocabulary.forEach(word => {
      const similarWord = this.findSimilarWord(text, word);
      if (similarWord) {
        correctedText = correctedText.replace(similarWord, word);
      }
    });
    return correctedText;
  }

  // 查找相似词
  private findSimilarWord(text: string, vocabularyWord: string): string | null {
    const words = text.split(' ');
    for (const word of words) {
      if (this.calculateLevenshteinDistance(word, vocabularyWord) <= 2) {
        return word;
      }
    }
    return null;
  }

  // 计算编辑距离
  private calculateLevenshteinDistance(a: string, b: string): number {
    const matrix = Array(b.length + 1).fill(null).map(() => 
      Array(a.length + 1).fill(null)
    );

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        );
      }
    }

    return matrix[b.length][a.length];
  }

  // 重写开始录音方法
  async startRecording(): Promise<VoiceRecognitionResult> {
    const result = await super.startRecording();
    return this.optimizeRecognitionResult(result);
  }
} 