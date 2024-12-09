import { Response } from 'express';
import { IAuthRequest } from '../types/auth';
import { Appointment } from '../models/appointment.model';
import { Consultation } from '../models/consultation.model';
import { DietPlan } from '../models/diet-plan.model';

export class NutritionistDashboardController {
  /**
   * 获取工作台概览数据
   */
  public async getDashboardOverview(req: IAuthRequest, res: Response) {
    try {
      const nutritionistId = req.user?.id;

      // 获取今日预约
      const todayAppointments = await Appointment.find({
        nutritionistId,
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      }).populate('userId', 'name avatar');

      // 获取待处理咨询
      const pendingConsultations = await Consultation.find({
        nutritionistId,
        status: '待回复'
      }).populate('userId', 'name avatar');

      // 获取本周数据统计
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      
      const weekStats = await Appointment.aggregate([
        {
          $match: {
            nutritionistId,
            date: { $gte: weekStart }
          }
        },
        {
          $group: {
            _id: { $dayOfWeek: '$date' },
            count: { $sum: 1 }
          }
        }
      ]);

      // 获取收入统计
      const incomeStats = await Appointment.aggregate([
        {
          $match: {
            nutritionistId,
            status: '已完成',
            paymentStatus: '已支付'
          }
        },
        {
          $group: {
            _id: { $month: '$date' },
            total: { $sum: '$price' }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          todayAppointments,
          pendingConsultations,
          weekStats,
          incomeStats
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 获取工作日程
   */
  public async getSchedule(req: IAuthRequest, res: Response) {
    try {
      const nutritionistId = req.user?.id;
      const { startDate, endDate } = req.query;

      const appointments = await Appointment.find({
        nutritionistId,
        date: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        }
      }).populate('userId', 'name avatar');

      res.json({
        success: true,
        data: appointments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 获取客户列表
   */
  public async getClients(req: IAuthRequest, res: Response) {
    try {
      const nutritionistId = req.user?.id;
      const { page = 1, limit = 10 } = req.query;

      const clients = await Appointment.aggregate([
        {
          $match: { nutritionistId }
        },
        {
          $group: {
            _id: '$userId',
            lastVisit: { $max: '$date' },
            visitCount: { $sum: 1 }
          }
        },
        {
          $sort: { lastVisit: -1 }
        },
        {
          $skip: (Number(page) - 1) * Number(limit)
        },
        {
          $limit: Number(limit)
        }
      ]);

      res.json({
        success: true,
        data: clients
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误'
      });
    }
  }
}

export const nutritionistDashboardController = new NutritionistDashboardController(); 