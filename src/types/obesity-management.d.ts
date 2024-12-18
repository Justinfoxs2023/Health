/**
 * @fileoverview TS 文件 obesity-management.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 肥胖管理系统
export interface IObesityManagement {
  /** id 的描述 */
  id: string;
  /** userId 的描述 */
  userId: string;

  /** weightManagement 的描述 */
  weightManagement: {
    currentStats: IBodyStats;
    targetStats: IBodyStats;
    weightHistory: WeightRecord;
    bmiHistory: BMIRecord;
  };

  // 代谢指标
  /** metabolicMetrics 的描述 */
  metabolicMetrics: {
    basalMetabolicRate: number;
    metabolicAge: number;
    bodyComposition: BodyComposition;
    metabolicHealth: IMetabolicHealthMarkers;
  };

  // 干预计划
  /** interventionPlan 的描述 */
  interventionPlan: {
    dietaryPlan: DietPlan;
    exercisePlan: ExercisePlan;
    behavioralTherapy: BehavioralPlan;
    medicalSupport?: MedicalIntervention;
  };

  // 进度追踪
  /** progressTracking 的描述 */
  progressTracking: {
    weightMilestones: Milestone[];
    habitChanges: HabitChange[];
    healthImprovements: HealthImprovement[];
    challenges: Challenge[];
  };
}

// 身体统计
export interface IBodyStats {
  /** weight 的描述 */
  weight: number;
  /** height 的描述 */
  height: number;
  /** bmi 的描述 */
  bmi: number;
  /** bodyFatPercentage 的描述 */
  bodyFatPercentage: number;
  /** waistCircumference 的描述 */
  waistCircumference: number;
  /** hipCircumference 的描述 */
  hipCircumference: number;
  /** waistHipRatio 的描述 */
  waistHipRatio: number;
}

// 代谢健康标记
export interface IMetabolicHealthMarkers {
  /** bloodPressure 的描述 */
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  /** bloodSugar 的描述 */
  bloodSugar: {
    fasting: number;
    postprandial: number;
  };
  /** cholesterol 的描述 */
  cholesterol: {
    total: number;
    hdl: number;
    ldl: number;
    triglycerides: number;
  };
  /** insulinResistance 的描述 */
  insulinResistance?: undefined | number;
}
