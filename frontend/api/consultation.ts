import { ApiResponse } from './types';

export interface Expert {
  id: string;
  name: string;
  avatar: string;
  title: string;
  hospital: string;
  department: string;
  specialties: string[];
  rating: number;
  consultCount: number;
  price: number;
  availableTime: {
    date: string;
    slots: string[];
  }[];
  introduction: string;
  tags: string[];
}

export const getExperts = async (): Promise<ApiResponse<Expert[]>> => {
  const response = await fetch('/api/consultation/experts');
  return response.json();
};

export const getExpertDetail = async (id: string): Promise<ApiResponse<Expert>> => {
  const response = await fetch(`/api/consultation/experts/${id}`);
  return response.json();
};

export const bookConsultation = async (data: {
  expertId: string;
  date: string;
  timeSlot: string;
  description: string;
}): Promise<ApiResponse<void>> => {
  const response = await fetch('/api/consultation/book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export interface ConsultationRecord {
  id: string;
  expert: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    hospital: string;
  };
  date: string;
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  description: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: string;
  price: number;
}

export const getConsultationHistory = async (): Promise<ApiResponse<ConsultationRecord[]>> => {
  const response = await fetch('/api/consultation/history');
  return response.json();
}; 