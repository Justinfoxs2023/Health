import { api } from '../utils/api';

export interface IConsultationRecord {
  /** id 的描述 */
  id: string;
  /** expertId 的描述 */
  expertId: string;
  /** userId 的描述 */
  userId: string;
  /** type 的描述 */
  type: string;
  /** status 的描述 */
  status: 'scheduled' | 'completed' | 'cancelled';
  /** scheduledAt 的描述 */
  scheduledAt: Date;
  /** duration 的描述 */
  duration: number;
  /** notes 的描述 */
  notes: string;
}

export class ConsultationRecordService {
  async getConsultationHistory(userId: string) {
    try {
      const response = await api.get(`/api/consultation/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error in consultation-record.service.ts:', '获取咨询记录失败:', error);
      throw error;
    }
  }

  async updateConsultationNotes(consultationId: string, notes: string) {
    try {
      const response = await api.put(`/api/consultation/notes/${consultationId}`, { notes });
      return response.data;
    } catch (error) {
      console.error('Error in consultation-record.service.ts:', '更新咨询记录失败:', error);
      throw error;
    }
  }
}
