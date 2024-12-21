import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class SeasonalService {
  private readonly seasons = ['春', '夏', '秋', '冬'];

  constructor(@InjectModel() private readonly seasonalDataModel: Model<any>) {}

  // 获取当前季节
  async getCurrentSeason(): Promise<string> {
    const date = new Date();
    const month = date.getMonth();

    // 根据月份判断季节
    if (month >= 2 && month <= 4) return '春';
    if (month >= 5 && month <= 7) return '夏';
    if (month >= 8 && month <= 10) return '秋';
    return '冬';
  }

  // 获取季节因素
  async getSeasonalFactors(season: string): Promise<{
    climate: string;
    characteristics: string[];
    healthFocus: string[];
    precautions: string[];
  }> {
    const seasonalData = await this.seasonalDataModel.findOne(
      { season },
      { climate: 1, characteristics: 1, healthFocus: 1, precautions: 1 },
    );

    return {
      climate: seasonalData?.climate || '',
      characteristics: seasonalData?.characteristics || [],
      healthFocus: seasonalData?.healthFocus || [],
      precautions: seasonalData?.precautions || [],
    };
  }

  // 获取当前季节因素
  async getCurrentSeasonalFactors(): Promise<{
    climate: string;
    characteristics: string[];
    healthFocus: string[];
    precautions: string[];
  }> {
    const currentSeason = await this.getCurrentSeason();
    return this.getSeasonalFactors(currentSeason);
  }

  // 获取季节转换建议
  async getSeasonTransitionGuidance(
    fromSeason: string,
    toSeason: string,
  ): Promise<{
    dietaryAdjustments: string[];
    lifestyleChanges: string[];
    healthPrecautions: string[];
  }> {
    const guidance = await this.seasonalDataModel.findOne(
      {
        type: 'season_transition',
        fromSeason,
        toSeason,
      },
      {
        dietaryAdjustments: 1,
        lifestyleChanges: 1,
        healthPrecautions: 1,
      },
    );

    return {
      dietaryAdjustments: guidance?.dietaryAdjustments || [],
      lifestyleChanges: guidance?.lifestyleChanges || [],
      healthPrecautions: guidance?.healthPrecautions || [],
    };
  }

  // 获取季节性养生重点
  async getSeasonalHealthFocus(season: string): Promise<{
    focus: string[];
    methods: string[];
    recommendations: string[];
  }> {
    const healthFocus = await this.seasonalDataModel.findOne(
      { type: 'seasonal_health_focus', season },
      { focus: 1, methods: 1, recommendations: 1 },
    );

    return {
      focus: healthFocus?.focus || [],
      methods: healthFocus?.methods || [],
      recommendations: healthFocus?.recommendations || [],
    };
  }

  // 获取节气养生建议
  async getSolarTermGuidance(solarTerm: string): Promise<{
    dietary: string[];
    lifestyle: string[];
    healthcare: string[];
  }> {
    const guidance = await this.seasonalDataModel.findOne(
      { type: 'solar_term_guidance', solarTerm },
      { dietary: 1, lifestyle: 1, healthcare: 1 },
    );

    return {
      dietary: guidance?.dietary || [],
      lifestyle: guidance?.lifestyle || [],
      healthcare: guidance?.healthcare || [],
    };
  }

  // 判断是否季节转换期
  async isSeasonTransition(): Promise<{
    isTransition: boolean;
    fromSeason?: string;
    toSeason?: string;
  }> {
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();

    // 季节转换期判断（每个季节最后15天和下个季节前15天）
    const isTransitionPeriod = day >= 15 || day <= 15;
    if (!isTransitionPeriod) {
      return { isTransition: false };
    }

    const currentSeason = await this.getCurrentSeason();
    const currentSeasonIndex = this.seasons.indexOf(currentSeason);
    const nextSeasonIndex = (currentSeasonIndex + 1) % 4;

    return {
      isTransition: true,
      fromSeason: this.seasons[currentSeasonIndex],
      toSeason: this.seasons[nextSeasonIndex],
    };
  }

  // 获取当前节气
  async getCurrentSolarTerm(): Promise<string> {
    const date = new Date();
    // 这里需要实现具体的节气计算逻辑
    // 可以使用农历计算库或查表法实现
    return '立春'; // 示例返回值
  }
}
