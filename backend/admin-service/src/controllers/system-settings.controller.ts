import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../di/types';
import { Logger } from '../types/logger';
import { SystemSettingsService } from '../services/system-settings.service';
import { AuditService } from '../services/audit.service';
import { BaseController } from './base.controller';

@injectable()
export class SystemSettingsController extends BaseController {
  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.SystemSettingsService) private settingsService: SystemSettingsService,
    @inject(TYPES.AuditService) private auditService: AuditService
  ) {
    super(logger);
  }

  async getSettings(req: Request, res: Response) {
    try {
      const settings = await this.settingsService.getSettings();
      this.handleSuccess(res, settings);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      const adminId = req.user?.id;
      const updates = req.body;

      const updatedSettings = await this.settingsService.updateSettings(updates);
      await this.auditService.logAction(adminId, 'update_settings', updates);

      this.handleSuccess(res, updatedSettings);
    } catch (error) {
      this.handleError(res, error);
    }
  }
} 