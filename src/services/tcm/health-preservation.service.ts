import { AIService } from '../ai/ai.service';
import { HealthDataService } from '../health/health-data.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { SeasonalService } from './seasonal.service';
import { TCMKnowledgeBaseService } from './tcm-knowledge-base.service';

@Injectable()
export class HealthPreservationService {
  private readonly logger = new Logger(HealthPreservationService.name);

  constructor(
    private readonly tcmKnowledgeBase: TCMKnowledgeBaseService,
    private readonly seasonalService: SeasonalService,
    private readonly healthDataService: HealthDataService,
    private readonly aiService: AIService,
  ) {}

  // 生成个性化养生方案
  async generatePreservationPlan(
    userId: string,
    constitution: TCM.Constitution,
  ): Promise<TCM.SeasonalPlan> {
    try {
      const currentSeason = await this.seasonalService.getCurrentSeason();
      const healthData = await this.healthDataService.getUserHealthData(userId);
      const aiSuggestions = await this.aiService.generateHealthSuggestions(
        constitution,
        healthData,
      );

      return {
        dietary: await this.generateDietaryPlan(
          constitution,
          currentSeason,
          healthData,
          aiSuggestions,
        ),
        lifestyle: await this.generateLifestylePlan(constitution, currentSeason, aiSuggestions),
        exercises: await this.generateExercisePlan(constitution, currentSeason, healthData),
        preventions: await this.generatePreventivePlan(constitution, currentSeason),
        meridianCare: await this.generateMeridianCare(constitution, currentSeason),
        mentalHealth: await this.generateMentalHealthPlan(constitution, healthData),
      };
    } catch (error) {
      this.logger.error('生成养生方案失败', error);
      throw error;
    }
  }

  // 生成饮食养生方案
  private async generateDietaryPlan(
    constitution: TCM.Constitution,
    season: string,
    healthData: any,
    aiSuggestions: any,
  ): Promise<TCM.DietaryPlan> {
    const seasonalFoods = await this.tcmKnowledgeBase.getSeasonalFoods(season);
    const constitutionFoods = await this.tcmKnowledgeBase.getConstitutionFoods(constitution.type);

    return {
      recommendations: this.mergeDietaryRecommendations(seasonalFoods, constitutionFoods),
      restrictions: await this.tcmKnowledgeBase.getDietaryRestrictions(constitution.type),
      seasonalFoods: seasonalFoods,
    };
  }

  // 生成起居养生方案
  private async generateLifestylePlan(
    constitution: TCM.Constitution,
    season: string,
    aiSuggestions: any,
  ): Promise<TCM.LifestylePlan> {
    const seasonalGuidance = await this.tcmKnowledgeBase.getSeasonalLifestyleGuidance(season);
    const constitutionGuidance = await this.tcmKnowledgeBase.getConstitutionLifestyleGuidance(
      constitution.type,
    );

    return {
      dailyRoutine: this.mergeLifestyleRecommendations(
        seasonalGuidance.routine,
        constitutionGuidance.routine,
      ),
      habits: constitutionGuidance.habits,
      precautions: [...seasonalGuidance.precautions, ...constitutionGuidance.precautions],
    };
  }

  // 生成运动养生方案
  private async generateExercisePlan(
    constitution: TCM.Constitution,
    season: string,
    healthData: any,
  ): Promise<TCM.ExercisePlan> {
    const baseExercises = await this.tcmKnowledgeBase.getConstitutionExercises(constitution.type);
    const seasonalAdjustments = await this.tcmKnowledgeBase.getSeasonalExerciseAdjustments(season);

    return {
      recommendations: this.adjustExerciseRecommendations(baseExercises, seasonalAdjustments),
      intensity: this.calculateExerciseIntensity(constitution, season, healthData),
      frequency: this.determineExerciseFrequency(constitution, season),
      duration: this.calculateExerciseDuration(constitution, healthData),
    };
  }

