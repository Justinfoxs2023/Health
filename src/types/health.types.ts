import { Document } from 'mongoose';

// 组件基础接口
export interface IComponent {
  /** name 的描述 */
    name: string;
  /** version 的描述 */
    version: string;
  /** config 的描述 */
    config: IComponentConfig;
  /** status 的描述 */
    status: import("D:/Health/src/types/health.types").ComponentStatus.ACTIVE | import("D:/Health/src/types/health.types").ComponentStatus.INACTIVE | import("D:/Health/src/types/health.types").ComponentStatus.DEPRECATED;
  /** performance 的描述 */
    performance: IComponentPerformance;
  /** lifecycle 的描述 */
    lifecycle: IComponentLifecycle;
  /** accessibility 的描述 */
    accessibility: IAccessibilityConfig;
  /** i18n 的描述 */
    i18n: I18nConfig;
  /** security 的描述 */
    security: ISecurityConfig;
  /** analytics 的描述 */
    analytics: IAnalyticsConfig;
}

// 组件配置
export interface IComponentConfig {
  /** props 的描述 */
    props: Recordstring, /** any 的描述 */
    /** any 的描述 */
    any;
  /** styles 的描述 */
    styles: Recordstring, /** any 的描述 */
    /** any 的描述 */
    any;
  /** events 的描述 */
    events: string;
  /** platform 的描述 */
    platform: miniprogram  web  all;
  dependencies: string;
  permissions: string;
  cacheStrategy: memory  storage  none;
}

// 组件状态
export enum ComponentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated',
}

// 组件性能指标
export interface IComponentPerformance {
  /** renderTime 的描述 */
    renderTime: number;
  /** memoryUsage 的描述 */
    memoryUsage: number;
  /** lastUpdated 的描述 */
    lastUpdated: Date;
  /** history 的描述 */
    history: IPerformanceRecord;
}

// 性能记录
export interface IPerformanceRecord {
  /** timestamp 的描述 */
    timestamp: Date;
  /** renderTime 的描述 */
    renderTime: number;
  /** memoryUsage 的描述 */
    memoryUsage: number;
  /** errorCount 的描述 */
    errorCount: number;
  /** cpuUsage 的描述 */
    cpuUsage: number;
  /** networkLatency 的描述 */
    networkLatency: number;
  /** framerate 的描述 */
    framerate: number;
  /** resourceUtilization 的描述 */
    resourceUtilization: IResourceUtilization;
}

// 组件生命周期
export interface IComponentLifecycle {
  /** onLoad 的描述 */
    onLoad: string;
  /** onShow 的描述 */
    onShow: string;
  /** onHide 的描述 */
    onHide: string;
  /** onUnload 的描述 */
    onUnload: string;
}

// 新增配置接口
export interface IAccessibilityConfig {
  /** ariaLabel 的描述 */
    ariaLabel: string;
  /** role 的描述 */
    role: string;
  /** tabIndex 的描述 */
    tabIndex: number;
  /** shortcuts 的描述 */
    shortcuts: IKeyboardShortcut;
}

export interface I18nConfig {
  /** defaultLocale 的描述 */
    defaultLocale: string;
  /** supportedLocales 的描述 */
    supportedLocales: string;
  /** translations 的描述 */
    translations: Recordstring, /** Recordstring 的描述 */
    /** Recordstring 的描述 */
    Recordstring, /** string 的描述 */
    /** string 的描述 */
    string;
}

export interface ISecurityConfig {
  /** permissions 的描述 */
    permissions: string;
  /** encryption 的描述 */
    encryption: false | true;
  /** sanitization 的描述 */
    sanitization: false | true;
  /** auditLogging 的描述 */
    auditLogging: false | true;
}

export interface IAnalyticsConfig {
  /** tracking 的描述 */
    tracking: false | true;
  /** events 的描述 */
    events: string;
  /** metrics 的描述 */
    metrics: string;
  /** sampling 的描述 */
    sampling: number;
}

