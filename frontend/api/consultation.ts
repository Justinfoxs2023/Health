import { IApiResponse } from './types';

export interface IExpert {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** avatar 的描述 */
  avatar: string;
  /** title 的描述 */
  title: string;
  /** hospital 的描述 */
  hospital: string;
  /** department 的描述 */
  department: string;
  /** specialties 的描述 */
  specialties: string[];
  /** rating 的描述 */
  rating: number;
  /** consultCount 的描述 */
  consultCount: number;
  /** price 的描述 */
  price: number;
  /** availableTime 的描述 */
  availableTime: {
    date: string;
    slots: string[];
  }[];
  /** introduction 的描述 */
  introduction: string;
  /** tags 的描述 */
  tags: string[];
}

export const getExperts = async (): Promise<IApiResponse<IExpert[]>> => {
  const response = await fetch('/api/consultation/experts');
  return response.json();
};

export const getExpertDetail = async (id: string): Promise<IApiResponse<IExpert>> => {
  const response = await fetch(`/api/consultation/experts/${id}`);
  return response.json();
};

export const bookConsultation = async (data: {
  expertId: string;
  date: string;
  timeSlot: string;
  description: string;
}): Promise<IApiResponse<void>> => {
  const response = await fetch('/api/consultation/book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export interface IConsultationRecord {
  /** id 的描述 */
  id: string;
  /** expert 的描述 */
  expert: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    hospital: string;
  };
  /** date 的描述 */
  date: string;
  /** timeSlot 的描述 */
  timeSlot: string;
  /** status 的描述 */
  status: 'upcoming' | 'completed' | 'cancelled';
  /** description 的描述 */
  description: string;
  /** diagnosis 的描述 */
  diagnosis?: string;
  /** prescription 的描述 */
  prescription?: string;
  /** followUpDate 的描述 */
  followUpDate?: string;
  /** price 的描述 */
  price: number;
}

export const getConsultationHistory = async (): Promise<IApiResponse<IConsultationRecord[]>> => {
  const response = await fetch('/api/consultation/history');
  return response.json();
};
