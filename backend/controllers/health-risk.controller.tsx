import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { HealthRisk } from '../models/health-risk.model';
import { IHealthRisk } from '../types/models';

interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

export class HealthRiskController {
  /**
   * 获取用户的风险预警列表
   */
  public async getUserRisks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const { status, severity, page = 1, limit = 10 } = req.query;

      const query: any = { userId };
      if (status) query.status = status;
      if (severity) query.severity = severity;

      const skip = (Number(page) - 1) * Number(limit);
      const risks = await HealthRisk.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await HealthRisk.countDocuments(query);

      res.json({
        success: true,
        data: risks,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 更新风险状态
   */
  public async updateRiskStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, handlingRecord } = req.body;
      const userId = req.user.id;

      const risk = await HealthRisk.findById(id);
      
      if (!risk) {
        res.status(404).json({
          success: false,
          message: '未找到该风险记录'
        });
        return;
      }

      risk.status = status;
      if (handlingRecord) {
        risk.handlingRecords.push({
          ...handlingRecord,
          time: new Date(),
          handler: new Types.ObjectId(userId)
        });
      }

      await risk.save();

      res.json({
        success: true,
        data: risk
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取风险统计
   */
  public async getRiskStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;

      const stats = await HealthRisk.aggregate([
        { $match: { userId: new Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalRisks: { $sum: 1 },
            activeRisks: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            highSeverityRisks: {
              $sum: { $cond: [{ $eq: ['$severity', '高'] }, 1, 0] }
            },
            risksByType: {
              $push: {
                type: '$riskType',
                severity: '$severity',
                status: '$status'
              }
            }
          }
        }
      ]);

      res.json({
        success: true,
        data: stats[0] || {
          totalRisks: 0,
          activeRisks: 0,
          highSeverityRisks: 0,
          risksByType: []
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const healthRiskController = new HealthRiskController(); 