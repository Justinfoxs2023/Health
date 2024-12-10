// 肥胖管理系统
export interface ObesityManagement {
  id: string;
  userId: string;
  
  // 体重管理
  weightManagement: {
    currentStats: BodyStats;
    targetStats: BodyStats;
    weightHistory: WeightRecord[];
    bmiHistory: BMIRecord[];
  };
  
  // 代谢指标
  metabolicMetrics: {
    basalMetabolicRate: number;
    metabolicAge: number;
    bodyComposition: BodyComposition;
    metabolicHealth: MetabolicHealthMarkers;
  };
  
  // 干预计划
  interventionPlan: {
    dietaryPlan: DietPlan;
    exercisePlan: ExercisePlan;
    behavioralTherapy: BehavioralPlan;
    medicalSupport?: MedicalIntervention;
  };
  
  // 进度追踪
  progressTracking: {
    weightMilestones: Milestone[];
    habitChanges: HabitChange[];
    healthImprovements: HealthImprovement[];
    challenges: Challenge[];
  };
}

// 身体统计
export interface BodyStats {
  weight: number;
  height: number;
  bmi: number;
  bodyFatPercentage: number;
  waistCircumference: number;
  hipCircumference: number;
  waistHipRatio: number;
}

// 代谢健康标记
export interface MetabolicHealthMarkers {
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bloodSugar: {
    fasting: number;
    postprandial: number;
  };
  cholesterol: {
    total: number;
    hdl: number;
    ldl: number;
    triglycerides: number;
  };
  insulinResistance?: number;
} 