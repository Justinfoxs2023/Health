import { Logger } from '../utils/logger';
import { Request, Response } from 'express';
import { TCMService } from '../services/tcm.service';

export class TCMController {
  private tcmService: TCMService;
  private logger: Logger;

  constructor() {
    this.tcmService = new TCMService();
    this.logger = new Logger('TCMController');
  }

  /**
   * 中医体质辨识
   */
  public async constitutionAssessment(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { symptoms, signs, pulseData, tongueData } = req.body;

      const assessment = await this.tcmService.assessConstitution({
        clientId,
        symptoms,
        signs,
        pulseData,
        tongueData,
        date: new Date(),
      });

      return res.json({
        code: 200,
        data: assessment,
        message: '体质辨识完成',
      });
    } catch (error) {
      this.logger.error('体质辨识失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 开具中药处方
   */
  public async createHerbalPrescription(req: Request, res: Response) {
    try {
      const doctorId = req.user.id;
      const { clientId, diagnosis, herbs, instructions, duration } = req.body;

      const prescription = await this.tcmService.createPrescription({
        doctorId,
        clientId,
        diagnosis,
        herbs,
        instructions,
        duration,
        date: new Date(),
      });

      return res.status(201).json({
        code: 201,
        data: prescription,
        message: '处方创建成功',
      });
    } catch (error) {
      this.logger.error('创建处方失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 制定养生方案
   */
  public async createWellnessPlan(req: Request, res: Response) {
    try {
      const doctorId = req.user.id;
      const { clientId, constitution, recommendations, lifestyle, diet } = req.body;

      const wellnessPlan = await this.tcmService.createWellnessPlan({
        doctorId,
        clientId,
        constitution,
        recommendations,
        lifestyle,
        diet,
        startDate: new Date(),
      });

      return res.status(201).json({
        code: 201,
        data: wellnessPlan,
        message: '养生方案创建成功',
      });
    } catch (error) {
      this.logger.error('创建养生方案失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  /**
   * 穴位推拿指导
   */
  public async acupointMassageGuidance(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { acupoints, techniques, precautions } = req.body;

      const guidance = await this.tcmService.createMassageGuidance({
        clientId,
        acupoints,
        techniques,
        precautions,
        date: new Date(),
      });

      return res.json({
        code: 200,
        data: guidance,
        message: '推拿指导创建成功',
      });
    } catch (error) {
      this.logger.error('创建推拿指导失败', error);
      return res.status(500).json({
        code: 500,
        message: '服务器错误',
      });
    }
  }
}
