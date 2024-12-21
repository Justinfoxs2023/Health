/**
 * @fileoverview TS 文件 errors.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export class AIError extends Error {
  public status: number;
  public code: string;

  constructor(message: string, status = 500, code = 'AI_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ModelNotFoundError extends AIError {
  constructor(modelName: string) {
    super(`AI模型 ${modelName} 未找到`, 404, 'MODEL_NOT_FOUND');
  }
}

export class PredictionError extends AIError {
  constructor(message: string) {
    super(message, 500, 'PREDICTION_ERROR');
  }
}

export class TrainingError extends AIError {
  constructor(message: string) {
    super(message, 500, 'TRAINING_ERROR');
  }
}
