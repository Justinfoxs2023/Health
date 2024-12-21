/**
 * @fileoverview TS 文件 consultation.service.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export class ConsultationService {
  private readonly consultationRepo: ConsultationRepository;
  private readonly expertRepo: ExpertRepository;

  // 发起咨询
  async createConsultation(data: CreateConsultationDTO): Promise<Consultation> {
    try {
      // 验证专家可用性
      await this.validateExpertAvailability(data.expertId, data.scheduleTime);

      const consultation = await this.consultationRepo.create({
        ...data,
        status: 'pending',
        createTime: new Date(),
      });

      // 发送通知给专家
      await this.notifyExpert(consultation);

      return consultation;
    } catch (error) {
      this.logger.error('创建咨询失败', error);
      throw error;
    }
  }

  // 专家回复
  async replyConsultation(consultationId: string, reply: ReplyDTO): Promise<void> {
    try {
      await this.consultationRepo.update(consultationId, {
        reply,
        replyTime: new Date(),
        status: 'replied',
      });

      // 发送通知给用户
      await this.notifyUser(consultationId, reply);
    } catch (error) {
      this.logger.error('回复咨询失���', error);
      throw error;
    }
  }
}
