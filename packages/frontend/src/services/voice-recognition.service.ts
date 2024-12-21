import { api } from '../utils';

export interface IVoiceRecognitionResult {
  /** text 的描述 */
  text: string;
  /** confidence 的描述 */
  confidence: number;
  /** foodItems 的描述 */
  foodItems?: Array<{
    name: string;
    quantity?: string;
    unit?: string;
  }>;
}

export class VoiceRecognitionService {
  private recognition: SpeechRecognition;

  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.lang = 'zh-CN';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
  }

  // 开始语音识别
  async startRecording(): Promise<IVoiceRecognitionResult> {
    return new Promise((resolve, reject) => {
      this.recognition.onresult = async event => {
        const text = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;

        try {
          // 调用AI进行语义分析
          const foodItems = await this.analyzeFoodText(text);
          resolve({ text, confidence, foodItems });
        } catch (error) {
          reject(error);
        }
      };

      this.recognition.onerror = error => reject(error);
      this.recognition.start();
    });
  }

  // 停止语音识别
  stopRecording(): void {
    this.recognition.stop();
  }

  // AI语义分析
  private async analyzeFoodText(text: string) {
    try {
      const response = await api.post('/api/ai/analyze-food-text', { text });
      return response.data;
    } catch (error) {
      console.error('Error in voice-recognition.service.ts:', '食物文本分析失败:', error);
      throw error;
    }
  }
}
