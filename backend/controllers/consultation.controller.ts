import { Response } from 'express';
import { IAuthRequest } from '../types/models';
import { Consultation } from '../models/consultation.model';
import { User } from '../models/user.model';
import { uploadImage } from '../utils/upload';

export class ConsultationController {
  /**
   * 创建咨询会话
   */
  public async createConsultation(req: IAuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { nutritionistId, type, content } = req.body;
      const files = req.files as Express.Multer.File[];

      // 验证营养师是否存在
      const nutritionist = await User.findOne({ _id: nutritionistId, role: 'nutritionist' });
      if (!nutritionist) {
        return res.status(404).json({
          success: false,
          message: '营养师不存在'
        });
      }

      // 上传附件
      const attachments = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const url = await uploadImage(file);
          attachments.push({
            type: file.mimetype,
            url,
            description: file.originalname
          });
        }
      }

      // 创建咨询记录
      const consultation = new Consultation({
        userId,
        nutritionistId,
        type,
        content,
        attachments
      });

      await consultation.save();

      res.status(201).json({
        success: true,
        data: consultation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 获取咨询历史
   */
  public async getConsultationHistory(req: IAuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 10 } = req.query;

      const consultations = await Consultation.find({ userId })
        .populate('nutritionistId', 'name avatar nutritionistProfile')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await Consultation.countDocuments({ userId });

      res.json({
        success: true,
        data: {
          consultations,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit)
          }
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
   * 更新咨询记录
   */
  public async updateConsultation(req: IAuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { content, recommendations, followUpDate } = req.body;
      const files = req.files as Express.Multer.File[];

      const consultation = await Consultation.findById(id);
      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: '咨询记录不存在'
        });
      }

      // 上传新附件
      if (files && files.length > 0) {
        for (const file of files) {
          const url = await uploadImage(file);
          consultation.attachments.push({
            type: file.mimetype,
            url,
            description: file.originalname
          });
        }
      }

      // 更新内容
      if (content) {
        consultation.content = { ...consultation.content, ...content };
      }
      if (recommendations) {
        consultation.content.recommendations = recommendations;
      }
      if (followUpDate) {
        consultation.followUpDate = new Date(followUpDate);
      }

      await consultation.save();

      res.json({
        success: true,
        data: consultation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误'
      });
    }
  }
}

export const consultationController = new ConsultationController(); 