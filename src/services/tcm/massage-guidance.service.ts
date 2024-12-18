import { HealthDataService } from '../health/health-data.service';
import { Injectable } from '@nestjs/common';
import { TCM } from '../../types/tcm';
import { TCMKnowledgeBaseService } from './tcm-knowledge-base.service';

@Injectable()
export class MassageGuidanceService {
  constructor(
    private readonly tcmKnowledgeBase: TCMKnowledgeBaseService,
    private readonly healthDataService: HealthDataService,
  ) {}

  // 生成推拿方案
  async generateMassagePlan(
    userId: string,
    symptoms: string[],
    preferences: {
      duration: number;
      intensity: string;
      focus: string[];
    },
  ): Promise<{
    techniques: Array<{
      name: string;
      description: string;
      duration: number;
      intensity: string;
      points: string[];
      precautions: string[];
    }>;
    sequence: string[];
    totalDuration: number;
    precautions: string[];
  }> {
    // 获取用户健康数据
    const healthData = await this.healthDataService.getUserHealthData(userId);

    // 获取推拿手法库
    const techniques = await this.tcmKnowledgeBase.getMassageTechniques();

    // 根据��状和偏好选择合适的手法
    const selectedTechniques = await this.selectTechniques(
      techniques,
      symptoms,
      preferences,
      healthData,
    );

    // 生成推拿序列
    const sequence = this.generateSequence(selectedTechniques);

    // 计算总时长
    const totalDuration = this.calculateTotalDuration(selectedTechniques);

    // 整合注意事项
    const precautions = this.consolidatePrecautions(selectedTechniques);

    return {
      techniques: selectedTechniques,
      sequence,
      totalDuration,
      precautions,
    };
  }

  // 生成穴位按摩方案
  async generateAcupointMassagePlan(
    userId: string,
    meridian: string,
    condition: string,
  ): Promise<{
    points: Array<{
      name: string;
      location: string;
      method: string;
      duration: number;
      precautions: string[];
    }>;
    sequence: string[];
    totalDuration: number;
  }> {
    // 获取经络穴位信息
    const meridianData = await this.tcmKnowledgeBase.getMeridianPoints(meridian);

    // 根据病症选择合适的穴位
    const selectedPoints = await this.selectAcupoints(meridianData.points, condition);

    // 生成按摩顺序
    const sequence = this.generateAcupointSequence(selectedPoints);

    // ���算总时长
    const totalDuration = this.calculateAcupointMassageDuration(selectedPoints);

    return {
      points: selectedPoints,
      sequence,
      totalDuration,
    };
  }

  // 生成经络按摩方案
  async generateMeridianMassagePlan(
    userId: string,
    targetMeridians: string[],
  ): Promise<{
    meridians: Array<{
      name: string;
      path: string[];
      techniques: string[];
      duration: number;
    }>;
    sequence: string[];
    totalDuration: number;
    precautions: string[];
  }> {
    // 获取用户体质信息
    const healthData = await this.healthDataService.getUserHealthData(userId);

    // 获取经络信息
    const meridianData = await Promise.all(
      targetMeridians.map(m => this.tcmKnowledgeBase.getMeridianPoints(m)),
    );

    // 生成经络按摩方案
    const meridianPlans = await this.generateMeridianPlans(meridianData, healthData);

    // 生成按摩顺序
    const sequence = this.generateMeridianSequence(meridianPlans);

    // 计算总时长
    const totalDuration = this.calculateMeridianMassageDuration(meridianPlans);

    // 整合注意事项
    const precautions = this.consolidateMeridianPrecautions(meridianPlans);

    return {
      meridians: meridianPlans,
      sequence,
      totalDuration,
      precautions,
    };
  }

  // 选择推拿手法
  private async selectTechniques(
    techniques: any[],
    symptoms: string[],
    preferences: any,
    healthData: any,
  ): Promise<any[]> {
    return techniques.filter(technique => {
      // 根据症状匹配
      const symptomsMatch = symptoms.some(s => technique.applications.includes(s));

      // 根据强度匹配
      const intensityMatch = technique.intensity === preferences.intensity;

      // 检查禁忌
      const noContraindications = !technique.precautions.some(p =>
        healthData.conditions.includes(p),
      );

      return symptomsMatch && intensityMatch && noContraindications;
    });
  }

  // 生成推拿序列
  private generateSequence(techniques: any[]): string[] {
    return techniques.map(t => t.name);
  }

  // 计算总时长
  private calculateTotalDuration(techniques: any[]): number {
    return techniques.reduce((total, t) => total + t.duration, 0);
  }

  // 整合注意事项
  private consolidatePrecautions(techniques: any[]): string[] {
    const allPrecautions = techniques.flatMap(t => t.precautions);
    return [...new Set(allPrecautions)];
  }

  // 选择穴位
  private async selectAcupoints(points: any[], condition: string): Promise<any[]> {
    return points.filter(point => point.indications.includes(condition));
  }

  // 生成穴位按摩顺序
  private generateAcupointSequence(points: any[]): string[] {
    return points.map(p => p.name);
  }

  // 计算穴位按摩时长
  private calculateAcupointMassageDuration(points: any[]): number {
    // 每个穴位默认按摩时间
    const defaultDuration = 3; // 分钟
    return points.length * defaultDuration;
  }

  // 生成经络按摩方案
  private async generateMeridianPlans(meridianData: any[], healthData: any): Promise<any[]> {
    return meridianData.map(data => ({
      name: data.name,
      path: data.path,
      techniques: this.selectMeridianTechniques(data, healthData),
      duration: this.calculateMeridianDuration(data),
    }));
  }

  // 选择经络按摩手法
  private selectMeridianTechniques(meridianData: any, healthData: any): string[] {
    // 根据经络特点和用户状况选择合适的手法
    return ['推', '按', '揉']; // 示例返回值
  }

  // 生成经络按摩顺序
  private generateMeridianSequence(meridianPlans: any[]): string[] {
    return meridianPlans.map(p => p.name);
  }

  // 计算经络按摩时长
  private calculateMeridianDuration(meridianData: any): number {
    // 根据经络长度和复杂度计算按摩时长
    return 10; // 示例返回值（分钟）
  }

  // 整合经络按摩注意事项
  private consolidateMeridianPrecautions(meridianPlans: any[]): string[] {
    const allPrecautions = meridianPlans.flatMap(p => p.precautions || []);
    return [...new Set(allPrecautions)];
  }
}
