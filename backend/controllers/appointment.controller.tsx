import { Response } from 'express';
import { Appointment } from '../models/appointment.model';
import { User } from '../models/user.model';
import { IAuthRequest } from '../types/models';
import { Types } from 'mongoose';

export class AppointmentController {
  /**
   * 创建预约
   */
  public async createAppointment(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { nutritionistId, date, ...appointmentData } = req.body;

      // 检查营养师是否存在且可用
      const nutritionist = await User.findOne({
        _id: nutritionistId,
        role: 'nutritionist',
        'nutritionistProfile.availability.isWorking': true
      });

      if (!nutritionist) {
        res.status(404).json({
          success: false,
          message: '未找到该营养师或营养师不可预约'
        });
        return;
      }

      // 检查时间段是否可预约
      const appointmentDate = new Date(date);
      const dayOfWeek = appointmentDate.getDay() || 7;
      const availability = nutritionist.nutritionistProfile?.availability.find(
        a => a.dayOfWeek === dayOfWeek
      );

      if (!availability?.isWorking) {
        res.status(400).json({
          success: false,
          message: '该时间段营养师不工作'
        });
        return;
      }

      // 检查预约数量是否超限
      const existingAppointments = await Appointment.countDocuments({
        nutritionistId,
        date: {
          $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          $lt: new Date(appointmentDate.setHours(24, 0, 0, 0))
        },
        status: { $in: ['待确认', '已确认'] }
      });

      if (existingAppointments >= (availability.maxAppointments || 8)) {
        res.status(400).json({
          success: false,
          message: '该时间段预约已满'
        });
        return;
      }

      const appointment = new Appointment({
        userId,
        nutritionistId,
        date,
        ...appointmentData
      });

      await appointment.save();

      res.status(201).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 获取预约列表
   */
  public async getAppointments(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { role } = req.user!;
      const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

      const query: any = role === 'nutritionist' ? 
        { nutritionistId: userId } : { userId };

      if (status) {
        query.status = status;
      }

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const appointments = await Appointment.find(query)
        .populate('userId', 'name avatar')
        .populate('nutritionistId', 'name avatar nutritionistProfile')
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Appointment.countDocuments(query);

      res.json({
        success: true,
        data: appointments,
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
   * 更新预约状态
   */
  public async updateAppointmentStatus(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;
      const { role } = req.user!;

      const appointment = await Appointment.findOne({
        _id: id,
        [role === 'nutritionist' ? 'nutritionistId' : 'userId']: userId
      });

      if (!appointment) {
        res.status(404).json({
          success: false,
          message: '未找到该预约'
        });
        return;
      }

      // 检查状态变更权限
      if (!this.canUpdateStatus(role, appointment.status, status)) {
        res.status(403).json({
          success: false,
          message: '无权进行此操作'
        });
        return;
      }

      appointment.status = status;
      await appointment.save();

      res.json({
        success: true,
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 添加咨询记录
   */
  public async addConsultationRecord(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const consultationRecord = req.body;

      const appointment = await Appointment.findOne({
        _id: id,
        nutritionistId: userId,
        status: '已确认'
      });

      if (!appointment) {
        res.status(404).json({
          success: false,
          message: '未找到该预约或预约未确认'
        });
        return;
      }

      appointment.consultationRecord = consultationRecord;
      appointment.status = '已完成';
      await appointment.save();

      res.json({
        success: true,
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 评价预约
   */
  public async rateAppointment(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { score, comment } = req.body;

      const appointment = await Appointment.findOne({
        _id: id,
        userId,
        status: '已完成'
      });

      if (!appointment) {
        res.status(404).json({
          success: false,
          message: '未找到该预约或预约未完成'
        });
        return;
      }

      if (appointment.rating) {
        res.status(400).json({
          success: false,
          message: '已评价过该预约'
        });
        return;
      }

      appointment.rating = {
        score,
        comment,
        createdAt: new Date()
      };
      await appointment.save();

      // 更新营养师评分
      await this.updateNutritionistRating(appointment.nutritionistId);

      res.json({
        success: true,
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * 检查是否可以更新状态
   */
  private canUpdateStatus(role: string, currentStatus: string, newStatus: string): boolean {
    if (role === 'nutritionist') {
      return (currentStatus === '待确认' && ['已确认', '已取消'].includes(newStatus)) ||
             (currentStatus === '已确认' && newStatus === '已完成');
    }
    return currentStatus === '待确认' && newStatus === '已取消';
  }

  /**
   * 更新营养师评分
   */
  private async updateNutritionistRating(nutritionistId: string | Types.ObjectId) {
    const id = nutritionistId.toString();
    
    const appointments = await Appointment.find({
      nutritionistId: id,
      status: 'completed',
      'rating.score': { $exists: true }
    });

    const totalRating = appointments.reduce((sum, app) => sum + (app.rating?.score || 0), 0);
    const averageRating = appointments.length > 0 ? Number((totalRating / appointments.length).toFixed(1)) : 0;

    await User.findByIdAndUpdate(id, {
      'nutritionistProfile.rating': averageRating
    });
  }
}

export const appointmentController = new AppointmentController(); 