/**
 * @fileoverview TS 文件 ai-settings.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare namespace AI {
  // AI模型配置
  interface ModelConfig {
    modelName: string;
    version: string;
    parameters: {
      temperature: number;
      maxTokens: number;
      topP: number;
      frequencyPenalty: number;
      presencePenalty: number;
    };
  }

  // AI服务配置
  interface ServiceConfig {
    endpoint: string;
    apiKey: string;
    timeout: number;
    retryAttempts: number;
    rateLimits: {
      requestsPerMinute: number;
      tokensPerMinute: number;
    };
  }

  // AI功能配置
  interface FeatureConfig {
    codeReview: {
      enabled: boolean;
      maxFileSize: number;
      excludedFiles: string;
      priorityRules: string;
    };
    testGeneration: {
      enabled: boolean;
      framework: 'jest' | 'mocha';
      coverage: {
        statements: number;
        branches: number;
        functions: number;
        lines: number;
      };
    };
    assistanceConfig: {
      enabled: boolean;
      responseFormat: 'markdown' | 'plain';
      contextWindow: number;
      maxResponseTime: number;
    };
  }

  // 开发助手配置
  interface DevAssistantConfig {
    model: ModelConfig;
    service: ServiceConfig;
    features: FeatureConfig;
  }
}
