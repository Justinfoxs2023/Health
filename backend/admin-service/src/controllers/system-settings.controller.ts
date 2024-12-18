import { AuditService } from '../services/audit.service';
import { BaseController } from './base.controller';
import { ILogger } from '../types/logger';
import { Request, Response } from 'express';
import { SystemSettingsService } from '../services/system-settings.service';
import { TYPES } from '../di/types';
import { injectable, inject } from 'inversify';

@injectable()
export class SystemSettingsController extends BaseController {
  constructor(
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.SystemSettingsService) private settingsService: SystemSettingsService,
    @inject(TYPES.AuditService) private auditService: AuditService,
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
