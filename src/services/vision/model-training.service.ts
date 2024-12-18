import { Logger } from '../../utils/logger';
import { S3 } from '@aws-sdk/client-s3';
import { SageMaker } from '@aws-sdk/client-sagemaker';

export class ModelTrainingService {
  private s3: S3;
  private sagemaker: SageMaker;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('ModelTraining');
    this.s3 = new S3({});
    this.sagemaker = new SageMaker({});
  }

  // 创建训练任务
  async createTrainingJob(params: {
    modelType: string;
    datasetS3Uri: string;
    hyperparameters: any;
    instanceType: string;
  }) {
    try {
      const trainingJobName = `${params.modelType}-${Date.now()}`;

      await this.sagemaker.createTrainingJob({
        TrainingJobName: trainingJobName,
        AlgorithmSpecification: {
          TrainingImage: this.getTrainingImage(params.modelType),
          TrainingInputMode: 'File',
        },
        RoleArn: process.env.AWS_SAGEMAKER_ROLE_ARN,
        InputDataConfig: [
          {
            ChannelName: 'training',
            DataSource: {
              S3DataSource: {
                S3DataType: 'S3Prefix',
                S3Uri: params.datasetS3Uri,
              },
            },
          },
        ],
        OutputDataConfig: {
          S3OutputPath: `s3://${process.env.AWS_S3_BUCKET}/models/`,
        },
        ResourceConfig: {
          InstanceType: params.instanceType,
          InstanceCount: 1,
          VolumeSizeInGB: 50,
        },
        HyperParameters: params.hyperparameters,
        StoppingCondition: {
          MaxRuntimeInSeconds: 86400,
        },
      });

      return trainingJobName;
    } catch (error) {
      this.logger.error('创建训练任务失败:', error);
      throw error;
    }
  }

  // 监控训练进度
  async getTrainingStatus(trainingJobName: string) {
    try {
      const response = await this.sagemaker.describeTrainingJob({
        TrainingJobName: trainingJobName,
      });

      return {
        status: response.TrainingJobStatus,
        metrics: response.FinalMetricDataList,
        modelArtifacts: response.ModelArtifacts,
      };
    } catch (error) {
      this.logger.error('获取训练状态失败:', error);
      throw error;
    }
  }

  // 部署模型
  async deployModel(modelArtifacts: string, modelName: string) {
    try {
      // 创建模型
      await this.sagemaker.createModel({
        ModelName: modelName,
        PrimaryContainer: {
          Image: this.getInferenceImage(modelName),
          ModelDataUrl: modelArtifacts,
        },
        ExecutionRoleArn: process.env.AWS_SAGEMAKER_ROLE_ARN,
      });

      // 创建端点配置
      await this.sagemaker.createEndpointConfig({
        EndpointConfigName: `${modelName}-config`,
        ProductionVariants: [
          {
            VariantName: 'AllTraffic',
            ModelName: modelName,
            InitialInstanceCount: 1,
            InstanceType: 'ml.t2.medium',
          },
        ],
      });

      // 创建端点
      await this.sagemaker.createEndpoint({
        EndpointName: `${modelName}-endpoint`,
        EndpointConfigName: `${modelName}-config`,
      });

      return `${modelName}-endpoint`;
    } catch (error) {
      this.logger.error('部署模型失败:', error);
      throw error;
    }
  }
}
