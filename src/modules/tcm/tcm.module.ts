import { ConstitutionAssessmentService } from '../../services/tcm/constitution-assessment.service';
import { HealthPreservationService } from '../../services/tcm/health-preservation.service';
import { MassageGuidanceService } from '../../services/tcm/massage-guidance.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeasonalDataSchema } from './schemas/seasonal-data.schema';
import { SeasonalService } from '../../services/tcm/seasonal.service';
import { TCMController } from './controllers/tcm.controller';
import { TCMKnowledgeBaseService } from '../../services/tcm/tcm-knowledge-base.service';
import { TCMKnowledgeSchema } from './schemas/tcm-knowledge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TCMKnowledge', schema: TCMKnowledgeSchema },
      { name: 'SeasonalData', schema: SeasonalDataSchema },
    ]),
  ],
  controllers: [TCMController],
  providers: [
    ConstitutionAssessmentService,
    HealthPreservationService,
    MassageGuidanceService,
    TCMKnowledgeBaseService,
    SeasonalService,
  ],
  exports: [
    ConstitutionAssessmentService,
    HealthPreservationService,
    MassageGuidanceService,
    TCMKnowledgeBaseService,
    SeasonalService,
  ],
})
export class TCMModule {}