  // 生成���防保健方案
  private async generatePreventivePlan(
    constitution: TCM.Constitution,
    season: string,
  ): Promise<TCM.PreventiveMeasures> {
    const seasonalPrevention = await this.tcmKnowledgeBase.getSeasonalPreventiveMeasures(season);
    const constitutionPrevention = await this.tcmKnowledgeBase.getConstitutionPreventiveMeasures(
      constitution.type,
    );

    return {
      daily: constitutionPrevention.daily,
      seasonal: seasonalPrevention.measures,
      longTerm: this.generateLongTermPrevention(constitution),
    };
  }

  // 合并饮食建议
  private mergeDietaryRecommendations(seasonal: string[], constitutional: string[]): string[] {
    return [...new Set([...seasonal, ...constitutional])];
  }

  // 合并生活起居建议
  private mergeLifestyleRecommendations(seasonal: string[], constitutional: string[]): string[] {
    return [...new Set([...seasonal, ...constitutional])];
  }

  // 调整运动建议
  private adjustExerciseRecommendations(base: string[], seasonal: any): string[] {
    return base.map(exercise => {
      const adjustment = seasonal[exercise];
      return adjustment ? `${exercise} (${adjustment})` : exercise;
    });
  }

  // 计算运动强度
  private calculateExerciseIntensity(
    constitution: TCM.Constitution,
    season: string,
    healthData: any,
  ): string {
    // 基于体质、季节和健康数据计算适宜的运动强度
    return '中等强度'; // 示例返回值
  }

  // 确定运动频率
  private determineExerciseFrequency(constitution: TCM.Constitution, season: string): string {
    // 基于体质和季节确定适宜的运动频率
    return '每周3-4次'; // 示例返回值
  }

  // 计算运动时长
  private calculateExerciseDuration(constitution: TCM.Constitution, healthData: any): string {
    // 基于体质和健康状况计算适宜的运动时长
    return '30-45分钟/次'; // 示例返回值
  }

  // 生成长期预防建议
  private generateLongTermPrevention(constitution: TCM.Constitution): string[] {
    // 基于体质特点生成长期保健建议
    return ['定期进行体质评估', '保持作息规律', '调节情志平衡', '适时养生保健'];
  }

  // 生成经络养生方案
  private async generateMeridianCare(
    constitution: TCM.Constitution,
    season: string,
  ): Promise<TCM.MeridianCare> {
    const meridianPoints = await this.tcmKnowledgeBase.getMeridianPoints(season);
    const massageTechniques = await this.tcmKnowledgeBase.getMassageTechniques();

    return {
      dailyPoints: this.selectDailyPoints(meridianPoints, constitution),
      techniques: this.selectMassageTechniques(massageTechniques, constitution),
      schedule: this.createMeridianSchedule(season),
      precautions: this.getMeridianPrecautions(constitution),
    };
  }

  // 生成心理健康方案
  private async generateMentalHealthPlan(
    constitution: TCM.Constitution,
    healthData: any,
  ): Promise<TCM.MentalHealthPlan> {
    return {
      emotionalBalance: this.generateEmotionalBalance(constitution),
      mindfulnessPractices: await this.getMindfulnessPractices(constitution),
      stressManagement: this.generateStressManagement(healthData),
      dailyMeditation: this.generateMeditationGuide(constitution),
    };
  }

  // 选择每日经络穴位
  private selectDailyPoints(meridianPoints: any[], constitution: TCM.Constitution): any[] {
    return meridianPoints
      .filter(point => this.isPointSuitableForConstitution(point, constitution))
      .slice(0, 5);
  }

  // 选择按摩手法
  private selectMassageTechniques(techniques: any[], constitution: TCM.Constitution): any[] {
    return techniques
      .filter(technique => this.isTechniqueSuitableForConstitution(technique, constitution))
      .slice(0, 3);
  }

  // 创建经络保养时间表
  private createMeridianSchedule(season: string): any {
    return {
      morning: ['督脉', '任脉'],
      afternoon: ['足太阳膀胱经', '足少阳胆经'],
      evening: ['手太阴肺经', '手阳明大肠经'],
    };
  }

  // 获取经络保养注意事项
  private getMeridianPrecautions(constitution: TCM.Constitution): string[] {
    return [
      '避免在饭后立即进行经络按摩',
      '注意按摩力度要适中',
      '经期避免刺激特定穴位',
      '如有特殊疾病请遵医嘱',
    ];
  }

