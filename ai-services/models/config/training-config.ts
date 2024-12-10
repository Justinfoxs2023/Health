/**
 * 基础训练配置接口
 */
export interface BaseTrainingConfig {
  epochs: number;
  batchSize: number;
  validationSplit: number;
  learningRate: number;
  modelArchitecture: {
    hiddenLayers: number[];
    dropout: number;
  };
}

/**
 * 生命体征模型配置
 */
export const vitalSignsConfig: BaseTrainingConfig = {
  epochs: 100,
  batchSize: 32,
  validationSplit: 0.2,
  learningRate: 0.001,
  modelArchitecture: {
    hiddenLayers: [64, 32, 16],
    dropout: 0.2
  }
};

/**
 * 生活方式模型配置
 */
export const lifestyleConfig: BaseTrainingConfig = {
  epochs: 100,
  batchSize: 32,
  validationSplit: 0.2,
  learningRate: 0.001,
  modelArchitecture: {
    hiddenLayers: [128, 64, 32],
    dropout: 0.3
  }
};

/**
 * 数据预处理配置
 */
export const dataProcessingConfig = {
  normalization: {
    method: 'min-max' as const,
    ranges: {
      // 生命体征
      'physicalData.height': { min: 0, max: 300 },
      'physicalData.weight': { min: 0, max: 500 },
      'physicalData.bloodPressure.systolic': { min: 70, max: 200 },
      'physicalData.bloodPressure.diastolic': { min: 40, max: 130 },
      'physicalData.heartRate': { min: 40, max: 200 },
      'physicalData.bodyTemperature': { min: 35, max: 42 },
      'physicalData.bloodOxygen': { min: 80, max: 100 },
      
      // 心理数据
      'mentalData.stressLevel': { min: 0, max: 10 },
      'mentalData.moodScore': { min: 0, max: 10 },
      'mentalData.sleepQuality': { min: 0, max: 10 },
      
      // 营养数据
      'nutritionData.calorieIntake': { min: 1000, max: 3000 },
      'nutritionData.waterIntake': { min: 1000, max: 4000 },
      
      // 生活方式数据
      'lifestyleData.sleepHours': { min: 4, max: 12 },
      'lifestyleData.activityLevel': { min: 0, max: 10 }
    }
  },
  validation: {
    requiredFields: [
      'physicalData',
      'mentalData',
      'nutritionData',
      'lifestyleData'
    ]
  },
  featureEngineering: {
    derivedFeatures: {
      bmi: (data: any) => {
        const height = data.physicalData.height / 100; // 转换为米
        return data.physicalData.weight / (height * height);
      },
      pulseRate: (data: any) => {
        return data.physicalData.heartRate * data.physicalData.bloodOxygen / 100;
      },
      stressIndex: (data: any) => {
        return (data.mentalData.stressLevel * 10 + 
                (10 - data.mentalData.moodScore) * 5 + 
                (10 - data.mentalData.sleepQuality) * 3) / 18;
      },
      activityIndex: (data: any) => {
        const activities = data.lifestyleData.activities;
        if (!activities.length) return 0;
        return activities.reduce((sum: number, act: any) => 
          sum + act.duration * act.intensity, 0) / activities.length;
      },
      nutritionBalance: (data: any) => {
        const meals = data.nutritionData.meals;
        if (!meals.length) return 0;
        const totalCalories = meals.reduce((sum: number, meal: any) => 
          sum + meal.items.reduce((mealSum: number, item: any) => 
            mealSum + item.calories, 0), 0);
        return Math.min(1, totalCalories / data.nutritionData.calorieIntake);
      }
    },
    featureSelection: {
      method: 'correlation',
      threshold: 0.3
    }
  }
};

/**
 * 模型评估配置
 */
export const evaluationConfig = {
  metrics: [
    'accuracy',
    'precision',
    'recall',
    'f1Score'
  ],
  thresholds: {
    accuracy: 0.8,
    loss: 0.2
  },
  crossValidation: {
    folds: 5,
    shuffle: true
  }
};

/**
 * 训练数据配置
 */
export const dataConfig = {
  trainTestSplit: 0.8,
  shuffle: true,
  seed: 42,
  augmentation: {
    enabled: true,
    methods: [
      'noise',
      'scaling',
      'rotation'
    ],
    noiseLevel: 0.05
  },
  balancing: {
    enabled: true,
    method: 'smote',
    targetRatio: 1.0
  }
}; 