const VitalSignsService = require('../services/vital-signs.service');
const { validateVitalSigns } = require('../utils/validators');

class VitalSignsController {
  constructor() {
    this.vitalSignsService = new VitalSignsService();
  }

  async recordVitalSigns(req, res) {
    try {
      const { error } = validateVitalSigns(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const userId = req.user.id;
      const vitalData = {
        ...req.body,
        userId,
        timestamp: new Date()
      };

      const record = await this.vitalSignsService.createRecord(vitalData);
      
      // 检查是否需要发出健康警告
      const warnings = await this.vitalSignsService.checkHealthWarnings(record);
      if (warnings.length > 0) {
        // 发送警告通知
        await this.vitalSignsService.sendWarningNotifications(warnings);
      }

      res.status(201).json({
        message: '记录成功',
        data: record,
        warnings
      });
    } catch (error) {
      res.status(500).json({ error: '服务器错误' });
    }
  }

  async getVitalSignsHistory(req, res) {
    try {
      const userId = req.user.id;
      const { type, startDate, endDate } = req.query;

      const history = await this.vitalSignsService.getHistory(
        userId,
        type,
        startDate,
        endDate
      );

      res.json({
        message: '获取成功',
        data: history
      });
    } catch (error) {
      res.status(500).json({ error: '服务器错误' });
    }
  }

  async getLatestVitalSigns(req, res) {
    try {
      const userId = req.user.id;
      const { type } = req.query;

      const latest = await this.vitalSignsService.getLatest(userId, type);

      res.json({
        message: '获取成功',
        data: latest
      });
    } catch (error) {
      res.status(500).json({ error: '服务器错误' });
    }
  }

  async analyzeVitalSigns(req, res) {
    try {
      const userId = req.user.id;
      const { type, period } = req.query;

      const analysis = await this.vitalSignsService.analyzeVitalSigns(
        userId,
        type,
        period
      );

      res.json({
        message: '分析成功',
        data: analysis
      });
    } catch (error) {
      res.status(500).json({ error: '服务器错误' });
    }
  }
}

module.exports = new VitalSignsController(); 