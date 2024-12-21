import { ExercisePlan } from '../models/exercise-plan.model';
import { IAuthRequest, IExercisePlan } from '../types/models';
import { Response } from 'express';
import { WorkoutLog } from '../models/workout-log.model';

export class ExercisePlanController {
  /**
   * 创建运动计划
   */
  public async createPlan(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const planData = req.body;

      // 计算总训练次数
      const totalWorkouts =
        planData.schedule.length *
        Math.ceil(
          (new Date(planData.endDate).getTime() - new Date(planData.startDate).getTime()) /
            (7 * 24 * 60 * 60 * 1000),
        );

      const plan = new ExercisePlan({
        userId,
        ...planData,
        progress: {
          completedWorkouts: 0,
          totalWorkouts,
          adherenceRate: 0,
        },
      });

      await plan.save();

      res.status(201).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 获取用户的运动计划列表
   */
  public async getUserPlans(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { status, page = 1, limit = 10 } = req.query;

      const query: any = { userId };
      if (status) query.status = status;

      const skip = (Number(page) - 1) * Number(limit);
      const plans = await ExercisePlan.find(query)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await ExercisePlan.countDocuments(query);

      res.json({
        success: true,
        data: plans,
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
   * 获取计划详情
   */
  public async getPlanDetails(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const plan = await ExercisePlan.findOne({ _id: id, userId });
      if (!plan) {
        res.status(404).json({
          success: false,
          message: '未找到该运动计划',
        });
        return;
      }

      // 获取相关的运动记录
      const workoutLogs = await WorkoutLog.find({
        userId,
        planId: id,
        date: { $gte: plan.startDate, $lte: plan.endDate },
      }).sort({ date: -1 });

      res.json({
        success: true,
        data: {
          plan,
          workoutLogs,
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
   * 更新计划状态
   */
  public async updatePlanStatus(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      const plan = await ExercisePlan.findOne({ _id: id, userId });
      if (!plan) {
        res.status(404).json({
          success: false,
          message: '未找到该运动计划',
        });
        return;
      }

      plan.status = status;
      await plan.save();

      res.json({
        success: true,
        data: plan,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 更新计划进度
   */
  public async updateProgress(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const plan = await ExercisePlan.findOne({ _id: id, userId });
      if (!plan) {
        res.status(404).json({
          success: false,
          message: '未找到该运动计划',
        });
        return;
      }

      // 计算完成的训练次数
      const completedWorkouts = await WorkoutLog.countDocuments({
        userId,
        planId: id,
        date: { $gte: plan.startDate, $lte: plan.endDate },
      });

      // 更新进度
      plan.progress = {
        completedWorkouts,
        totalWorkouts: plan.progress.totalWorkouts,
        adherenceRate: (completedWorkouts / plan.progress.totalWorkouts) * 100,
      };

      await plan.save();

      res.json({
        success: true,
        data: plan.progress,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const exercisePlanController = new ExercisePlanController();
