import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyMember } from '../entities/family-member.entity';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>
  ) {}

  async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    return this.familyMemberRepository.find({
      where: { familyId }
    });
  }

  async addFamilyMember(data: Partial<FamilyMember>): Promise<FamilyMember> {
    const member = this.familyMemberRepository.create(data);
    return this.familyMemberRepository.save(member);
  }

  async updateHealthStatus(id: string, healthStatus: string): Promise<FamilyMember> {
    await this.familyMemberRepository.update(id, { healthStatus });
    return this.familyMemberRepository.findOne({ where: { id } });
  }
} 