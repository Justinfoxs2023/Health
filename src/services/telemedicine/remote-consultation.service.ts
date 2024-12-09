import { Injectable } from '@nestjs/common';
import { WebRTCService } from '@/services/communication/webrtc.service';
import { DoctorMatchingService } from '@/services/doctor/doctor-matching.service';

@Injectable()
export class RemoteConsultationService {
  constructor(
    private readonly webrtc: WebRTCService,
    private readonly doctorMatching: DoctorMatchingService
  ) {}

  // 创建问诊会话
  async createConsultation(
    patientId: string,
    symptoms: string[],
    preferences: ConsultationPreferences
  ): Promise<ConsultationSession> {
    // 匹配医生
    const doctor = await this.doctorMatching.findAvailableDoctor(
      symptoms,
      preferences
    );

    // 创建会话
    const session = await this.initializeSession(patientId, doctor.id);
    
    // 建立连接
    await this.webrtc.establishConnection(session.id);

    return session;
  }

  // 管理问诊记录
  async manageConsultationRecords(sessionId: string): Promise<void> {
    // 记录问诊内容
    await this.recordConsultation(sessionId);
    
    // 生成问诊报告
    await this.generateConsultationReport(sessionId);
    
    // 更新健康档案
    await this.updateHealthRecord(sessionId);
  }
} 