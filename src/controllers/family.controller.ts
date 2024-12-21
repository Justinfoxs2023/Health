import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { FamilyMember } from '../entities/family-member.entity';
import { FamilyService } from '../services/family.service';

@Controller()
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Get()
  async getFamilyMembers(@Param() familyId: string) {
    return this.familyService.getFamilyMembers(familyId);
  }

  @Post()
  async addFamilyMember(@Body() data: Partial<FamilyMember>) {
    return this.familyService.addFamilyMember(data);
  }

  @Put()
  async updateHealthStatus(@Param() id: string, @Body() healthStatus: string) {
    return this.familyService.updateHealthStatus(id, healthStatus);
  }
}
