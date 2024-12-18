import { IApiResponse } from '../types';

export interface IAppointment {
  /** id 的描述 */
  id: string;
  /** nutritionistId 的描述 */
  nutritionistId: string;
  /** userId 的描述 */
  userId: string;
  /** date 的描述 */
  date: string;
  /** type 的描述 */
  type: '线上咨询' | '线下咨询';
  /** topic 的描述 */
  topic: string;
  /** duration 的描述 */
  duration: number;
  /** price 的描述 */
  price: number;
  /** status 的描述 */
  status: '待确认' | '已确认' | '已完成' | '已取消';
  /** createdAt 的描述 */
  createdAt: string;
}

export const getMyAppointments = async (params: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<IApiResponse<IAppointment[]>> => {
  // API 实现
  return { code: 200, data: [], message: 'success' };
};

export const createAppointment = async (data: {
  nutritionistId: string;
  date: Date;
  type: string;
  topic: string;
  duration: number;
  price: number;
}): Promise<IApiResponse<IAppointment>> => {
  // API 实现
  return { code: 200, data: {} as IAppointment, message: 'success' };
};