// 扩展性能记录
export interface IPerformanceRecord {
  /** timestamp 的描述 */
    timestamp: Date;
  /** renderTime 的描述 */
    renderTime: number;
  /** memoryUsage 的描述 */
    memoryUsage: number;
  /** errorCount 的描述 */
    errorCount: number;
  /** cpuUsage 的描述 */
    cpuUsage: number;
  /** networkLatency 的描述 */
    networkLatency: number;
  /** framerate 的描述 */
    framerate: number;
  /** resourceUtilization 的描述 */
    resourceUtilization: IResourceUtilization;
}

export interface IResourceUtilization {
  /** cpu 的描述 */
    cpu: number;
  /** memory 的描述 */
    memory: number;
  /** disk 的描述 */
    disk: number;
  /** network 的描述 */
    network: {
    incoming: number;
    outgoing: number;
  };
}

// Mongoose文档类型
export type ComponentDocumentType = any;

// 添加营养数据相关接口
export interface INutritionData {
  /** calorieIntake 的描述 */
    calorieIntake: number;
  /** waterIntake 的描述 */
    waterIntake: number;
  /** proteinIntake 的描述 */
    proteinIntake: number;
  /** carbIntake 的描述 */
    carbIntake: number;
  /** fatIntake 的描述 */
    fatIntake: number;
  /** meals 的描述 */
    meals: IMeal;
  /** nutritionHistory 的描述 */
    nutritionHistory: INutritionRecord;
  /** dietaryRestrictions 的描述 */
    dietaryRestrictions: string;
  /** supplements 的描述 */
    supplements: ISupplement;
  /** mealSchedule 的描述 */
    mealSchedule: IMealSchedule;
}

export interface IMeal {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** time 的描述 */
    time: Date;
  /** foods 的描述 */
    foods: IFood;
  /** totalCalories 的描述 */
    totalCalories: number;
  /** nutrients 的描述 */
    nutrients: INutrientInfo;
}

export interface IFood {
  /** name 的描述 */
    name: string;
  /** portion 的描述 */
    portion: number;
  /** unit 的描述 */
    unit: string;
  /** calories 的描述 */
    calories: number;
  /** nutrients 的描述 */
    nutrients: INutrientInfo;
}

export interface INutrientInfo {
  /** protein 的描述 */
    protein: number;
  /** carbs 的描述 */
    carbs: number;
  /** fat 的描述 */
    fat: number;
  /** vitamins 的描述 */
    vitamins: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number;
  /** minerals 的描述 */
    minerals: Recordstring, /** number 的描述 */
    /** number 的描述 */
    number;
}

