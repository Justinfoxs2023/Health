import { Logger } from '../utils/logger';
import AWS from 'aws-sdk';

const logger = new Logger('VisionConfig');

export const visionConfig = {
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      acl: 'private'
    }
  },
  
  rekognition: {
    minConfidence: 75,
    maxLabels: 20
  },

  // 图像分析配置
  analysis: {
    // 食品识别
    food: {
      requiredLabels: ['Food', 'Meal', 'Dish'],
      nutritionDb: 'nutrition_database',
      minConfidence: 80
    },
    
    // 运动姿势识别
    exercise: {
      requiredLabels: ['Person', 'Sport', 'Exercise'],
      poseDb: 'exercise_poses',
      minConfidence: 85
    },

    // 医疗相关识别
    medical: {
      requiredLabels: ['Medical', 'Healthcare'],
      medicalDb: 'medical_conditions',
      minConfidence: 90
    },

    // 健身器材识别
    equipment: {
      requiredLabels: ['Sports Equipment', 'Exercise Equipment', 'Gym'],
      minConfidence: 85,
      equipmentDb: 'gym_equipment_database'
    },

    // 运动强度评估
    intensity: {
      factors: ['movement', 'posture', 'expression'],
      minConfidence: 80,
      intensityLevels: ['low', 'moderate', 'high', 'extreme']
    },

    // 实时分析
    realtime: {
      frameRate: 10,
      batchSize: 5,
      significantChangeTreshold: 0.2
    }
  },

  // 批处理配置
  batch: {
    maxBatchSize: 10,
    concurrency: 3,
    retryAttempts: 3
  },

  preprocessing: {
    defaultResize: {
      width: 800,
      height: 600
    },
    defaultEnhance: {
      brightness: 1.1,
      contrast: 1.1
    },
    denoise: {
      sigma: 1.0
    }
  }
}; 