import { Request, Response } from 'express';
import { DoctorService } from '../services/doctor.service';
import { Logger } from '../utils/logger';

export class DoctorController {
  private doctorService: DoctorService;
  private logger: Logger;

  constructor() {
    this.doctorService = new DoctorService();
    this.logger = new Logger('DoctorController');
  }

  /**
   * 获取患者列表
   */
  public async getPatientList(req: Request, res: Response) {
    try {
      const doctorId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const patients = await this.doctorService.getPatientList(
        doctorId,
        Number(page),
        Number(limit),
        status as string
      );

      return res.json({
        code: 200,
        data: patients
      });
    } catch (error) {
      this.logger.error('获取患者列表失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 查看患者详细信息
   */
  public async getPatientDetail(req: Request, res: Response) {
    try {
      const doctorId = req.user.id;
      const patientId = req.params.patientId;

      const patientDetail = await this.doctorService.getPatientDetail(
        doctorId,
        patientId
      );

      return res.json({
        code: 200,
        data: patientDetail
      });
    } catch (error) {
      this.logger.error('获取患者详情失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 开具处方
   */
  public async createPrescription(req: Request, res: Response) {
    try {
      const doctorId = req.user.id;
      const { patientId, medications, diagnosis, instructions } = req.body;

      const prescription = await this.doctorService.createPrescription({
        doctorId,
        patientId,
        medications,
        diagnosis,
        instructions
      });

      return res.status(201).json({
        code: 201,
        data: prescription,
        message: '处方创建成功'
      });
    } catch (error) {
      this.logger.error('创建处方失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  /**
   * 提供在线咨询
   */
  public async provideConsultation(req: Request, res: Response) {
    try {
      const doctorId = req.user.id;
      const { patientId, consultationType, content } = req.body;

      const consultation = await this.doctorService.createConsultation({
        doctorId,
        patientId,
        type: consultationType,
        content
      });

      return res.status(201).json({
        code: 201,
        data: consultation,
        message: '咨询记录创建成功'
      });
    } catch (error) {
      this.logger.error('创建咨询记录失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
} 