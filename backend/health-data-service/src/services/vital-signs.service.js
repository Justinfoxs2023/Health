const VitalSigns = require('../models/vital-signs.model');
const NotificationService = require('./notification.service');
const AnalyticsService = require('./analytics.service');
const CacheService = require('./cache.service');
const { ValidationError } = require('../utils/errors');

class VitalSignsService {
  constructor() {
    this.notificationService = new NotificationService();
    this.analyticsService = new AnalyticsService();
    this.cache = new CacheService();
  }

  /**
   * 创建生命体征记录
   * @param {Object} vitalData - 生命体征数据
   * @returns {Promise<Object>} 创建的记录
   */
  async createRecord(vitalData) {
    if (!vitalData || !vitalData.userId) {
      throw new ValidationError('Invalid vital data');
    }

    const record = new VitalSigns(vitalData);
    await record.save();
    
    await this.analyticsService.analyzeVitalSigns(record);
    
    return record;
  }

  /**
   * 获取阈值配置
   * @private
   */
  async getThresholds(type) {
    // 添加缓存机制
    const cacheKey = `thresholds:${type}`;
    let thresholds = await this.cache.get(cacheKey);
    
    if (!thresholds) {
      thresholds = await VitalSigns.getThresholds(type);
      await this.cache.set(cacheKey, thresholds, 3600);
    }
    
    return thresholds;
  }
}

module.exports = VitalSignsService; 