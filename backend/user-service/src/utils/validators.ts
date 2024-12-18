import Joi from 'joi';

export const userValidators = {
  // 用户注册验证
  registerSchema: Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      'string.min': '用户名至少3个字符',
      'string.max': '用户名最多30个字符',
      'any.required': '用户名是必填项',
    }),

    email: Joi.string().email().required().messages({
      'string.email': '邮箱格式不正确',
      'any.required': '邮箱是必填项',
    }),

    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .required()
      .messages({
        'string.pattern.base': '密码必须包含大小写字母和数字，且至少8位',
        'any.required': '密码是必填项',
      }),

    phone: Joi.string()
      .pattern(/^1[3-9]\d{9}$/)
      .optional()
      .messages({
        'string.pattern.base': '手机号格式不正确',
      }),
  }),

  // 用户登录验证
  loginSchema: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': '邮箱格式不正确',
      'any.required': '邮箱是必填项',
    }),

    password: Joi.string().required().messages({
      'any.required': '密码是必填项',
    }),
  }),

  // 用户信息更新验证
  updateSchema: Joi.object({
    username: Joi.string().min(3).max(30).optional(),

    phone: Joi.string()
      .pattern(/^1[3-9]\d{9}$/)
      .optional(),

    profile: Joi.object({
      name: Joi.string().optional(),
      gender: Joi.string().valid('male', 'female', 'other').optional(),
      birthDate: Joi.date().optional(),
      height: Joi.number().min(0).max(300).optional(),
      weight: Joi.number().min(0).max(500).optional(),
    }).optional(),
  }),
};

export const validateUserUpdate = (data: any) => {
  const schema = Joi.object({
    // 定义验证规则
  });

  return schema.validate(data);
};

// 登录验证
export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// OAuth验证
export const validateOAuth = (data: any) => {
  const schema = Joi.object({
    platform: Joi.string().valid('google', 'wechat').required(),
    code: Joi.string().required(),
  });
  return schema.validate(data);
};

// 用户更新验证
export const validateUserUpdate = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{11}$/),
    avatar: Joi.string().uri(),
  });
  return schema.validate(data);
};
