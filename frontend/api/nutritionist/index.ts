import { ApiResponse } from '../types';

export interface Nutritionist {
  id: string;
  name: string;
  avatar: string;
  title: string;
  hospital: string;
  department: string;
  specialty: string[];
  introduction: string;
  experience: number;
  rating: number;
  consultCount: number;
  onlinePrice: number;
  offlinePrice: number;
  availableTime: {
    date: string;
    times: string[];
  }[];
}

export interface Appointment {
  id: string;
  nutritionistId: string;
  date: Date;
  type: string;
  topic: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export const getNutritionists = async (params: {
  keyword?: string;
  specialty?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Nutritionist[]>> => {
  // API 实现
  return { code: 200, data: [], message: 'success' };
};

export const getNutritionistDetails = async (id: string): Promise<ApiResponse<Nutritionist>> => {
  // API 实现
  return { code: 200, data: {} as Nutritionist, message: 'success' };
};

export const createAppointment = async (params: {
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