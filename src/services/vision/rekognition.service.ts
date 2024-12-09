import AWS from 'aws-sdk';
import { visionConfig } from '../../config/vision.config';
import { Logger } from '../../utils/logger';
import { DeepseekService } from '../ai/deepseek.service';
import { RedisConfig } from '../../config/redis.config';
import { RekognitionClient, DetectLabelsCommand, DetectTextCommand, DetectFacesCommand, RecognizeCelebritiesCommand } from '@aws-sdk/client-rekognition';
import { ImageProcessorService } from './image-processor.service';

export class RekognitionService {
  private rekognition: RekognitionClient;
  private s3: AWS.S3;
  private logger: Logger;
  private deepseek: DeepseekService;
  private redis: RedisConfig;
  private imageProcessor: ImageProcessorService;

  constructor() {
    this.logger = new Logger('Rekognition');
    
    // 配置AWS服务
    AWS.config.update({
      region: visionConfig.aws.region,
      credentials: new AWS.Credentials(
        visionConfig.aws.credentials.accessKeyId,
        visionConfig.aws.credentials.secretAccessKey
      )
    });

    this.rekognition = new RekognitionClient({});
    this.s3 = new AWS.S3();
    this.deepseek = new DeepseekService();
  }

  // 上传图片到S3
  async uploadToS3(imageBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const params = {
        Bucket: visionConfig.aws.s3.bucket,
        Key: `images/${fileName}`,
        Body: imageBuffer,
        ACL: visionConfig.aws.s3.acl
      };

      const result = await this.s3.upload(params).promise();
      return result.Key;
    } catch (error) {
      this.logger.error('上传图片到S3失败:', error);
      throw error;
    }
  }

  // 分析图片标签
  async detectLabels(imageKey: string): Promise<AWS.Rekognition.DetectLabelsResponse> {
    try {
      const params = {
        Image: {
          S3Object: {
            Bucket: visionConfig.aws.s3.bucket,
            Name: imageKey
          }
        },
        MaxLabels: visionConfig.rekognition.maxLabels,
        MinConfidence: visionConfig.rekognition.minConfidence
      };

      return await this.rekognition.send(new DetectLabelsCommand(params));
    } catch (error) {
      this.logger.error('检测图片标签失败:', error);
      throw error;
    }
  }

  // 分析食物图片
  async analyzeFoodImage(imageKey: string, userId: string) {
    try {
      const cacheKey = `food_analysis:${imageKey}`;
      const cached = await this.redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      // 获取图片标签
      const labels = await this.detectLabels(imageKey);
      
      // 判断是否为食物图片
      const foodLabels = labels.Labels.filter(label => 
        visionConfig.analysis.food.requiredLabels.includes(label.Name) &&
        label.Confidence >= visionConfig.analysis.food.minConfidence
      );

      if (foodLabels.length === 0) {
        throw new Error('未检测到食物');
      }

      // 使用DeepSeek分析食物营养
      const analysis = await this.deepseek.generateFoodAnalysis({
        labels: foodLabels,
        userId,
        imageKey
      });

      // 缓存结果
      await this.redis.setex(cacheKey, 3600, JSON.stringify(analysis));

      return analysis;
    } catch (error) {
      this.logger.error('分析食物图片失败:', error);
      throw error;
    }
  }

  // 分析运动姿势
  async analyzeExercisePose(imageKey: string, userId: string) {
    try {
      const cacheKey = `exercise_analysis:${imageKey}`;
      const cached = await this.redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      // 获取图片标签和姿势信息
      const [labels, poses] = await Promise.all([
        this.detectLabels(imageKey),
        this.rekognition.send(new DetectCustomLabelsCommand({
          Image: {
            S3Object: {
              Bucket: visionConfig.aws.s3.bucket,
              Name: imageKey
            }
          },
          MinConfidence: visionConfig.analysis.exercise.minConfidence,
          ProjectVersionArn: process.env.AWS_REKOGNITION_EXERCISE_MODEL
        })).promise()
      ]);

      // 使用DeepSeek分析运动姿势
      const analysis = await this.deepseek.generateExerciseAnalysis({
        labels: labels.Labels,
        poses: poses.CustomLabels,
        userId,
        imageKey
      });

      // 缓存结果
      await this.redis.setex(cacheKey, 3600, JSON.stringify(analysis));

      return analysis;
    } catch (error) {
      this.logger.error('分析运动姿势失败:', error);
      throw error;
    }
  }

  // 实时姿势分析
  async analyzePostureStream(videoStream: ReadableStream) {
    try {
      const frames = await this.extractFrames(videoStream);
      let lastAnalysis = null;
      
      for (const frame of frames) {
        const analysis = await this.analyzeExercisePose(frame, 'stream');
        
        // 对比前后帧分析结果
        if (lastAnalysis) {
          const postureDiff = this.comparePostures(lastAnalysis, analysis);
          if (postureDiff.significant) {
            await this.notifyPostureChange(postureDiff);
          }
        }
        
        lastAnalysis = analysis;
      }
    } catch (error) {
      this.logger.error('实时姿势分析失败:', error);
      throw error;
    }
  }

  // 营养成分分析
  async analyzeNutrition(imageKey: string) {
    try {
      const [labels, text] = await Promise.all([
        this.detectLabels(imageKey),
        this.detectText(imageKey)
      ]);

      // 使用DeepSeek分析营养成分
      const nutritionInfo = await this.deepseek.analyzeNutrition({
        labels: labels.Labels,
        text: text.TextDetections,
        imageContext: {
          type: 'food',
          confidence: visionConfig.analysis.food.minConfidence
        }
      });

      return {
        nutrition: nutritionInfo,
        ingredients: this.extractIngredients(text.TextDetections),
        allergens: this.detectAllergens(labels.Labels),
        portionSize: this.estimatePortionSize(labels.Labels)
      };
    } catch (error) {
      this.logger.error('营养成分分析失败:', error);
      throw error;
    }
  }

  // 健身器材识别
  async analyzeGymEquipment(imageKey: string) {
    try {
      const labels = await this.detectLabels(imageKey);
      
      const equipmentLabels = labels.Labels.filter(label => 
        visionConfig.analysis.equipment.requiredLabels.includes(label.Name) &&
        label.Confidence >= visionConfig.analysis.equipment.minConfidence
      );

      if (equipmentLabels.length === 0) {
        throw new Error('未检测到健身器材');
      }

      // 使用DeepSeek分析器材使用方法
      const equipmentAnalysis = await this.deepseek.analyzeEquipment({
        labels: equipmentLabels,
        context: {
          type: 'gym_equipment',
          purpose: 'usage_guide'
        }
      });

      return {
        equipment: equipmentLabels,
        usageGuide: equipmentAnalysis.usage,
        safetyTips: equipmentAnalysis.safety,
        targetMuscles: equipmentAnalysis.muscles
      };
    } catch (error) {
      this.logger.error('健身器材分析失败:', error);
      throw error;
    }
  }

  // 运动强度评估
  async analyzeExerciseIntensity(imageKey: string, userId: string) {
    try {
      const [labels, faces] = await Promise.all([
        this.detectLabels(imageKey),
        this.detectFaces(imageKey)
      ]);

      // 分析运动强度指标
      const intensityFactors = {
        movement: this.analyzeMovementIntensity(labels.Labels),
        posture: this.analyzePostureComplexity(labels.Labels),
        expression: this.analyzeExpressionIntensity(faces.FaceDetails)
      };

      // 使用DeepSeek生成强度评估
      const intensityAnalysis = await this.deepseek.analyzeExerciseIntensity({
        factors: intensityFactors,
        userId,
        context: {
          type: 'exercise_intensity',
          userProfile: await this.getUserFitnessProfile(userId)
        }
      });

      return {
        intensity: intensityAnalysis.level,
        metrics: intensityAnalysis.metrics,
        recommendations: intensityAnalysis.recommendations,
        cautions: intensityAnalysis.cautions
      };
    } catch (error) {
      this.logger.error('运动强度评估失败:', error);
      throw error;
    }
  }

  // 批量分析图片
  async batchAnalyze(images: Array<{key: string, type: string, userId: string}>) {
    try {
      return await Promise.all(
        images.map(async img => {
          switch (img.type) {
            case 'food':
              return await this.analyzeFoodImage(img.key, img.userId);
            case 'exercise':
              return await this.analyzeExercisePose(img.key, img.userId);
            case 'equipment':
              return await this.analyzeGymEquipment(img.key);
            case 'intensity':
              return await this.analyzeExerciseIntensity(img.key, img.userId);
            default:
              throw new Error(`不支持的分析类型: ${img.type}`);
          }
        })
      );
    } catch (error) {
      this.logger.error('批量分析失败:', error);
      throw error;
    }
  }
} 