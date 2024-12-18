import { Injectable } from '@nestjs/common';

import { DrugDatabaseService } from '@/services/medication/drug-database.service';
import { PrescriptionService } from '@/services/medication/prescription.service';

@Injectable()
export class MedicationManagementService {
  constructor(
    private readonly drugDb: DrugDatabaseService,
    private readonly prescription: PrescriptionService,
  ) {}

  // 用药提醒
  async setupMedicationReminders(userId: string, medications: Medication[]): Promise<void> {
    // 验证药品信息
    await this.validateMedications(medications);

    // 设置提醒计划
    await this.createReminderSchedule(userId, medications);

    // 检查药品相互作用
    await this.checkDrugInteractions(medications);
  }

  // 库存管理
  async manageMedicationInventory(userId: string, inventory: MedicationInventory): Promise<void> {
    await this.updateInventory(userId, inventory);
    await this.checkLowStock(userId);
    await this.generateReplenishmentPlan(userId);
  }
}
