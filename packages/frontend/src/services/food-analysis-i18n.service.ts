import i18next from 'i18next';
import { FoodAnalysisResult } from './food-analysis.service';

export class FoodAnalysisI18nService {
  private supportedLanguages = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'];

  constructor() {
    this.initializeI18n();
  }

  private async initializeI18n() {
    await i18next.init({
      lng: 'zh-CN',
      fallbackLng: 'en-US',
      resources: {
        'zh-CN': require('../locales/zh-CN/food-analysis.json'),
        'en-US': require('../locales/en-US/food-analysis.json'),
        'ja-JP': require('../locales/ja-JP/food-analysis.json'),
        'ko-KR': require('../locales/ko-KR/food-analysis.json')
      }
    });
  }

  // 翻译分析结果
  translateResult(result: FoodAnalysisResult, targetLang: string): FoodAnalysisResult {
    if (!this.supportedLanguages.includes(targetLang)) {
      throw new Error(`不支持的语言: ${targetLang}`);
    }

    return {
      ...result,
      foodType: i18next.t(`foodTypes.${result.foodType}`, { lng: targetLang }),
      nutrients: {
        ...result.nutrients,
        vitamins: Object.entries(result.nutrients.vitamins).reduce((acc, [key, value]) => ({
          ...acc,
          [i18next.t(`nutrients.vitamins.${key}`, { lng: targetLang })]: value
        }), {})
      }
    };
  }
}