  // 生成情志调节方案
  private generateEmotionalBalance(constitution: TCM.Constitution): any {
    return {
      focus: this.getEmotionalFocus(constitution),
      methods: this.getEmotionalMethods(constitution),
      schedule: this.createEmotionalSchedule(),
    };
  }

  // 获取正念练习方案
  private async getMindfulnessPractices(constitution: TCM.Constitution): Promise<any> {
    const practices = await this.tcmKnowledgeBase.getHealthPreservationExercises();
    return practices
      .filter(practice => practice.type === 'mindfulness')
      .map(practice => ({
        ...practice,
        duration: this.calculatePracticeDuration(constitution),
        frequency: this.determinePracticeFrequency(constitution),
      }));
  }

  // 生成压力管理方案
  private generateStressManagement(healthData: any): any {
    return {
      techniques: this.getStressReliefTechniques(healthData),
      schedule: this.createStressManagementSchedule(),
      monitoring: this.setupStressMonitoring(),
    };
  }

  // 生成冥想指导
  private generateMeditationGuide(constitution: TCM.Constitution): any {
    return {
      methods: this.getMeditationMethods(constitution),
      duration: this.calculateMeditationDuration(constitution),
      frequency: this.determineMeditationFrequency(constitution),
      guidance: this.getMeditationGuidance(constitution),
    };
  }

  // 辅助方法
  private isPointSuitableForConstitution(point: any, constitution: TCM.Constitution): boolean {
    return true; // 根据体质特点判断穴位适用性
  }

  private isTechniqueSuitableForConstitution(
    technique: any,
    constitution: TCM.Constitution,
  ): boolean {
    return true; // 根据体质特点判断手法适用性
  }

  private getEmotionalFocus(constitution: TCM.Constitution): string[] {
    return ['情志调节', '心神安宁', '情绪平衡'];
  }

  private getEmotionalMethods(constitution: TCM.Constitution): any[] {
    return [
      { name: '冥想', duration: '15分钟', frequency: '每日' },
      { name: '太极', duration: '30分钟', frequency: '每周3次' },
      { name: '八段锦', duration: '20分钟', frequency: '每日' },
    ];
  }

  private createEmotionalSchedule(): any {
    return {
      morning: ['晨起冥想', '八段锦'],
      afternoon: ['太极练习'],
      evening: ['情志调节', '冥想放松'],
    };
  }

  private calculatePracticeDuration(constitution: TCM.Constitution): string {
    return '20分钟';
  }

  private determinePracticeFrequency(constitution: TCM.Constitution): string {
    return '每日1次';
  }

  private getStressReliefTechniques(healthData: any): any[] {
    return [
      { name: '腹式呼吸', duration: '5分钟', frequency: '每日3次' },
      { name: '渐进式放松', duration: '15分钟', frequency: '每日1次' },
      { name: '正念行走', duration: '10分钟', frequency: '每日2次' },
    ];
  }

  private createStressManagementSchedule(): any {
    return {
      morning: ['腹式呼吸'],
      afternoon: ['正念行走'],
      evening: ['渐进式放松'],
    };
  }

  private setupStressMonitoring(): any {
    return {
      metrics: ['心率变异性', '呼吸频率', '情绪状态'],
      frequency: '每日',
      alertThresholds: {
        heartRateVariability: 50,
        breathingRate: 20,
        moodScore: 7,
      },
    };
  }

  private getMeditationMethods(constitution: TCM.Constitution): any[] {
    return [
      { name: '静坐冥想', duration: '15分钟', focus: '调息养神' },
      { name: '行走冥想', duration: '20分钟', focus: '身心统一' },
      { name: '观想冥想', duration: '10分钟', focus: '意守丹田' },
    ];
  }

  private calculateMeditationDuration(constitution: TCM.Constitution): string {
    return '15分钟';
  }

  private determineMeditationFrequency(constitution: TCM.Constitution): string {
    return '每日2次';
  }

  private getMeditationGuidance(constitution: TCM.Constitution): string[] {
    return ['选择安静环境', '保持自然呼吸', '放松身心', '保持正确姿势'];
  }
}
