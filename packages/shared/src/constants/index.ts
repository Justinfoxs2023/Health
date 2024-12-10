/** API 配置 */
export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  VERSION: 'v1',
};

/** 分页配置 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/** 文件上传配置 */
export const UPLOAD_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILES: 5,
};

/** 本地存储键名 */
export const STORAGE_KEYS = {
  /** 主题模式 */
  THEME: 'theme',
  /** 语言设置 */
  LANGUAGE: 'language',
  /** 用户信息 */
  USER: 'user',
  /** 访问令牌 */
  TOKEN: 'token',
  /** 刷新令牌 */
  REFRESH_TOKEN: 'refresh_token'
} as const;

/** 主题配置 */
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

/** 语言配置 */
export const LANGUAGE = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
};

/** 响应状态码 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

/** 健康数据阈值 */
export const HEALTH_THRESHOLDS = {
  BLOOD_PRESSURE: {
    SYSTOLIC: {
      MIN: 90,
      MAX: 140,
    },
    DIASTOLIC: {
      MIN: 60,
      MAX: 90,
    },
  },
  HEART_RATE: {
    MIN: 60,
    MAX: 100,
  },
  BLOOD_SUGAR: {
    FASTING: {
      MIN: 3.9,
      MAX: 6.1,
    },
    AFTER_MEAL: {
      MIN: 3.9,
      MAX: 7.8,
    },
  },
  BODY_TEMPERATURE: {
    MIN: 36.3,
    MAX: 37.2,
  },
  BMI: {
    UNDERWEIGHT: 18.5,
    NORMAL_MIN: 18.5,
    NORMAL_MAX: 24.9,
    OVERWEIGHT: 29.9,
    OBESE: 30,
  },
};

/** 正则表达式 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_CN: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  ID_CARD: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
};

/** 时间格式 */
export const DATE_FORMAT = {
  FULL: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
};

/** 文件大小单位 */
export const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

/** 性别 */
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

/** 血型 */
export const BLOOD_TYPE = {
  A: 'A',
  B: 'B',
  O: 'O',
  AB: 'AB',
};

/** RH血型 */
export const RH_TYPE = {
  POSITIVE: '+',
  NEGATIVE: '-',
}; 