import { Injectable } from '@nestjs/common';
import { HealthProductInquiry } from '../types';
import { ProfessionalService } from '../../professional/professional.service';

@Injectable()
export class HealthConsultationService {
  constructor(
    private readonly professionalService: ProfessionalService
  ) {}

  // 创建咨询
  async createInquiry(params: {
    userId: string;
    productId: string;
    type: 'usage' | 'safety' | 'effectiveness' | 'insurance' | 'other';
    question: string;
  }): Promise<HealthProductInquiry> {
    // 1. 验证用户和商品
    await this.validateInquiry(params);
    
    // 2. 创建咨询记录
    const inquiry = await this.saveInquiry(params);
    
    // 3. 分配专业人员
    await this.assignProfessional(inquiry);
    
    return inquiry;
  }

  // 获取专业回答
  async getProfessionalResponse(inquiryId: string): Promise<any> {
    // 1. 获取咨询记录
    const inquiry = await this.getInquiry(inquiryId);
    
    // 2. 检查专业回答
    if (inquiry.professionalResponse) {
      return inquiry.professionalResponse;
    }
    
    // 3. 生成AI辅助回答
    return this.generateAIResponse(inquiry);
  }

  // 追加问题
  async addFollowUpQuestion(inquiryId: string, question: string): Promise<void> {
    // 1. 验证咨询状态
    const inquiry = await this.getInquiry(inquiryId);
    
    // 2. 添加追问
    inquiry.followUps.push({
      question,
      response: '',
      date: new Date()
    });
    
    // 3. 通知专业人员
    await this.notifyProfessional(inquiry);
  }

  // 满意度评价
  async rateProfessionalResponse(inquiryId: string, rating: number, feedback?: string): Promise<void> {
    // 1. 更新评价
    await this.updateInquiryRating(inquiryId, rating, feedback);
    
    // 2. 更新专业人员评分
    await this.updateProfessionalRating(inquiryId, rating);
  }

  // 私有方法
  private async validateInquiry(params: any): Promise<void> {
    // 实现验证逻辑
  }

  private async saveInquiry(params: any): Promise<HealthProductInquiry> {
    // 实现保存逻辑
    return null;
  }

  private async assignProfessional(inquiry: HealthProductInquiry): Promise<void> {
    // 实现分配逻辑
  }
} 