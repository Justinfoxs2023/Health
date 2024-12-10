import { api } from '../utils';
import { FoodNutritionAnalysisService, NutritionInfo } from './food-nutrition-analysis.service';

interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

export class MultilingualFoodAnalysisService extends FoodNutritionAnalysisService {
  private supportedLanguages = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'];
  private translationCache: TranslationCache = {};
  private currentLanguage: string = 'zh-CN';

  // 设置语言
  setLanguage(lang: string) {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLanguage = lang;
    } else {
      throw new Error(`不支持的语言: ${lang}`);
    }
  }

  // 翻译食物名称
  private async translateFoodName(name: string, targetLang: string): Promise<string> {
    // 检查缓存
    if (this.translationCache[name]?.[targetLang]) {
      return this.translationCache[name][targetLang];
    }

    try {
      const response = await api.post('/api/translate/food', {
        text: name,
        targetLang
      });

      // 更新缓存
      if (!this.translationCache[name]) {
        this.translationCache[name] = {};
      }
      this.translationCache[name][targetLang] = response.data.translation;

      return response.data.translation;
    } catch (error) {
      console.error('翻译失败:', error);
      return name;
    }
  }

  // 重写分析方法以支持多语言
  async analyzeFoodNutrition(foodItems: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>): Promise<any> {
    // 如果不是中文，先翻译成中文进行分析
    if (this.currentLanguage !== 'zh-CN') {
      const translatedItems = await Promise.all(
        foodItems.map(async item => ({
          ...item,
          name: await this.translateFoodName(item.name, 'zh-CN')
        }))
      );
      
      // 获取中文分析结果
      const result = await super.analyzeFoodNutrition(translatedItems);

      // 翻译回目标语言
      return this.translateAnalysisResult(result, this.currentLanguage);
    }

    return super.analyzeFoodNutrition(foodItems);
  }

  // 翻译分析结果
  private async translateAnalysisResult(result: any, targetLang: string): Promise<any> {
    const translatedItems = await Promise.all(
      result.items.map(async (item: any) => ({
        ...item,
        name: await this.translateFoodName(item.name, targetLang)
      }))
    );

    return {
      ...result,
      items: translatedItems,
      aiSuggestions: await this.translateSuggestions(result.aiSuggestions, targetLang)
    };
  }

  // 翻译建议
  private async translateSuggestions(suggestions: string[], targetLang: string): Promise<string[]> {
    try {
      const response = await api.post('/api/translate/batch', {
        texts: suggestions,
        targetLang
      });
      return response.data.translations;
    } catch (error) {
      console.error('翻译建议失败:', error);
      return suggestions;
    }
  }
} 