import { api } from '../utils/api';

export interface ConsultationRecord {
  id: string;
  expertId: string;
  userId: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledAt: Date;
  duration: number;
  notes: string;
}

export class ConsultationRecordService {
  async getConsultationHistory(userId: string) {
    try {
      const response = await api.get(`/api/consultation/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('获取咨询记录失败:', error);
      throw error;
    }
  }

  async updateConsultationNotes(consultationId: string, notes: string) {
    try {
      const response = await api.put(`/api/consultation/notes/${consultationId}`, { notes });
      return response.data;
    } catch (error) {
      console.error('更新咨询记录失败:', error);
      throw error;
    }
  }
} 