export const Illustrations = {
  // 空状态插图
  empty: {
    noData: require('./empty/no-data.svg'),
    noConnection: require('./empty/no-connection.svg'),
    noResults: require('./empty/no-results.svg')
  },

  // 成功状态插图
  success: {
    completed: require('./success/completed.svg'),
    achieved: require('./success/achieved.svg'),
    verified: require('./success/verified.svg')
  },

  // 错误状态插图
  error: {
    failed: require('./error/failed.svg'),
    notFound: require('./error/not-found.svg'),
    serverError: require('./error/server-error.svg')
  },

  // 健康相关插图
  health: {
    exercise: require('./health/exercise.svg'),
    nutrition: require('./health/nutrition.svg'),
    meditation: require('./health/meditation.svg'),
    sleep: require('./health/sleep.svg')
  }
};

// 插图尺寸预设
export const IllustrationSizes = {
  small: {
    width: 120,
    height: 120
  },
  medium: {
    width: 200,
    height: 200
  },
  large: {
    width: 300,
    height: 300
  }
}; 