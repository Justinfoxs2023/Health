import { ExercisePlan } from '../models/exercise-plan.model';
import { IAuthRequest } from '../types/models';
import { Response } from 'express';
import { WorkoutLog } from '../models/workout-log.model';

export class WorkoutLogController {
  /**
   * 记录运动
   */
  public async logWorkout(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const workoutData = req.body;

      const log = new WorkoutLog({
        userId,
        ...workoutData,
      });

      await log.save();

      // 如果关联了运动计划,更新计划进度
      if (workoutData.planId) {
        const plan = await ExercisePlan.findById(workoutData.planId);
        if (plan) {
          plan.progress.completedWorkouts += 1;
          plan.progress.adherenceRate =
            (plan.progress.completedWorkouts / plan.progress.totalWorkouts) * 100;
          await plan.save();
        }
      }

      res.status(201).json({
        success: true,
        data: log,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 获取运动记录列表
   */
  public async getWorkoutLogs(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { startDate, endDate, type, page = 1, limit = 10 } = req.query;

      const query: any = { userId };

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      if (type) {
        query.type = type;
      }

      const skip = (Number(page) - 1) * Number(limit);
      const logs = await WorkoutLog.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit));

      const total = await WorkoutLog.countDocuments(query);

      res.json({
        success: true,
        data: logs,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 获取运动统计
   */
  public async getWorkoutStats(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { period = '7d' } = req.query;

      const startDate = this.getStartDateForPeriod(period as string);
      const logs = await WorkoutLog.find({
        userId,
        date: { $gte: startDate },
      });

      const stats = {
        totalWorkouts: logs.length,
        totalDuration: logs.reduce((sum, log) => sum + log.duration, 0),
        totalCalories: logs.reduce((sum, log) => sum + log.caloriesBurned, 0),
        byType: this.groupByType(logs),
        byIntensity: this.groupByIntensity(logs),
        averageHeartRate: this.calculateAverageHeartRate(logs),
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 获取统计周期的起始日期
   */
  private getStartDateForPeriod(period: string): Date {
    const now = new Date();
    switch (period) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7));
      case '30d':
        return new Date(now.setDate(now.getDate() - 30));
      case '90d':
        return new Date(now.setDate(now.getDate() - 90));
      default:
        return new Date(now.setDate(now.getDate() - 7));
    }
  }

  /**
   * 按运动类型分组统计
   */
  private groupByType(logs: any[]): any {
    return logs.reduce((acc, log) => {
      if (!acc[log.type]) {
        acc[log.type] = {
          count: 0,
          duration: 0,
          calories: 0,
        };
      }
      acc[log.type].count++;
      acc[log.type].duration += log.duration;
      acc[log.type].calories += log.caloriesBurned;
      return acc;
    }, {});
  }

  /**
   * 按强度分组统计
   */
  private groupByIntensity(logs: any[]): any {
    return logs.reduce((acc, log) => {
      if (!acc[log.intensity]) {
        acc[log.intensity] = 0;
      }
      acc[log.intensity]++;
      return acc;
    }, {});
  }

  /**
   * 计算平均心率
   */
  private calculateAverageHeartRate(logs: any[]): number {
    const logsWithHeartRate = logs.filter(log => log.heartRate?.avg);
    if (logsWithHeartRate.length === 0) return 0;

    const sum = logsWithHeartRate.reduce((sum, log) => sum + log.heartRate.avg, 0);
    return Math.round(sum / logsWithHeartRate.length);
  }
}

export const workoutLogController = new WorkoutLogController();
