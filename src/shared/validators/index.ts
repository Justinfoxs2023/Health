import * as Joi from 'joi';

export class Validators {
  // 通用ID验证
  static id = Joi.string().required();

  // 分页参数验证
  static pagination = Joi.object({
    page: Joi.number().min(1).default(1),
    pageSize: Joi.number().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  });

  // 时间范围验证
  static dateRange = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required(),
  });

  // 用户信息验证
  static userInfo = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
  });

  // 健康数据验证
  static healthData = Joi.object({
    userId: Joi.string().required(),
    type: Joi.string().required(),
    value: Joi.number().required(),
    unit: Joi.string().required(),
    timestamp: Joi.date().default(Date.now),
  });
}
