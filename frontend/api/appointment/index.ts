import { ApiResponse } from '../types';

export interface Appointment {
  id: string;
  nutritionistId: string;
  userId: string;
  date: string;
  type: '线上咨询' | '线下咨询';
  topic: string;
  duration: number;
  price: number;
  status: '待确认' | '已确认' | '已完成' | '已取消';
  createdAt: string;
}

export const getMyAppointments = async (params: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Appointment[]>> => {
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
}): Promise<ApiResponse<Appointment>> => {
  // API 实现
  return { code: 200, data: {} as Appointment, message: 'success' };
}; 