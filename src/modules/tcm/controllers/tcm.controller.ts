import { AuthGuard } from '@nestjs/passport';
import { ConstitutionAssessmentService } from '../../../services/tcm/constitution-assessment.service';
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { HealthPreservationService } from '../../../services/tcm/health-preservation.service';
import { MassageGuidanceService } from '../../../services/tcm/massage-guidance.service';
import { SeasonalService } from '../../../services/tcm/seasonal.service';
import { TCM } from '../../../types/tcm';
import { TCMKnowledgeBaseService } from '../../../services/tcm/tcm-knowledge-base.service';

@Controller()
@UseGuards())
export class TCMController {
  constructor(
    private readonly constitutionService: ConstitutionAssessmentService,
    private readonly preservationService: HealthPreservationService,
    private readonly massageService: MassageGuidanceService,
    private readonly knowledgeBase: TCMKnowledgeBaseService,
    private readonly seasonalService: SeasonalService,
  ) {}

  // 体质评估相关接口
  @Post()
  async assessConstitution(
    @Body() userId: string,
    @Body() symptoms: TCM.SymptomRecord[],
  ) {
    return await this.constitutionService.performAssessment(userId, symptoms);
  }

  @Get()
  async getHealthSuggestions(
    @Query() constitution: string,
    @Query() season: string,
  ) {
    return await this.constitutionService.generateHealthSuggestions(
      { type: constitution, features: [] },
      season,
    );
  }

  @Get()
  async trackConstitutionChanges(
    @Query() userId: string,
    @Query() startDate: string,
    @Query() endDate: string,
  ) {
    return await this.constitutionService.trackConstitutionChanges(userId, {
      start: new Date(startDate),
      end: new Date(endDate),
    });
  }

  // 养生方案相关接口
  @Post()
  async generatePreservationPlan(
    @Body() userId: string,
    @Body() constitution: TCM.Constitution,
  ) {
    return await this.preservationService.generatePreservationPlan(userId, constitution);
  }

  // 推拿指导相关接口
  @Post()
  async generateMassagePlan(
    @Body() userId: string,
    @Body() symptoms: string[],
    @Body()
    preferences: {
      duration: number;
      intensity: string;
      focus: string[];
    },
  ) {
    return await this.massageService.generateMassagePlan(userId, symptoms, preferences);
  }

  @Post()
  async generateAcupointMassagePlan(
    @Body() userId: string,
    @Body() meridian: string,
    @Body() condition: string,
  ) {
    return await this.massageService.generateAcupointMassagePlan(userId, meridian, condition);
  }

  @Post()
  async generateMeridianMassagePlan(
    @Body() userId: string,
    @Body() meridians: string[],
  ) {
    return await this.massageService.generateMeridianMassagePlan(userId, meridians);
  }

  // 知识库相关接口
  @Get()
  async getSeasonalFoods(@Param() season: string) {
    return await this.knowledgeBase.getSeasonalFoods(season);
  }

  @Get()
  async getConstitutionFoods(@Param() constitutionType: string) {
    return await this.knowledgeBase.getConstitutionFoods(constitutionType);
  }

  @Get()
  async getMeridianPoints(@Param() meridian: string) {
    return await this.knowledgeBase.getMeridianPoints(meridian);
  }

  @Get()
  async getMassageTechniques() {
    return await this.knowledgeBase.getMassageTechniques();
  }

  @Get()
  async getHealthPreservationExercises() {
    return await this.knowledgeBase.getHealthPreservationExercises();
  }

  // 季节养生相关接口
  @Get()
  async getCurrentSeason() {
    return await this.seasonalService.getCurrentSeason();
  }

  @Get()
  async getSeasonalFactors(@Query() season: string) {
    return await this.seasonalService.getSeasonalFactors(season);
  }

  @Get()
  async getSeasonTransitionGuidance(
    @Query() fromSeason: string,
    @Query() toSeason: string,
  ) {
    return await this.seasonalService.getSeasonTransitionGuidance(fromSeason, toSeason);
  }

  @Get()
  async getSeasonalHealthFocus(@Query() season: string) {
    return await this.seasonalService.getSeasonalHealthFocus(season);
  }

  @Get()
  async getSolarTermGuidance(@Query() solarTerm: string) {
    return await this.seasonalService.getSolarTermGuidance(solarTerm);
  }
}
