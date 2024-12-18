import {
  INutritionData,
  IHealthData,
  IVitalSigns,
  IActivityData,
  ISleepData,
  IMentalHealthData,
  IExercise,
  IHeartRateZone,
  ISleepStage,
} from '../types';
// 生成营养数据

export function generateMockNutritionData(): INutritionData {
  return {
    calorieIntake: 2000,
    waterIntake: 2000,
    proteinIntake: 60,
    carbIntake: 250,
    fatIntake: 70,
    meals: [],
    nutritionHistory: [],
    dietaryRestrictions: [],
    supplements: [],
    mealSchedule: {
      breakfast: { start: '07:00', end: '09:00' },
      lunch: { start: '12:00', end: '14:00' },
      dinner: { start: '18:00', end: '20:00' },
      snacks: [],
    },
  };
}

// 生成生命体征数据
function generateMockVitalSigns(): IVitalSigns {
  return {
    heartRate: 75,
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
    },
    temperature: 36.5,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    timestamp: new Date(),
  };
}

// 生成活动数据
function generateMockActivityData(): IActivityData {
  return {
    steps: 8000,
    distance: 6.5,
    caloriesBurned: 400,
    activeMinutes: 45,
    exercises: generateMockExercises(),
    heartRateZones: generateMockHeartRateZones(),
  };
}

// 生成运动数据
function generateMockExercises(): IExercise[] {
  return [
    {
      type: '步行',
      duration: 30,
      intensity: 'moderate',
      caloriesBurned: 150,
      heartRateAvg: 95,
      timestamp: new Date(),
    },
  ];
}

// 生成心率区间数据
function generateMockHeartRateZones(): IHeartRateZone[] {
  return [
    {
      name: '休息',
      min: 60,
      max: 80,
      duration: 120,
    },
    {
      name: '燃脂',
      min: 80,
      max: 120,
      duration: 45,
    },
  ];
}

// 生成睡眠数据
function generateMockSleepData(): ISleepData {
  return {
    startTime: new Date(new Date().setHours(22, 0)),
    endTime: new Date(new Date().setHours(6, 0)),
    duration: 480, // 8小时
    quality: 85,
    stages: generateMockSleepStages(),
    interruptions: 2,
  };
}

// 生成睡眠阶段数据
function generateMockSleepStages(): ISleepStage[] {
  return [
    {
      stage: 'light',
      duration: 240,
      startTime: new Date(),
    },
    {
      stage: 'deep',
      duration: 120,
      startTime: new Date(),
    },
    {
      stage: 'rem',
      duration: 120,
      startTime: new Date(),
    },
  ];
}

// 生成心理健康数据
function generateMockMentalHealth(): IMentalHealthData {
  return {
    mood: 8,
    stressLevel: 3,
    anxiety: 2,
    notes: '今天心情不错',
    timestamp: new Date(),
  };
}

// 生成完整的健康数据
export function generateMockHealthData(): IHealthData {
  return {
    userId: 'test-user',
    timestamp: new Date(),
    nutritionData: generateMockNutritionData(),
    vitalSigns: generateMockVitalSigns(),
    activityData: generateMockActivityData(),
    sleepData: generateMockSleepData(),
    mentalHealth: generateMockMentalHealth(),
    medicalHistory: [],
    medications: [],
    allergies: [],
  };
}
