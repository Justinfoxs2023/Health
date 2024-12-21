import { CacheService } from '../cache/cache.service';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { Model } from 'mongoose';

@Injectable()
export class TCMKnowledgeBaseService {
  private readonly logger = new Logger(TCMKnowledgeBaseService.name);

  constructor(
    @InjectModel()
    private readonly tcmKnowledgeModel: Model<any>,
    private readonly cacheService: CacheService,
  ) {}

  // 获取季节性食物
  async getSeasonalFoods(season: string): Promise<string[]> {
    const cacheKey = `seasonal_foods:${season}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const foods = await this.tcmKnowledgeModel.findOne(
      { type: 'seasonal_foods', season },
      { foods: 1 },
    );

    await this.cacheService.set(cacheKey, foods?.foods || [], 3600);
    return foods?.foods || [];
  }

  // 获取体质相关食物
  async getConstitutionFoods(constitutionType: string): Promise<string[]> {
    const cacheKey = `constitution_foods:${constitutionType}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const foods = await this.tcmKnowledgeModel.findOne(
      { type: 'constitution_foods', constitution: constitutionType },
      { foods: 1 },
    );

    await this.cacheService.set(cacheKey, foods?.foods || [], 3600);
    return foods?.foods || [];
  }

  // 获取饮食禁忌
  async getDietaryRestrictions(constitutionType: string): Promise<string[]> {
    const cacheKey = `dietary_restrictions:${constitutionType}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const restrictions = await this.tcmKnowledgeModel.findOne(
      { type: 'dietary_restrictions', constitution: constitutionType },
      { restrictions: 1 },
    );

    await this.cacheService.set(cacheKey, restrictions?.restrictions || [], 3600);
    return restrictions?.restrictions || [];
  }

  // 获取季节生活指导
  async getSeasonalLifestyleGuidance(season: string): Promise<{
    routine: string[];
    precautions: string[];
  }> {
    const cacheKey = `seasonal_lifestyle:${season}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const guidance = await this.tcmKnowledgeModel.findOne(
      { type: 'seasonal_lifestyle', season },
      { routine: 1, precautions: 1 },
    );

    const result = {
      routine: guidance?.routine || [],
      precautions: guidance?.precautions || [],
    };

    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  // 获取体质生活指导
  async getConstitutionLifestyleGuidance(constitutionType: string): Promise<{
    routine: string[];
    habits: string[];
    precautions: string[];
  }> {
    const cacheKey = `constitution_lifestyle:${constitutionType}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const guidance = await this.tcmKnowledgeModel.findOne(
      { type: 'constitution_lifestyle', constitution: constitutionType },
      { routine: 1, habits: 1, precautions: 1 },
    );

    const result = {
      routine: guidance?.routine || [],
      habits: guidance?.habits || [],
      precautions: guidance?.precautions || [],
    };

    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  // 获取体质运动建议
  async getConstitutionExercises(constitutionType: string): Promise<string[]> {
    const cacheKey = `constitution_exercises:${constitutionType}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const exercises = await this.tcmKnowledgeModel.findOne(
      { type: 'constitution_exercises', constitution: constitutionType },
      { exercises: 1 },
    );

    await this.cacheService.set(cacheKey, exercises?.exercises || [], 3600);
    return exercises?.exercises || [];
  }

  // 获取季节运动调整建议
  async getSeasonalExerciseAdjustments(season: string): Promise<Record<string, string>> {
    const cacheKey = `seasonal_exercise_adjustments:${season}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const adjustments = await this.tcmKnowledgeModel.findOne(
      { type: 'seasonal_exercise_adjustments', season },
      { adjustments: 1 },
    );

    await this.cacheService.set(cacheKey, adjustments?.adjustments || {}, 3600);
    return adjustments?.adjustments || {};
  }

  // 获取季节保健措施
  async getSeasonalPreventiveMeasures(season: string): Promise<{
    measures: string[];
  }> {
    const cacheKey = `seasonal_preventive:${season}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const measures = await this.tcmKnowledgeModel.findOne(
      { type: 'seasonal_preventive_measures', season },
      { measures: 1 },
    );

    const result = {
      measures: measures?.measures || [],
    };

    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  // 获取体质保健措施
  async getConstitutionPreventiveMeasures(constitutionType: string): Promise<{
    daily: string[];
  }> {
    const cacheKey = `constitution_preventive:${constitutionType}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const measures = await this.tcmKnowledgeModel.findOne(
      { type: 'constitution_preventive_measures', constitution: constitutionType },
      { daily: 1 },
    );

    const result = {
      daily: measures?.daily || [],
    };

    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  // 获取经络穴位信息
  async getMeridianPoints(meridian: string): Promise<{
    points: Array<{
      name: string;
      location: string;
      functions: string[];
      indications: string[];
    }>;
  }> {
    const cacheKey = `meridian_points:${meridian}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const meridianData = await this.tcmKnowledgeModel.findOne(
      { type: 'meridian_points', meridian },
      { points: 1 },
    );

    const result = {
      points: meridianData?.points || [],
    };

    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  // 获取推拿手法
  async getMassageTechniques(): Promise<
    Array<{
      name: string;
      description: string;
      applications: string[];
      precautions: string[];
    }>
  > {
    const cacheKey = 'massage_techniques';
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const techniques = await this.tcmKnowledgeModel.find(
      { type: 'massage_techniques' },
      { name: 1, description: 1, applications: 1, precautions: 1 },
    );

    await this.cacheService.set(cacheKey, techniques || [], 3600);
    return techniques || [];
  }

  // 获取养生功法
  async getHealthPreservationExercises(): Promise<
    Array<{
      name: string;
      description: string;
      steps: string[];
      benefits: string[];
      precautions: string[];
    }>
  > {
    const cacheKey = 'health_preservation_exercises';
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const exercises = await this.tcmKnowledgeModel.find(
      { type: 'health_preservation_exercises' },
      { name: 1, description: 1, steps: 1, benefits: 1, precautions: 1 },
    );

    await this.cacheService.set(cacheKey, exercises || [], 3600);
    return exercises || [];
  }

  // 获取情志调节方法
  async getEmotionalRegulationMethods(): Promise<
    Array<{
      name: string;
      description: string;
      applications: string[];
      benefits: string[];
    }>
  > {
    const cacheKey = 'emotional_regulation_methods';
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const methods = await this.tcmKnowledgeModel.find(
      { type: 'emotional_regulation' },
      { name: 1, description: 1, applications: 1, benefits: 1 },
    );

    await this.cacheService.set(cacheKey, methods || [], 3600);
    return methods || [];
  }

  // 获取冥想方法
  async getMeditationMethods(): Promise<
    Array<{
      name: string;
      description: string;
      steps: string[];
      benefits: string[];
      precautions: string[];
    }>
  > {
    const cacheKey = 'meditation_methods';
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const methods = await this.tcmKnowledgeModel.find(
      { type: 'meditation_methods' },
      { name: 1, description: 1, steps: 1, benefits: 1, precautions: 1 },
    );

    await this.cacheService.set(cacheKey, methods || [], 3600);
    return methods || [];
  }

  // 获取养生知识
  async getHealthPreservationKnowledge(category: string): Promise<
    Array<{
      title: string;
      content: string;
      tags: string[];
      references: string[];
    }>
  > {
    const cacheKey = `health_preservation_knowledge:${category}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const knowledge = await this.tcmKnowledgeModel.find(
      { type: 'health_preservation_knowledge', category },
      { title: 1, content: 1, tags: 1, references: 1 },
    );

    await this.cacheService.set(cacheKey, knowledge || [], 3600);
    return knowledge || [];
  }
}
