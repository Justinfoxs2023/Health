import { AlertModule } from '../alert/alert.module';
import { DatabaseMonitoringService } from './monitoring.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [AlertModule],
  providers: [DatabaseMonitoringService],
  exports: [DatabaseMonitoringService],
})
export class DatabaseMonitoringModule {}
