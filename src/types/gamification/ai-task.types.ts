/**
 * @fileoverview TS 文件 ai-task.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// AI任务生成相关类型
export interface IUserHealthProfile {
   
  /** healthMetrics 的描述 */
    healthMetrics: {
    height: number;
    weight: number;
    bmi: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    bloodSugar: number;
  };

  // 运动能力评估
  /** fitnessLevel 的描述 */
    fitnessLevel: {
    endurance: number; // 耐力水平 1-10
    strength: number; // 力量水平 1-10
    flexibility: number; // 灵活度 1-10
    balance: number; // 平衡能力 1-10
  };

  // 饮食习惯
  /** dietaryHabits 的描述 */
    dietaryHabits: {
    preferences: string[];
    restrictions: string[];
    allergies: string[];
    mealPattern: string[];
  };

  // 健康状况
  /** healthConditions 的描述 */
    healthConditions: {
    chronicDiseases: string[];
    medications: string[];
    injuries: string[];
    recoveryStatus: string[];
  };

  // 生活方式
  /** lifestyle 的描述 */
    lifestyle: {
    sleepPattern: string;
    workSchedule: string;
    stressLevel: number;
    activityLevel: string;
  };
}

// AI生成的任务配置
export interface IAIGeneratedTask {
  /** id 的描述 */
    id: string;
  /** type 的描述 */
    type: health  fitness  diet  lifestyle;
  difficulty: number;  110
  baseReward: {
    exp: number;
    points: number;
  };
  adaptiveReward: {
    difficultyMultiplier: number;
    personalizedBonus: number;
  };
  requirements: {
    actions: string[];
    targets: number[];
    duration: number;
    frequency: string;
  };
  progressTracking: {
    milestones: number[];
    checkpoints: string[];
    adjustmentTriggers: string[];
  };
  supportFeatures: {
    guidance: string[];
    alternatives: string[];
    modifications: string[];
  };
}

// 任务调整建议
export interface ITaskAdjustmentSuggestion {
  /** taskId 的描述 */
    taskId: string;
  /** reason 的描述 */
    reason: string;
  /** adjustmentType 的描述 */
    adjustmentType: increase  decrease  modify  alternative;
  suggestedChanges: {
    difficulty: number;
    targets: number;
    duration: number;
    frequency: string;
  };
  expectedImpact: {
    healthBenefits: string[];
    riskFactors: string[];
    successRate: number;
  };
}
