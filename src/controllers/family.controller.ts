import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { FamilyService } from '../services/family.service';
import { FamilyMember } from '../entities/family-member.entity';

@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Get(':familyId/members')
  async getFamilyMembers(@Param('familyId') familyId: string) {
    return this.familyService.getFamilyMembers(familyId);
  }

  @Post('members')
  async addFamilyMember(@Body() data: Partial<FamilyMember>) {
    return this.familyService.addFamilyMember(data);
  }

  @Put('members/:id/health-status')
  async updateHealthStatus(
    @Param('id') id: string,
    @Body('healthStatus') healthStatus: string
  ) {
    return this.familyService.updateHealthStatus(id, healthStatus);
  }
} 