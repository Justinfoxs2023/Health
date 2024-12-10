import { LocaleMessages } from '../services/i18n';

const zhCN = {
  common: {
    loading: '加载中...',
    error: '发生错误',
    success: '操作成功',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    more: '更多'
  },
  analysis: {
    error: '分析数据时发生错误',
    noData: '暂无数据可供分析',
    riskAssessment: '健康风险评估',
    riskLevel: {
      low: '低风险',
      medium: '中等风险',
      high: '高风险'
    },
    riskFactors: '风险因素',
    trendAnalysis: '健康趋势分析',
    trendType: {
      improving: '持续改善',
      stable: '保持稳定',
      worsening: '趋于恶化'
    },
    changeRate: '变化率',
    confidence: '置信度',
    actualValue: '实际值',
    predictedValue: '预测值',
    healthAdvice: '健康建议',
    seasonality: '季节性模式',
    pattern: {
      daily: '日周期',
      weekly: '周周期',
      monthly: '月周期'
    },
    outliers: '异常值',
    deviation: '偏离度',
    chart: {
      trend: '趋势图',
      scatter: '散点图',
      distribution: '分布图',
      radar: '雷达图'
    },
    distribution: '数值分布',
    dimensionScore: '维度得分'
  },
  advice: {
    title: '个性化健康建议',
    error: '获取健康建议时发生错误',
    noData: '暂无数据可提供建议',
    priority: '优先级',
    comprehensive: '综合建议',
    comprehensiveTitle: '生活方式改善建议',
    lifestyle: '保持规律的作息时间',
    exercise: '每周进行适量有氧运动',
    diet: '注意饮食均衡,控制盐分摄入',
    sleep: '保证充足的睡眠时间',
    stress: '学会调节压力,保持心情愉悦',
    category: {
      immediate: '立即行动',
      short_term: '近期改善',
      long_term: '长期保持'
    },
    confidence: '建议可信度',
    impact: '影响程度',
    impact: {
      high: '高',
      medium: '中',
      low: '低'
    }
  },
  healthData: {
    type: {
      BLOOD_PRESSURE: '血压',
      HEART_RATE: '心率',
      BLOOD_SUGAR: '血糖',
      BODY_TEMPERATURE: '体温',
      WEIGHT: '体重',
      HEIGHT: '身高',
      STEPS: '步数',
      SLEEP: '睡眠',
      OXYGEN: '血氧'
    }
  },
  validation: {
    required: '此项为必填项',
    invalid: '输入无效',
    minLength: '最少需要 {min} 个字符',
    maxLength: '最多允许 {max} 个字符',
    min: '不能小于 {min}',
    max: '不能大于 {max}'
  },
  auth: {
    login: '登录',
    logout: '退出登录',
    register: '注册',
    forgotPassword: '忘记密码',
    username: '用户名',
    password: '密码',
    email: '邮箱',
    rememberMe: '记住我',
    loginSuccess: '登录成功',
    loginError: '登录失败',
    logoutSuccess: '退出成功',
    registerSuccess: '注册成功',
    registerError: '注册失败'
  },
  settings: {
    title: '设置',
    theme: {
      title: '主题设置',
      light: '浅色',
      dark: '深色',
      system: '跟随系统'
    },
    language: {
      title: '语言设置',
      zh: '中文',
      en: '英文'
    },
    notification: {
      title: '通知设置',
      enable: '启用通知',
      sound: '声音提醒',
      vibrate: '振动提醒'
    },
    privacy: {
      title: '隐私设置',
      dataSharing: '数据共享',
      analytics: '使用分析'
    }
  },
  error: {
    network: '网络错误',
    server: '服务器错误',
    unauthorized: '未授权访问',
    forbidden: '禁止访问',
    notFound: '资源不存在',
    timeout: '请求超时',
    unknown: '未知错误'
  }
};

export default zhCN; 