export interface INutritionRecord {
  /** date 的描述 */
    date: Date;
  /** metrics 的描述 */
    metrics: {
    weight: number;
    bmi: number;
    bodyFat: number;
  };
  /** goals 的描述 */
    goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface ISupplement {
  /** name 的描述 */
    name: string;
  /** dosage 的描述 */
    dosage: number;
  /** unit 的描述 */
    unit: string;
  /** frequency 的描述 */
    frequency: string;
  /** timing 的描述 */
    timing: string;
}

export interface IMealSchedule {
  /** breakfast 的描述 */
    breakfast: ITimeRange;
  /** lunch 的描述 */
    lunch: ITimeRange;
  /** dinner 的描述 */
    dinner: ITimeRange;
  /** snacks 的描述 */
    snacks: ITimeRange;
}

export interface ITimeRange {
  /** start 的描述 */
    start: string;  /** HH 的描述 */
    /** HH 的描述 */
    HH:mm /** format 的描述 */
    /** format 的描述 */
    format
  /** end 的描述 */
    end: string;  /** HH 的描述 */
    /** HH 的描述 */
    HH:mm /** format 的描述 */
    /** format 的描述 */
    format
}

// 添加缺失的 KeyboardShortcut 接口
export interface IKeyboardShortcut {
  /** key 的描述 */
    key: string;
  /** ctrlKey 的描述 */
    ctrlKey: false | true;
  /** altKey 的描述 */
    altKey: false | true;
  /** shiftKey 的描述 */
    shiftKey: false | true;
  /** description 的描述 */
    description: string;
  /** action 的描述 */
    action:   void;
}

// 添加健康数据相关接口
export interface IHealthData {
  /** userId 的描述 */
    userId: string;
  /** timestamp 的描述 */
    timestamp: Date;
  /** nutritionData 的描述 */
    nutritionData: INutritionData;
  /** vitalSigns 的描述 */
    vitalSigns: IVitalSigns;
  /** activityData 的描述 */
    activityData: IActivityData;
  /** sleepData 的描述 */
    sleepData: ISleepData;
  /** mentalHealth 的描述 */
    mentalHealth: IMentalHealthData;
  /** medicalHistory 的描述 */
    medicalHistory: IMedicalRecord;
  /** medications 的描述 */
    medications: IMedication;
  /** allergies 的描述 */
    allergies: IAllergy;
}

export interface IVitalSigns {
  /** heartRate 的描述 */
    heartRate: number;
  /** bloodPressure 的描述 */
    bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  /** temperature 的描述 */
    temperature: number;
  /** respiratoryRate 的描述 */
    respiratoryRate: number;
  /** oxygenSaturation 的描述 */
    oxygenSaturation: number;
  /** timestamp 的描述 */
    timestamp: Date;
}

export interface IActivityData {
  /** steps 的描述 */
    steps: number;
  /** distance 的描述 */
    distance: number;
  /** caloriesBurned 的描述 */
    caloriesBurned: number;
  /** activeMinutes 的描述 */
    activeMinutes: number;
  /** exercises 的描述 */
    exercises: IExercise;
  /** heartRateZones 的描述 */
    heartRateZones: IHeartRateZone;
}

export interface IExercise {
  /** type 的描述 */
    type: string;
  /** duration 的描述 */
    duration: number;
  /** intensity 的描述 */
    intensity: string;
  /** caloriesBurned 的描述 */
    caloriesBurned: number;
  /** heartRateAvg 的描述 */
    heartRateAvg: number;
  /** timestamp 的描述 */
    timestamp: Date;
}

export interface IHeartRateZone {
  /** name 的描述 */
    name: string;
  /** min 的描述 */
    min: number;
  /** max 的描述 */
    max: number;
  /** duration 的描述 */
    duration: number;
}

export interface ISleepData {
  /** startTime 的描述 */
    startTime: Date;
  /** endTime 的描述 */
    endTime: Date;
  /** duration 的描述 */
    duration: number;
  /** quality 的描述 */
    quality: number;
  /** stages 的描述 */
    stages: ISleepStage;
  /** interruptions 的描述 */
    interruptions: number;
}

export interface ISleepStage {
  /** stage 的描述 */
    stage: light  deep  rem  awake;
  duration: number;
  startTime: Date;
}

export interface IMentalHealthData {
  /** mood 的描述 */
    mood: number;
  /** stressLevel 的描述 */
    stressLevel: number;
  /** anxiety 的描述 */
    anxiety: number;
  /** notes 的描述 */
    notes: string;
  /** timestamp 的描述 */
    timestamp: Date;
}

export interface IMedicalRecord {
  /** condition 的描述 */
    condition: string;
  /** diagnosisDate 的描述 */
    diagnosisDate: Date;
  /** status 的描述 */
    status: active  resolved  chronic;
  treatments: Treatment;
}

export interface ITreatment {
  /** type 的描述 */
    type: string;
  /** name 的描述 */
    name: string;
  /** startDate 的描述 */
    startDate: Date;
  /** endDate 的描述 */
    endDate: Date;
  /** frequency 的描述 */
    frequency: string;
  /** notes 的描述 */
    notes: string;
}

export interface IMedication {
  /** name 的描述 */
    name: string;
  /** dosage 的描述 */
    dosage: number;
  /** unit 的描述 */
    unit: string;
  /** frequency 的描述 */
    frequency: string;
  /** startDate 的描述 */
    startDate: Date;
  /** endDate 的描述 */
    endDate: Date;
  /** purpose 的描述 */
    purpose: string;
}

export interface IAllergy {
  /** allergen 的描述 */
    allergen: string;
  /** severity 的描述 */
    severity: mild  moderate  severe;
  symptoms: string;
  diagnosis: Date;
}
