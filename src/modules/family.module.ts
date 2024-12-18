import { FamilyController } from '../controllers/family.controller';
import { FamilyMember } from '../entities/family-member.entity';
import { FamilyService } from '../services/family.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyMember])],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
